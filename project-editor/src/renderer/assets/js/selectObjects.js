export default function selectObjects(e, store, camera) {
    const objectList = store.getters.projectObjects;
    const selectedObjects = store.getters.selectedObjects;

    for(let i in objectList) {
        const objectCoords = objectList[i].settings.coords;

        if(
            e.offsetX >= objectCoords[0] + camera.x &&
            e.offsetX <= objectCoords[0] + objectCoords[2] + camera.x &&
            
            e.offsetY >= objectCoords[1] + camera.y &&
            e.offsetY <= objectCoords[1] + objectCoords[3] + camera.y
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