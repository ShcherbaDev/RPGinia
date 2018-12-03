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

	_openSpriteSheet(currentItem) {
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				this._levels[currentItem].spriteSheets = JSON.parse(xml.responseText);
		}

		xml.open("get", this.__proto__.appPath + this._levels[currentItem].data.settings.spriteSheetPath, false);
		xml.send();
	}

	_allSpritesLoaded() {
		let resultArr = [];
		let elements = [];

		for(let i in this._levels[this._currentLevelId].data.elements) {
			if(this._levels[this._currentLevelId].data.elements[i].type === "sprite")
				elements.push(i);

			if(this._levels[this._currentLevelId].data.elements[i].type === "sprite" && this._levels[this._currentLevelId].data.elements[i].isLoaded)
				resultArr.push(i);
		}

		return resultArr.length === elements.length ? true : false;
	}

	initialize(options) {
		// Levels init
		if(options.levels) {
			this._levels = options.levels;
		
			for(let i in this._levels) {
				// Giving an ID for each level
				this._levels[i].id = parseInt(i);
				
				// Adding a sprite sheet for level
				if(this._levels[i].data.settings.spriteSheetPath) {
					this._openSpriteSheet(i);
					
					for(let j in this._levels[i].data.elements) {
						if(this._levels[i].data.elements[j].type === "sprite") {
							this._levels[i].data.elements[j].image = new Image();
							this._levels[i].data.elements[j].isLoaded = false;
							this._levels[i].data.elements[j].image.onload = () => {
								this._levels[i].data.elements[j].isLoaded = true;
							}
							this._levels[i].data.elements[j].image.src = this.__proto__.appPath + this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].file
						}
					}

					this._levels[i].data.elements.sort((a, b) => {
						if(a.layer > b.layer) {
							return 1;
						}
			
						if(a.layer < b.layer) {
							return -1;
						}
			
						return 0;
					})
				}
			}
		}
		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");

		this._currentLevelId = options.currentLevelId || 0;

		// Languages init
		this._languages = options.languages || null;
		
		// Controller init
		if(this._levels[this._currentLevelId].data.settings.controllerPath && this._currentLevelId === this._levels[this._currentLevelId].id) {
			// Read controller's file
			this._openController();

			// Do actions in controller
			this._levels[this._currentLevelId].controller(this, this._languages);
		}
	}

	draw() {
		const currentLevel = this._levels[this._currentLevelId];

		// Background draw
		this._context.fillStyle = currentLevel.data.settings.background || "#000000";
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// Level draw
		if(this._allSpritesLoaded()) {
			for(let i in currentLevel.data.elements) {
				const spriteSheetCoords = currentLevel.spriteSheets[currentLevel.data.elements[i].spriteSheetIndex].sprites[currentLevel.data.elements[i].spriteIndex].rect;
				const spriteCoords = currentLevel.data.elements[i].coords;

				this._context.drawImage(
					currentLevel.data.elements[i].image,

					spriteSheetCoords[0], 
					spriteSheetCoords[1], 
					spriteSheetCoords[2], 
					spriteSheetCoords[3],
					
					spriteCoords[0], 
					spriteCoords[1], 
					spriteCoords[2] || spriteSheetCoords[2], 
					spriteCoords[3] || spriteSheetCoords[3]
				);
			}
		}
	}

	getElementByName(elementName) {
		return this._levels[this._currentLevelId].data.elements[this._levels[this._currentLevelId].data.elements.findIndex(elem => elem.name === elementName)]
	}

	getElementsFromLayer(layerNum) {
		let arr = [];

		for(let i in this._levels[this._currentLevelId].data.elements) {
			if(this._levels[this._currentLevelId].data.elements[i].layer === layerNum)
				arr.push(this._levels[this._currentLevelId].data.elements[i])
		}

		return arr;
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

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}