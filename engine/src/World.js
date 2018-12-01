export default class World {
	constructor() {
		this._levels = [];
		this._currentLevelId = 0;

		this._lanugages = null;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
	}

	_openController() {
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				this._levels[this._currentLevelId].controller = eval(`(${xml.responseText})`);
		}

		xml.open("get", this.__proto__.appPath + this._levels[this._currentLevelId].data.settings.controllerPath, false);
		xml.send();
	}

	initialize(options) {
		// Levels init
		if(options.levels)
			this._levels = options.levels;
		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate the error.");
		this._currentLevelId = options.currentLevelId ? options.currentLevelId : 0;

		// Languages init
		this._languages = options.levels ? options.levels : null;

		// Controller init
		if(this._levels[this._currentLevelId].data.settings.controllerPath) {
			this._openController();
			this._levels[this._currentLevelId].controller(this, this._languages);
		}
	}

	draw() {
		const currentLevel = this._levels[this._currentLevelId];

		// Background draw
		this._context.fillStyle = currentLevel.data.settings.background || "#000000";
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// Level draw
		// ...
	}

	set level(newLevelValue) {
		if(typeof newLevelValue === "number")
			this._currentLevelId = newLevelValue;
		else if(typeof newLevelValue === "string")
			this._currentLevelId = this._levels.findIndex(level => level.data.settings.name === newLevelValue);
		
		console.info(`${this._levels[this._currentLevelId].data.settings.name} has been loaded`);
	
		this._openController();
		this._levels[this._currentLevelId].controller(this, this._languages);
	}

	get levels() { return this._levels }
	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
}