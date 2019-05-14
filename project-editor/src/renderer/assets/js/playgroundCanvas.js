import RPGinia from '../../../../../engine/src/RPGinia';
import { ipcRenderer } from 'electron';
import selectObjects from './selectObjects';

let app = null;
let world = null;
let cam = null;
let load = null;
let loop = null;

let store = null;
let storeGetters = null;

export default async function initPlayground(data, projStore) {
    const {appPath, path, editorData} = data;

    store = projStore;
    storeGetters = store.getters;

    app = new RPGinia(
        `file://${appPath}`, 
        false, 
        'RPGinia project editor playground',
        document.querySelector('canvas#playground'),
        editorData.playground.autoSizesEnabled ? [ // If auto resizing is enabled - set sizes from canvas container width and height
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ] : storeGetters['EditorData/playgroundSizes'] // Else - get fixed value from store
    );

    load = new RPGinia.Loaders(app);
    world = new RPGinia.World(app, false);
    cam = world.camera;

    const editorLevel = await load.loadLevel(path.replace(appPath, ''));

    if (editorLevel.data.settings.spriteSheetPath === undefined && editorLevel.data.settings.spriteSheetName !== undefined ) {
        await load.loadSpriteSheet(editorLevel.data.settings.spriteSheetName, data.spriteSheetPath.replace(data.appPath, ''));
    }

    await world.setLevel(editorLevel);

    // Set up project store
    store.dispatch('setUpProjectStore', {
        appPath: appPath,
        settings: editorLevel.data.settings,
        spriteSheets: load.spriteSheets,
        data: await world.levelManager.getActiveLevel() 
    });

    // Mouse movement event
    app.canvas.addEventListener('mousemove', async (e) => {
        const currentLevel = await world.levelManager.getActiveLevel();
        const elementsInLevel = currentLevel._objects;
        const index = elementsInLevel.findIndex(item => item.$id === storeGetters.selectedObjects[0]);
        const necessaryElement = elementsInLevel[index];
        const { altKey, buttons, offsetX, offsetY, movementX, movementY } = e;

        // If alt key and left mouse button are pressed - move camera and set cursor
        if(altKey && buttons === 1) {
            cam.move(-movementX, -movementY);
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
                        const objectCoordinations = item._settings.coords;

                        return offsetX >= objectCoordinations[0] - cam.x
                            && offsetX <= objectCoordinations[0] + objectCoordinations[2] - cam.x
                            && offsetY >= objectCoordinations[1] - cam.y
                            && offsetY <= objectCoordinations[1] + objectCoordinations[3] - cam.y;
                    }
                ) !== -1
            && storeGetters.selectedObjects.length > 0
        ) {
            necessaryElement.settings.coords[0] = necessaryElement.settings.coords[0] + movementX;
            necessaryElement.settings.coords[1] = necessaryElement.settings.coords[1] + movementY;
        }
    });

    // Select object in playground
    app.canvas.addEventListener('click', e => {
        if(!e.altKey) {
            selectObjects(e, store, cam);
        }
    });

    // Create object
    ipcRenderer.on('createObject', async (e, object) => {
        // world.currentLevel.data.elements.push(
        //     object.type !== 'sprite' 
        //     ? world._prepareObject(object) 
        //     : world._prepareObject(object, storeGetters.spriteSheets)
        // );

        await world.addObjectInCurrentLevel(object);
        store.commit('addObject');
    });

    // Set sprite to another
    ipcRenderer.on('setSprite', async (e, arg) => {
        const { spriteSheetIndex, spriteIndex } = arg;

        const currentLevel = await world.levelManager.getActiveLevel();
        const objectsInLevel = currentLevel._objects;
        const requiredSprite = objectsInLevel[storeGetters.projectObjects.findIndex(item => item.$id === storeGetters.selectedObjects[0])];

        const spriteIndexes = requiredSprite.settings.settings;

        const framesInSprite = requiredSprite._currentSpriteSheet.sprites[spriteIndex].frames;

        spriteIndexes.spriteSheetIndex = spriteSheetIndex;
        spriteIndexes.spriteIndex = spriteIndex;

        if (framesInSprite && spriteIndexes.spriteAnimation === undefined) {
            requiredSprite._setUpSettingsForAnimatedSprite();
        }

        else if (framesInSprite === undefined && spriteIndexes.frameIndex) {
            delete requiredSprite.settings.settings.spriteAnimation;
        }

        requiredSprite.settings.image.src = `file://${requiredSprite._appPath.replace('file://', '').replace(/\\/g, '/')}/${requiredSprite._currentSpriteSheet.file}`;
    });

    // App window resizing event
    window.addEventListener('resize', e => {
        const { clientWidth, clientHeight } = document.querySelector('.canvas_container');

        if (editorData.playground.autoSizesEnabled) {
            app.sizes = [clientWidth, clientHeight];
        }
    });

    // Sort objects by layer
    ipcRenderer.on('sortObjectsByLayers', e => {
        world._sortElements();
    });

    // Repeat object event
    ipcRenderer.on('repeatObject', (e, arg) => {
        // let { repeatedObject, repeatByColumn, repeatByRow, horizontalInterval, verticalInterval } = arg;

        // // Repeat by horizontal
        // for(let i = 1; i <= repeatByColumn; i++) {
        //     // Method of cloning original object - parsing object as string
        //     let settings = JSON.parse(JSON.stringify(repeatedObject._settings));

        //     // Set new settings for clone object
        //     settings.name = `${settings.name} (Repeated - ${i})`;
        //     settings.coords[0] = settings.coords[0] + horizontalInterval * i;

        //     // Adding clone object to a playground and store
        //     world.currentLevel.data.elements.push(
        //         settings.type !== 'sprite'
        //         ? world._prepareObject(settings)
        //         : world._prepareObject(settings, storeGetters.spriteSheets)
        //     );
        //     store.commit('addObject');
        // }

        // // Repeat by vertical
        // for(let i = 1; i <= repeatByRow; i++) {
        //     // Method of cloning original object - parsing object as string
        //     let settings = JSON.parse(JSON.stringify(repeatedObject._settings));

        //     // Set new settings for clone object
        //     settings.name = `${settings.name} (Repeated - ${i})`;
        //     settings.coords[1] = settings.coords[1] + verticalInterval * i;

        //     // Adding clone object to a playground and store
        //     world.currentLevel.data.elements.push(
        //         settings.type !== 'sprite'
        //         ? world._prepareObject(settings)
        //         : world._prepareObject(settings, storeGetters.spriteSheets)
        //     );
        //     store.commit('addObject');
        // }

        // // Sort objects by their layer
        // world._sortElements();
    });

    // Defining loop for drawing objects in the playground
    loop = async () => {
        app.clearPlayground();

        await world.render();

        // Draw borders of objects
        for(let selectedId of storeGetters.selectedObjects) {
            const selectedObject = storeGetters.projectObjects[storeGetters.projectObjects.findIndex(item => item.$id === selectedId)];

            app.context.strokeStyle = '#ffffff';
            app.context.lineWidth = 2;
            app.context.setLineDash([5, 5]);
            app.context.beginPath();

            app.context.rect(
                selectedObject.settings.coords[0]-cam.x,
                selectedObject.settings.coords[1]-cam.y,
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
    await loop();
}
