function controller(api) {
    let camSpeed;

    function checkLevel() {
        return api.world.currentLevelName === "Last corridor";
    }

    console.log("Level corridor")
    
    api.keyboard.pressEvent(() => {
        api.world.level = "/resources/levels/set_language/languagesView.json";
    }, "enter");

    function handleKeyboard() {
        if(checkLevel()) {
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