function controller(api) {
    const corridor = api.world.getElementByName("Corridor");

    let camSpeed;

    // Change level
    /* setTimeout(() => {
        api.world.level = "Menu";
    }, 1000); */

    // Other side of level
    /* corridor.coords[0] -= 1600;
    for(let i in columns) {
        columns[i].coords[0] -= 1600/0.6;
    } */

    function moveLevel(x, y) {
        corridor.coords[0] += x;
        corridor.coords[1] += y;
    }

    function handleKeyboard() {
        if(api.world.currentLevel.data.settings.name === "Last corridor") {
            if(api.keyboard.isPressed("arrUp"))
                moveLevel(0, camSpeed);

            if(api.keyboard.isPressed("arrDown"))
                moveLevel(0, -camSpeed);

            if(api.keyboard.isPressed("arrRight"))
                moveLevel(-camSpeed, 0);
    
            if(api.keyboard.isPressed("arrLeft"))
                moveLevel(camSpeed, 0);

            camSpeed = api.keyboard.isPressed("shift") ? 20 : 8;

            requestAnimationFrame(handleKeyboard);
        }
        else
            cancelAnimationFrame(handleKeyboard);
    }
    handleKeyboard();
}