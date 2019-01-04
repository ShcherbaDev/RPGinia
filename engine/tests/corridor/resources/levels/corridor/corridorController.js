function controller(api) {
    // const firstLayerObjects = api.world.getElementsFromLayer(1);

    let camSpeed;

    // Change level
    // setTimeout(() => {
    //     api.world.level = "Menu";
    // }, 1000);

    function handleKeyboard() {
        if(api.world.currentLevel.data.settings.name === "Last corridor") {
            if(api.keyboard.isPressed("arrLeft")) {
                if(!api.keyboard.isPressed("space"))
                    api.camera.move(camSpeed, 0);
                else
                    api.camera.rotate(-1);
            }

            if(api.keyboard.isPressed("arrRight")) {
                if(!api.keyboard.isPressed("space"))
                    api.camera.move(-camSpeed, 0);
                else
                    api.camera.rotate(1); 
            }

            if(api.keyboard.isPressed("arrUp"))
                api.camera.move(0, camSpeed);

            if(api.keyboard.isPressed("arrDown"))
                api.camera.move(0, -camSpeed);
        
            if(api.keyboard.isPressed("shift")) camSpeed = 20;
            else if(api.keyboard.isPressed("controlLeft")) camSpeed = 2;
            else camSpeed = 5;

            requestAnimationFrame(handleKeyboard);
        }
        else
            cancelAnimationFrame(handleKeyboard);
    }
    handleKeyboard();
}