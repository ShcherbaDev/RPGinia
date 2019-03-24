export default function selectObjects(e, store, camera) {
    const objectList = store.getters.projectObjects;
    const selectedObjects = store.getters.selectedObjects;

    let idMapArr = [];
    let layerMapArr = [];
    let maxObjId;
    let maxObjLayer;
    let selectedObject;

    for(let i in objectList) {
        const objectCoords = objectList[i].settings.coords;

        if(
            e.offsetX >= objectCoords[0] + camera.x 
            && e.offsetX <= objectCoords[0] + objectCoords[2] + camera.x
            
            && e.offsetY >= objectCoords[1] + camera.y
            && e.offsetY <= objectCoords[1] + objectCoords[3] + camera.y
        ) {
            idMapArr.push(objectList[i].$id);
            layerMapArr.push(objectList[i].settings.layer);

            maxObjId = Math.max(...idMapArr);
            maxObjLayer = Math.max(...layerMapArr);

            selectedObject = objectList[objectList.findIndex(item => item.$id === maxObjId && item.settings.layer === maxObjLayer)];
        }
    }

    if(selectedObject !== undefined && selectedObjects.indexOf(selectedObject.$id) === -1) {
        for(let j in selectedObjects) {
            store.dispatch('unselectObject', {
                from: j,
                to: 1
            });
        }
        store.dispatch('selectObject', selectedObject.$id);
        return;
    }

    else {
        selectedObject = undefined;
        for(let j in selectedObjects) {
            store.dispatch('unselectObject', {
                from: j,
                to: 1
            });
        }
    }
}