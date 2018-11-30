export default class World {
	constructor() {
		this._levels = undefined;

		this._currentLevel = undefined;
		this._currentLevelId = 0;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
	}

	_init(levels, currentLevel = 0) {
		if (this._levels === undefined) {
			this._levels = levels.length ? levels : [levels];
		}

		this._currentLevelId = currentLevel;
		this._currentLevel = this._levels[this._currentLevelId];


		for(let i in this._levels) {
			this._levels[i].id = parseInt(i);
			
			if(this._levels[i].data.settings.controllerPath) {
				let xml = new XMLHttpRequest();
				xml.onreadystatechange = () => {
					if(xml.readyState === 4) {
						this._levels[i].controller = eval(`(${xml.responseText})`);
						return this._levels[i].controller(this)
					}
				}
	
				xml.open("get", this.__proto__.appPath + this._levels[i].data.settings.controllerPath, false);
				xml.send();
			}
		}
	}

	initialize(levels, currentLevel = 0) {
		this._init(levels, currentLevel);
	}

	draw() {
		// Background draw
		this._context.fillStyle = this._currentLevel.data.settings.background || "#000000";
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// Level draw
		// ...
	}

	get levels() { return this._levels }
	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }

	set currentLevelId(newValue) {
		this._currentLevelId = newValue;
		this._currentLevel = this._levels[this._currentLevelId];

		console.info(
			`Level with id ${this._currentLevelId} is active now!\nPath: ${this._currentLevel.path}`
		)
	}
}