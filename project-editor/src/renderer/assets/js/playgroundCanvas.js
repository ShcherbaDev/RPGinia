import { ipcRenderer } from 'electron';
import RPGinia from '../../../../../engine/src/RPGinia';
import selectObjects from './selectObjects';

let engine, app, world, cam, load, loop;
let store, storeGetters;

function isAutoResizingEnabled() {
    return storeGetters['EditorData/autoPlaygroundSizesEnabled'];
}

export default function initPlayground(data, projStore) {
    store = projStore;
    storeGetters = store.getters;

    engine = new RPGinia(`file://${data.appPath}`);
    app = new engine.App(
        'RPGinia project editor playground', 
        document.querySelector('canvas#playground'), 
        isAutoResizingEnabled() ? [ // If auto resizing is enabled - set sizes from canvas container width and height.
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ] : storeGetters['EditorData/playgroundSizes'] // Else - get fixed value from store.
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

    // Settings up project store
    store.dispatch('setUpProjectStore', { appPath: data.appPath, data: world.currentLevel });

    app.canvas.onmousemove = e => { 
        // If alt key and left mouse button are pressed - move camera
        if(e.altKey && e.buttons === 1) {
            cam.move(e.movementX, e.movementY);
            app.canvas.style.cursor = '-webkit-grabbing';
        } else app.canvas.style.cursor = 'default';

        if(
            !e.altKey 
            && e.buttons === 1 
            && world.currentLevel.data.elements.findIndex(
                    item => {
                        return e.offsetX >= item.settings.coords[0] + cam.x
                            && e.offsetX <= item.settings.coords[0] + item.settings.coords[2] + cam.x
                            && e.offsetY >= item.settings.coords[1] + cam.y
                            && e.offsetY <= item.settings.coords[1] + item.settings.coords[3] + cam.y;
                    }
                ) !== -1
            && storeGetters.selectedObjects.length > 0
        ) {
            world.currentLevel.data.elements[world.currentLevel.data.elements.findIndex(item => item.$id === storeGetters.selectedObjects[0])].settings.coords[0] += e.movementX
            world.currentLevel.data.elements[world.currentLevel.data.elements.findIndex(item => item.$id === storeGetters.selectedObjects[0])].settings.coords[1] += e.movementY
        }
    }

    // Select object in playground
    app.canvas.addEventListener('click', e => {
        if(!e.altKey) 
            selectObjects(e, store, cam);
    });

    // Create object
    ipcRenderer.on('createObject', (e, object) => {
        world.currentLevel.data.elements.push(
            object.type !== 'sprite' ?
            world._prepareObject(object) :
            world._prepareObject(object, storeGetters.spriteSheets)
        );

        store.commit('addObject');

        world._sortElements();
    });

    // App window resizing
    window.addEventListener('resize', e => {
        if(isAutoResizingEnabled()) {
            app.sizes = [
                document.querySelector('.canvas_container').clientWidth,
                document.querySelector('.canvas_container').clientHeight
            ];
        }
    });

    // Sort objects
    ipcRenderer.on('sortObjectsByLayers', e => {
        world._sortElements();
    });

    // Repeat object
    ipcRenderer.on('repeatObject', (e, arg) => {
        let { repeatedObject, repeatByColumn, repeatByRow, horizontalInterval, verticalInterval } = arg;

        for(let i = 1; i <= repeatByColumn; i++) {
            let settings = JSON.parse(JSON.stringify(repeatedObject._settings));
            settings.name = `${settings.name} (Repeated - ${i})`;
            settings.coords[0] += i * horizontalInterval;

            world.currentLevel.data.elements.push(
                settings.type !== 'sprite' ?
                world._prepareObject(settings) :
                world._prepareObject(settings, storeGetters.spriteSheets)
            );

            store.commit('addObject');
        }

        for(let i = 1; i <= repeatByRow; i++) {
            let settings = JSON.parse(JSON.stringify(repeatedObject._settings));
            settings.name = `${settings.name} (Repeated - ${i})`;
            settings.coords[1] += i * verticalInterval;

            world.currentLevel.data.elements.push(
                settings.type !== 'sprite' ?
                world._prepareObject(settings) :
                world._prepareObject(settings, storeGetters.spriteSheets)
            );

            store.commit('addObject');
        }
        world._sortElements();
    });

    loop = () => {
        app.clearPlayground();

        // Draw objects
        world.draw();

        // Draw objects outlines
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