import { ipcRenderer } from 'electron';
import RPGinia from '../../../../../engine/src/RPGinia';
import selectObjects from './selectObjects';

// import '../../store/modules/ProjectData';

let engine, app, world, cam, load, loop;
let store, storeGetters;

// const appURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file:///${__dirname}/`;

export default function initPlayground(data, projStore) {
    // console.log(data);
    engine = new RPGinia(data.appPath);
    app = new engine.App(
        'RPGinia project editor playground', 
        document.querySelector('canvas#playground'), 
        [
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ]
    );
    world = new app.World(false, false);
    cam = new app.Camera();
    load = new app.Loaders();

    store = projStore;
    storeGetters = store.getters;

    // On app resizing
    document.body.onresize = () => {
        app.sizes = [
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ];
    }

    const loadedLevel = load.jsonFile('level', data.path.replace(data.appPath, ''));

    // Initialize the playground's world
    world.initialize({
        app: app,
        camera: cam,
        levels: loadedLevel,
        loaders: load
    });

    store.dispatch('setUpProjectStore', world.currentLevel)

    app.canvas.onmousemove = e => { 
        // If alt key and left mouse button are pressed - move camera
        if(e.altKey && e.buttons === 1) 
            cam.move(e.movementX, e.movementY);
    }

    // Select object in playground
    app.canvas.onclick = e => {
        if(!e.altKey) 
            selectObjects(e, store, cam);
    }

    // Create object
    ipcRenderer.on('createObject', (e, object) => {
        world.createElement(object);
        store.dispatch('addObject');
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