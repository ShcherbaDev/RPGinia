import { ipcRenderer } from 'electron';

import RPGinia from '../../../../../engine/src/RPGinia'; // Import engine

const appPath = process.env.NODE_ENV === 'development'
                ? `http://localhost:9080`
                : `file://${__dirname}/`;

let engine, app, world, cam, loop;
let store, storeGetters;

export default function initPlayground(data, projStore) {
    engine = new RPGinia(appPath);
    app = new engine.App(
        'RPGinia project editor playground', 
        document.querySelector('canvas#playground'), 
        [
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ]
    );
    world = new app.World();
    cam = new app.Camera();

    store = projStore;
    storeGetters = store.getters;

    // On app resizing
    document.body.onresize = () => {
        app.sizes = [
            document.querySelector('.canvas_container').clientWidth,
            document.querySelector('.canvas_container').clientHeight
        ];
    }

    // Initialize the playground's world
    world.initialize({
        app: app,
        camera: cam,
        levels: data
    });

    app.canvas.onmousemove = e => { 
        // If alt key and left mouse button are pressed - move camera
        if(e.altKey && e.buttons === 1) cam.move(e.movementX, e.movementY);
    }

    // Select object in playground
    app.canvas.onclick = e => {
        const objectList = storeGetters.projectObjects;
        const selectedObjects = storeGetters.selectedObjects;

        if(!e.altKey) {
            for(let i in objectList) {
                if(
                    e.offsetX >= objectList[i].settings.coords[0] + cam.x &&
                    e.offsetX <= objectList[i].settings.coords[0] + objectList[i].settings.coords[2] + cam.x &&
                    
                    e.offsetY >= objectList[i].settings.coords[1] + cam.y &&
                    e.offsetY <= objectList[i].settings.coords[1] + objectList[i].settings.coords[3] + cam.y
                ) {
                    if(selectedObjects.indexOf(objectList[i].$id) === -1) {
                        for(let j in selectedObjects) {
                            store.dispatch('unselectObject', {
                                from: j,
                                to: 1
                            });
                        }
                        
                        store.dispatch('selectObject', objectList[i].$id);
                        return;
                    }

                    else {
                        for(let j in selectedObjects) {
                            store.dispatch('unselectObject', {
                                from: j, 
                                to: 1
                            });
                        }
                    }
                }

                else {
                    for(let j in selectedObjects) {
                        store.dispatch('unselectObject', {
                            from: j, 
                            to: 1
                        });
                        return;
                    }
                }
            }
        }
    }

    // Create object
    ipcRenderer.on('createObject', (e, object) => {
        let obj = world.createElement(object);
        store.dispatch('addObject', world.getElementByName(obj.name));
    });

    // Delete object
    ipcRenderer.on('deleteObject', (e, objectIndex) => { store.dispatch('deleteObject', objectIndex) });

    loop = () => {
        app.clearPlayground();

        world.draw();

        for(let selectedId of storeGetters.selectedObjects) {
            const selectedObject = storeGetters.projectObjects[storeGetters.projectObjects.findIndex(item => item.$id === selectedId)];

            // -------
            //  Lines
            // -------
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