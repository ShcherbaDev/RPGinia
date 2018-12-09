import Rectangle from "./Rectangle.js";

export default class World {
	constructor() {
		this._levels = [];
		this._currentLevelId = 0;

		this._app = null;
		this._keyboard = null;
		this._lanugages = null;
		this._spriteSheet = null;
		this._audio = null;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
	}

	initialize(options) {
		// App init
		this._app = options.app || null;

		// Keyboard init
		this._keyboard = options.keyboard || null;

		// Languages init
		this._languages = options.languages || null;

		// Audio init
		this._audio = options.audio || null;

		// Loaders init
		this._loaders = options.loaders || null;

		// Sprite sheet init
		this._spriteSheet = options.spriteSheet || null;

		if(options.levels) {
			this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];
			this._currentLevelId = options.currentLevelId || 0;

			for(let i in this._levels) {
				// Giving an ID for each level
				this._levels[i].id = parseInt(i);
				
				// Adding a sprite sheet for level
				for(let j in this._levels[i].content.elements) {
					if(this._levels[i].content.elements[j].isVisible === undefined)
						this._levels[i].content.elements[j].isVisible = true;

					if(this._levels[i].isLoaded && this._levels[i].content.elements[j].type === "sprite") {
						this._levels[i].content.elements[j].image = new Rectangle(this._levels[i].content.elements[j].coords, this, j).imageData.image;
						this._levels[i].content.elements[j].spriteSheetCoords = this._spriteSheet.content[this._levels[i].content.elements[j].spriteSheetIndex].sprites[this._levels[i].content.elements[j].spriteIndex].rect;
					}
				}

				if(this._levels[i].content.elements) {
					this._levels[i].content.elements = this._levels[i].content.elements.sort((a, b) => {
						if(a.layer > b.layer) {
							return 1;
						}
			
						if(a.layer < b.layer) {
							return -1;
						}
			
						return 0;
					});
				}
			}
		}

		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");
		
		// Global variables init
		if(options.globalVariables) {
			if(Array.isArray(options.globalVariables))
				this._globalVariables = options.globalVariables;
			else
				this._globalVariables = [options.globalVariables];
		}

		// Controller init
		if(this._currentLevelId === this._levels[this._currentLevelId].id) {
			// Do actions in controller
			return this._levels[this._currentLevelId].controller.content({
				app: this._app,
				world: this, 
				languages: this._languages,
				keyboard: this._keyboard,
				audio: this._audio,
				globalVariables: this._globalVariables
			});
		}

		// Sprites init
	}

	draw() {
		const currentLevel = this._levels[this._currentLevelId];

		// Background draw
		this._context.fillStyle = currentLevel.content.settings.background || "#000000";
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// Sprites draw
		for(let i in currentLevel.content.settings.elements) {
			if(currentLevel.content.settings.elements[i].type === "sprite") {
				this._context.drawImage(
					currentLevel.content.settings.elements[i].image,
					currentLevel.content.settings.elements[i].spriteSheetCoords[0],
					currentLevel.content.settings.elements[i].spriteSheetCoords[1],
					currentLevel.content.settings.elements[i].spriteSheetCoords[2],
					currentLevel.content.settings.elements[i].spriteSheetCoords[3],
					currentLevel.content.settings.elements[i].coords[0],
					currentLevel.content.settings.elements[i].coords[1],
					currentLevel.content.settings.elements[i].coords[2],
					currentLevel.content.settings.elements[i].coords[3]
				);
			}
		}
	}
}