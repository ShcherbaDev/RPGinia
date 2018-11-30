import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.app("Test RPGinia app", undefined, [1200, 600]);
const load = new app.loaders;
const world = new app.world;

// Loading languages
const languages = [
	"resources/languages/en_US.json", // English language
	"resources/languages/ru_RU.json", // Russian language
	"resources/languages/uk_UK.json"  // Ukrainian language
];
load.jsonFiles("language", languages);


// Loading levels
const levels = [
	"resources/levels/menu/menu.json",
	"resources/levels/corridor/corridor.json"
];
load.jsonFiles("level", levels);
world.initialize(load.levels, 0);

console.log(world.currentLevel)

// Change level interval
/* setInterval(() => {
	world.currentLevelId = world.currentLevelId === 0 ? 1 : 0;
}, 1000); */

function loop() {
	app.clearPlayground();

	world.draw();

	requestAnimationFrame(loop);
}
loop();