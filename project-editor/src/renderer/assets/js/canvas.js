import RPGinia from '../../../../../engine/src/RPGinia';

const appPath = process.env.NODE_ENV === 'development'
                ? `http://localhost:9080`
                : `file://${__dirname}/`;

let engine, app, world, kb, cam, loop;
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
    kb = new app.Keyboard();
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

    kb.addKey('arrUp', 38);
    kb.addKey('arrDown', 40);
    kb.addKey('arrLeft', 37);
    kb.addKey('arrRight', 39);
    kb.addKey('alt', 18);

    world.initialize({
        app: app,
        camera: cam,
        levels: data
    });

    function drawBorders() {
        console.log(app.context)
    }
    drawBorders();

    // If alt key and left mouse button are pressed - move camera
    app.canvas.onmousemove = e => { 
        if(e.altKey && e.buttons === 1) cam.move(e.movementX, e.movementY);
    }

    // Select object in canvas
    app.canvas.onclick = e => {
        const objectList = storeGetters.projectObjects;
        const selectedObjects = storeGetters.selectedObjects;

        for(let i in objectList) {
            if(
                !e.altKey &&
                
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
                }

                else {
                    for(let j in selectedObjects) {
                        store.dispatch('unselectObject', {
                            from: j, 
                            to: 1
                        });
                    }
                }
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
    }

    loop = () => {
        app.clearPlayground();

        world.draw();

        requestAnimationFrame(loop);
    }
    loop();
}