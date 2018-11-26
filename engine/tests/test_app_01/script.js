import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.app("Test RPGinia app", undefined, [800, 600]);
const load = new app.loaders;
const world = new app.world(load.levels);

let lvl = load.jsonFile("level", "resources/levels/corridor.json")
let languages = [
    load.jsonFile("json", "resources/languages/en_US.json"),
    load.jsonFile("json", "resources/languages/ru_RU.json"),
    load.jsonFile("json", "resources/languages/uk_UK.json")
];

console.log(load.files, world.levelList);
let lvl2 = load.jsonFile("level", "resources/levels/menu.json");
console.log(load.files, world.levelList);