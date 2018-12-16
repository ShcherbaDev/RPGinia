function controller(api) {
    const firstLayerObjects = api.world.getElementsFromLayer(1);

    let camSpeed;

    // Change level
    /* setTimeout(() => {
        api.world.level = "Menu";
    }, 1000); */
    
    console.log(api.world.getElementByName("Save point"))

    function moveLevel(x, y) {
        for(let i in firstLayerObjects) {
            firstLayerObjects[i].coords[0] += x;
            firstLayerObjects[i].coords[1] += y;
        }
    }

    function handleKeyboard() {
        if(api.world.currentLevel.data.settings.name === "Last corridor") {
            if(api.keyboard.isPressed("arrRight"))
                moveLevel(-camSpeed, 0);
    
            if(api.keyboard.isPressed("arrLeft"))
                moveLevel(camSpeed, 0);
        
            if(api.keyboard.isPressed("shift"))
                camSpeed = 20;
            else if(api.keyboard.isPressed("controlLeft"))
                camSpeed = 2;
            else
                camSpeed = 5;

            requestAnimationFrame(handleKeyboard);
        }
        else
            cancelAnimationFrame(handleKeyboard);
    }
    handleKeyboard();
}