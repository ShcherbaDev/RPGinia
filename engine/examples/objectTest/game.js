import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.App("Test RPGinia app");
const kb = new app.Keyboard();
const load = new app.Loaders(true);
const world = new app.World(true);

const sprSheet = load.jsonFile('spriteSheet', '/resources/sprites/spriteSheets.json').data;

kb.addKey('arrLeft', 37);
kb.addKey('arrRight', 39);

world.initialize({
    app: app,
    levels: load.jsonFile("level", "/resources/levels/test/view.json")
});

world.createElement({
    name: "firstDynamicalText",
    type: "text",
    settings: {
        text: "Text created via game.js",
        color: "red",
        size: 32,
        horizontalAlign: "left"
    },
    coords: [151, 70],
    layer: 2
});

world.createElement({
    name: "secondDynamicalText",
    type: "text",
    settings: {
        text: "Text created via game.js (2)",
        color: "#bbb",
        size: 32,
        horizontalAlign: "left"
    },
    coords: [10, 500]
});

world.createElement({
    name: "cyanRectangle",
    type: "rectangle",
    settings: {
        fill: "cyan"
    },
    coords: [150, 140, 150, 120]
});

world.createElement({
    name: "testDynamicalSprite",
    type: "sprite",
    spriteSheetIndex: 0,
    spriteIndex: 0,
    coords: [400, 200, 200, 150],
    layer: 2
}, sprSheet);

world.createElement({
    name: "testDynamicalAnimatedSprite",
    type: "sprite",
    spriteSheetIndex: 1,
    spriteIndex: 0,
    frameTo: 1,
    interval: 500,
    isRepeat: true,
    coords: [400, 400, 200, 200]
}, sprSheet);

function draw() {
    app.clearPlayground();
    
    if(kb.isPressed('arrRight')) {
        world.getElementByName('cyanRectangle').coords[0] += 2;
        world.getElementByName('secondDynamicalText').coords[0] += 2;
        world.getElementByName('testDynamicalSprite').coords[0] -= 2;
        world.getElementByName('testDynamicalAnimatedSprite').coords[1] -= 3;
    }
    
    if(kb.isPressed('arrLeft')) {
        world.getElementByName('cyanRectangle').coords[0] -= 2;
        world.getElementByName('secondDynamicalText').coords[0] -= 2;
        world.getElementByName('testDynamicalSprite').coords[0] += 2;
        world.getElementByName('testDynamicalAnimatedSprite').coords[1] += 3;
    }

    world.draw();
    requestAnimationFrame(draw);
}
draw();