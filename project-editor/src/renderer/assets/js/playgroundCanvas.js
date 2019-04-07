import RPGinia from '../../../../../engine/src/RPGinia';
import { ipcRenderer } from 'electron';
import selectObjects from './selectObjects';

let engine;
let app;
let world;
let cam;
let load;
let loop;

let store;
let storeGetters;

export default function initPlayground(data, projStore) {
    store = projStore;
    storeGetters = store.getters;

    engine = new RPGinia(`file://${data.appPath}`);
    app = new engine.App(
        'RPGinia project editor playground', 
        document.querySelector('canvas#playground'), 
        isAutoResizingEnabled() ? [ // If auto resizing is enabled - set sizes from canvas container width and height
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ] : storeGetters['EditorData/playgroundSizes'] // Else - get fixed value from store
    );
    world = new app.World(false, false);
    cam = new app.Camera();
    load = new app.Loaders();

    const loadedLevel = load.jsonFile('level', data.path.replace(data.appPath, ''));

    // Initialize the playground's world
    world.initialize({
        app: app,
        camera: cam,
        levels: loadedLevel,
        loaders: load
    });

    // Set up project store
    store.dispatch('setUpProjectStore', { appPath: data.appPath, data: world.currentLevel });

    // Mouse movement event
    app.canvas.addEventListener('mousemove', e => {
        const elementsInLevel = world.currentLevel.data.elements;
        const index = elementsInLevel.findIndex(item => item.$id === storeGetters.selectedObjects[0]);
        const necessaryElement = elementsInLevel[index];
        const { altKey, buttons, offsetX, offsetY, movementX, movementY } = e;

        // If alt key and left mouse button are pressed - move camera and set cursor
        if(altKey && buttons === 1) {
            cam.move(movementX, movementY);
            app.canvas.style.cursor = '-webkit-grabbing';
        } 

        else {
            app.canvas.style.cursor = 'default';
        }

        /**
         * If alt key isn't pressed
         * but pressed left mouse button is pressed
         * and mouse coordinates are on the object - move object
         */
        if(
            !altKey 
            && buttons === 1
            && elementsInLevel.findIndex(
                    item => {
                        const objectCoordinations = item.settings.coords;

                        return offsetX >= objectCoordinations[0] + cam.x
                            && offsetX <= objectCoordinations[0] + objectCoordinations[2] + cam.x
                            && offsetY >= objectCoordinations[1] + cam.y
                            && offsetY <= objectCoordinations[1] + objectCoordinations[3] + cam.y;
                    }
                ) !== -1
            && storeGetters.selectedObjects.length > 0
        ) {
            necessaryElement.settings.coords[0] += movementX;
            necessaryElement.settings.coords[1] += movementY;
        }
    });

    // Select object in playground
    app.canvas.addEventListener('click', e => {
        if(!e.altKey) {
            selectObjects(e, store, cam);
        }
    });

    // Create object
    ipcRenderer.on('createObject', (e, object) => {
        world.currentLevel.data.elements.push(
            object.type !== 'sprite' 
            ? world._prepareObject(object) 
            : world._prepareObject(object, storeGetters.spriteSheets)
        );

        store.commit('addObject');

        world._sortElements();
    });

    // Set sprite to another
    ipcRenderer.on('setSprite', (e, arg) => {
        const { spriteId, spriteIndex, spriteSheetIndex } = arg;

        const elementsInLevel = world.currentLevel.data.elements;
        const requiredSprite = elementsInLevel[elementsInLevel.findIndex(item => item.$id === spriteId)];
        const spriteIndexes = requiredSprite.settings.settings;
        const framesInSprite = requiredSprite._spriteSheets[spriteSheetIndex].sprites[spriteIndex].frames;

        spriteIndexes.spriteSheetIndex = spriteSheetIndex;
        spriteIndexes.spriteIndex = spriteIndex;

        if(framesInSprite && spriteIndexes.frameIndex === undefined) {
            spriteIndexes.frameIndex = 0;
        }

        else if(framesInSprite === undefined && spriteIndexes.frameIndex) {
            delete spriteIndexes.frameIndex;
        }

        requiredSprite.settings.image.src = `file://${requiredSprite._appPath.replace('file://', '').replace(/\\/g, '/')}/${requiredSprite._spriteSheets[spriteSheetIndex].file}`;
    });

    // App window resizing event
    window.addEventListener('resize', e => {
        const { clientWidth, clientHeight } = document.querySelector('.canvas_container');

        if(isAutoResizingEnabled()) {
            app.sizes = [clientWidth, clientHeight];
        }
    });

    // Sort objects by layer
    ipcRenderer.on('sortObjectsByLayers', e => {
        world._sortElements();
    });

    // Repeat object event
    ipcRenderer.on('repeatObject', (e, arg) => {
        let { repeatedObject, repeatByColumn, repeatByRow, horizontalInterval, verticalInterval } = arg;

        // Repeat by horizontal
        for(let i = 1; i <= repeatByColumn; i++) {
            // Method of cloning original object - parsing object as string
            let settings = JSON.parse(JSON.stringify(repeatedObject._settings));

            // Set new settings for clone object
            settings.name = `${settings.name} (Repeated - ${i})`;
            settings.coords[0] = settings.coords[0] + horizontalInterval * i;

            // Adding clone object to a playground and store
            world.currentLevel.data.elements.push(
                settings.type !== 'sprite'
                ? world._prepareObject(settings)
                : world._prepareObject(settings, storeGetters.spriteSheets)
            );
            store.commit('addObject');
        }

        // Repeat by vertical
        for(let i = 1; i <= repeatByRow; i++) {
            // Method of cloning original object - parsing object as string
            let settings = JSON.parse(JSON.stringify(repeatedObject._settings));

            // Set new settings for clone object
            settings.name = `${settings.name} (Repeated - ${i})`;
            settings.coords[1] = settings.coords[1] + verticalInterval * i;

            // Adding clone object to a playground and store
            world.currentLevel.data.elements.push(
                settings.type !== 'sprite'
                ? world._prepareObject(settings)
                : world._prepareObject(settings, storeGetters.spriteSheets)
            );
            store.commit('addObject');
        }

        // Sort objects by their layer
        world._sortElements();
    });

    // Defining loop for drawing objects in the playground
    loop = () => {
        app.clearPlayground();
        world.draw();

        // Draw borders of objects
        for(let selectedId of storeGetters.selectedObjects) {
            const selectedObject = storeGetters.projectObjects[storeGetters.projectObjects.findIndex(item => item.$id === selectedId)];

            app.context.strokeStyle = '#ffffff';
            app.context.lineWidth = 2;
            app.context.setLineDash([5, 5]);
            app.context.beginPath();
            
            app.context.rect(
                cam.x + selectedObject.settings.coords[0],
                cam.y + selectedObject.settings.coords[1],
                selectedObject.settings.coords[2],
                selectedObject.settings.coords[3]
            );

            app.context.stroke();
            app.context.setLineDash([]);
            app.context.lineWidth = 1;
            app.context.strokeStyle = '#000000';
        }

        requestAnimationFrame(loop);
    }
    loop();
}

// The function of checking the possibility of changing the size of the playground
function isAutoResizingEnabled() {
    return storeGetters['EditorData/autoPlaygroundSizesEnabled'];
}