function controller(api) {
    const flags = [
        api.world.getElementsFromLayer(2)[0], // Britain flag
        api.world.getElementsFromLayer(2)[1], // Ukrainian flag
        api.world.getElementsFromLayer(2)[2]  // Russian flag
    ];

    const languagesLabels = [
        api.world.getElementsFromLayer(3)[0], // English language
        api.world.getElementsFromLayer(3)[1], // Ukrainian language
        api.world.getElementsFromLayer(3)[2]  // Russian language
    ];

    let hoveredLanguage = 0;
    let canChooseLanguage = true;

    const chooseRect = api.world.createElement({
        type: "rectangle",
        name: "chooseRect",
        settings: {
            fill: "yellow"
        },
        coords: [
            flags[hoveredLanguage].coords[0]-5,
            flags[hoveredLanguage].coords[1]-5,
            flags[hoveredLanguage].coords[2]+10,
            flags[hoveredLanguage].coords[3]+10
        ],
        layer: 1
    });

    languagesLabels[hoveredLanguage].settings.color = "yellow";

    console.log(api.world.currentLevel.data.elements);

    api.keyboard.pressEvent(() => {
        // if(canChooseLanguage) {
            if(hoveredLanguage > 0) {
                hoveredLanguage--;
                languagesLabels[hoveredLanguage+1].settings.color = "white";
            }

            else {
                hoveredLanguage = flags.length-1;
                languagesLabels[0].settings.color = "white";
            }

            chooseRect.coords[0] = flags[hoveredLanguage].coords[0]-5;
            languagesLabels[hoveredLanguage].settings.color = "yellow";
        // }
    }, "arrLeft");

    api.keyboard.pressEvent(() => {
        // if(canChooseLanguage) {
            if(hoveredLanguage < flags.length-1) {
                hoveredLanguage++;
                languagesLabels[hoveredLanguage-1].settings.color = "white";
            }

            else {
                hoveredLanguage = 0;
                languagesLabels[flags.length-1].settings.color = "white";
            }

            chooseRect.coords[0] = flags[hoveredLanguage].coords[0]-5;
            languagesLabels[hoveredLanguage].settings.color = "yellow";
        // }
        // console.log(false)
    }, "arrRight");

    api.keyboard.pressEvent(() => {
        // if(canChooseLanguage) {
            console.log(languagesLabels[hoveredLanguage].settings.text);
            api.audio.play("languageConfirm");
            canChooseLanguage = false;

            for(let i in api.world.currentLevel.data.elements) {
                api.world.currentLevel.data.elements[i].isVisible = false;
            }

            // setTimeout(() => {
                api.world.level = "/resources/levels/corridor/corridor.json";
            // }, 2000);
        // }
    }, "enter");
}