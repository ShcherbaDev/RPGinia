import RPGinia from "/src/RPGinia.js";

const engine = new RPGinia();
const app = new engine.app("Test RPGinia app", undefined);
const load = new app.loaders;
const world = new app.world;

// Loading languages
const languagePaths = [
	"/resources/languages/en_US.json", // English language
	"/resources/languages/ru_RU.json", // Russian language
	"/resources/languages/uk_UK.json"  // Ukrainian language
];
const languages = load.jsonFiles("language", languagePaths);

// Loading levels
const levelPaths = [
	"/resources/levels/menu/menu.json",
	"/resources/levels/corridor/corridor.json"
];
const levels = load.jsonFiles("level", levelPaths);

world.initialize({
	levels: levels,
	currentLevelId: 1,
	languages: languages
});

function loop() {
	app.clearPlayground();

	world.draw();

	requestAnimationFrame(loop);
}
loop();