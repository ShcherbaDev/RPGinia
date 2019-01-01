class World {
	constructor(debugModeEnabled = false) {
		this._levels = [];
		this._currentLevelId = 0;
		this._previousLevelId = null;

		this._debugMode = debugModeEnabled;

		this._app = null;
		this._keyboard = null;
		this._languages = null;
		this._audio = null;
		this._player = null;
		this._camera = null;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
		this._appPath = this.__proto__.appPath;
	}

	_doController(levelId) {
		if(this._levels[levelId].data.settings.controllerPath !== undefined && levelId === this._levels[levelId].id) {
			if(!this._levels[levelId].controller) {
				let xml = new XMLHttpRequest();
	
				xml.onreadystatechange = () => {
					if(xml.readyState === 4)
						this._levels[levelId].controller = eval(`(${xml.responseText})`);
				}
	
				xml.open("get", this._appPath + this._levels[levelId].data.settings.controllerPath, false);
				xml.send();
			}
			
			this._levels[levelId].controller({
				app: this._app,
				world: this, 
				languages: this._languages,
				keyboard: this._keyboard,
				audio: this._audio,
				player: this._player,
				camera: this._camera
			});
		}
	}

	_openSpriteSheet(currentItem) {
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				this._levels[currentItem].spriteSheets = JSON.parse(xml.responseText);
		}

		xml.open("get", this._appPath + this._levels[currentItem].data.settings.spriteSheetPath, false);
		xml.send();
	}

	_getReadyObjects(levelId, elementId) {
		// Sort elements
		this._levels[levelId].data.elements.sort((a, b) => {
			if(a.layer > b.layer) 
				return 1;

			if(a.layer < b.layer) 
				return -1;

			return 0;
		});

		// Controller init
		this._doController(levelId);
	}

	initialize(options) {
		// Elements init
		this._app = options.app || null;
		this._keyboard = options.keyboard || null;
		this._languages = options.languages || null;
		this._audio = options.audio || null;
		this._player = options.player || null;
		this._camera = options.camera || null;

		if(this._camera && !this._camera._world)
			this._camera._world = this;

		// Levels init
		if(options.levels) {
			this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];

			for(let i in this._levels) {
				// Giving an ID for each level
				this._levels[i].id = i;
				
				// Adding a sprite sheet for each level
				if(this._levels[i].data.settings.spriteSheetPath) {
					this._openSpriteSheet(i);
				}
				
				// Set up properties to default values.
				for(let j in this._levels[i].data.elements) {
					if(this._levels[i].data.elements[j].borderCoords === undefined) {
						this._levels[i].data.elements[j].borderCoords = [
							this._levels[i].data.elements[j].coords[0],
							this._levels[i].data.elements[j].coords[1]
						];
					}

					if(this._levels[i].data.elements[j].type === "text" && !this._levels[i].data.elements[j].coords[2]) {
						this._context.font = `${this._levels[i].data.elements[j].settings.size}px "${this._levels[i].data.elements[j].settings.font}"`;
						this._levels[i].data.elements[j].coords[2] = this._context.measureText(this._levels[i].data.elements[j].settings.text).width;
					}

					if(this._levels[i].data.elements[j].type === "text" && !this._levels[i].data.elements[j].coords[3]) {
						this._context.font = `${this._levels[i].data.elements[j].settings.size}px "${this._levels[i].data.elements[j].settings.font}"`;
						this._levels[i].data.elements[j].coords[3] = this._levels[i].data.elements[j].settings.size;
					}

					if(this._levels[i].data.elements[j].centralPointCooords === undefined) {
						this._levels[i].data.elements[j].centralPointCoords = [
							this._levels[i].data.elements[j].coords[2].toFixed(0)/2,
							this._levels[i].data.elements[j].coords[3].toFixed(0)/2
						];
					}

					// Setting up a width and height for texts.
					if(this._levels[i].data.elements[j].type === "text") {
						this._context.font = `${this._levels[i].data.elements[j].settings.size}px "${this._levels[i].data.elements[j].settings.font}"`;

						if(this._levels[i].data.elements[j].settings.horizontalAlign === undefined)
							this._levels[i].data.elements[j].settings.horizontalAlign = "center";

						this._levels[i].data.elements[j].borderCoords[1] -= this._levels[i].data.elements[j].settings.size/2;
						this._levels[i].data.elements[j].centralPointCoords[1] -= this._levels[i].data.elements[j].settings.size/2;

						if(this._levels[i].data.elements[j].settings.horizontalAlign === "center") {
							this._levels[i].data.elements[j].borderCoords[0] -= this._levels[i].data.elements[j].coords[2]/2;
							this._levels[i].data.elements[j].centralPointCoords[0] -= this._levels[i].data.elements[j].coords[2]/2;
						}

						if(this._levels[i].data.elements[j].settings.horizontalAlign === "right") {
							this._levels[i].data.elements[j].borderCoords[0] -= this._levels[i].data.elements[j].coords[2];
							this._levels[i].data.elements[j].centralPointCoords[0] -= this._levels[i].data.elements[j].coords[2];
						}
					}

					// Setting up a "layer" property to default value, if it's not defined.
					if(this._levels[i].data.elements[j].layer === undefined)
						this._levels[i].data.elements[j].layer = 1;

					// Setting up a "isVisible" property to default value, if it's not defined.
					if(this._levels[i].data.elements[j].isVisible === undefined)
						this._levels[i].data.elements[j].isVisible = true;

					if(this._levels[i].data.settings.spriteSheetPath) {
						if(this._levels[i].data.elements[j].type === "sprite") {
							if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames) {
								if(!this._levels[i].data.elements[j].frameFrom)
									this._levels[i].data.elements[j].frameFrom = 0;

								if(!this._levels[i].data.elements[j].frameTo)
									this._levels[i].data.elements[j].frameTo = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames.length-1;
								
								if(!this._levels[i].data.elements[j].currentFrame)
									this._levels[i].data.elements[j].currentFrame = this._levels[i].data.elements[j].frameFrom;
							
								if(!this._levels[i].data.elements[j].isRepeat)
									this._levels[i].data.elements[j].isRepeat = false;

								this._levels[i].data.elements[j].spriteAnimation = setInterval(() => {
									if(this._levels[i].data.elements[j].currentFrame < this._levels[i].data.elements[j].frameTo)
										this._levels[i].data.elements[j].currentFrame++;
									
									else {
										if(this._levels[i].data.elements[j].isRepeat)
											this._levels[i].data.elements[j].currentFrame = this._levels[i].data.elements[j].frameFrom;
									
										else {
											clearInterval(this._levels[i].data.elements[j].spriteAnimation);
											delete this._levels[i].data.elements[j].spriteAnimation;
										}
									}
								}, this._levels[i].data.elements[j].interval);
							}

							if(!this._levels[i].data.elements[j].coords[2]) {
								if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect)
									this._levels[i].data.elements[j].coords[2] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect[2];
								else 
									this._levels[i].data.elements[j].coords[2] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames[this._levels[i].data.elements[j].currentFrame].rect[2];
							}

							if(!this._levels[i].data.elements[j].coords[3]) {
								if(this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect)
									this._levels[i].data.elements[j].coords[3] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].rect[3];
								else 
									this._levels[i].data.elements[j].coords[3] = this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].sprites[this._levels[i].data.elements[j].spriteIndex].frames[this._levels[i].data.elements[j].currentFrame].rect[3];
							}

							this._levels[i].data.elements[j].image = new Image();
							this._levels[i].data.elements[j].isLoaded = false;
							this._levels[i].data.elements[j].image.onload = () => {
								this._levels[i].data.elements[j].isLoaded = true;	
								
								if(this.allElementsInLevelLoaded()) {
									this._getReadyObjects(i, j);
								}
							}
							this._levels[i].data.elements[j].image.src = this._appPath + this._levels[i].spriteSheets[this._levels[i].data.elements[j].spriteSheetIndex].file;	
						}					
					}

					else {
						this._getReadyObjects(i, j);
					}
				}
			}
		}
		
		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");

		this._currentLevelId = options.currentLevelId || 0;
	}

	_isObjectVisible(currentLevelObjects, objectIndex, padding) {
		currentLevelObjects[objectIndex].isVisible = 
			currentLevelObjects[objectIndex].coords[0] <= this._canvas.width-padding &&
			currentLevelObjects[objectIndex].coords[1] <= this._canvas.height-padding &&
			currentLevelObjects[objectIndex].coords[0] + currentLevelObjects[objectIndex].coords[2] >= padding &&
			currentLevelObjects[objectIndex].coords[1] + currentLevelObjects[objectIndex].coords[3] >= padding
	
		return currentLevelObjects[objectIndex].isVisible;
	}

	allElementsInLevelLoaded(levelId = this._currentLevelId) {
		let spriteElements = [];
		let loadedLevelsElementsArr = [];

		for(let i in this._levels[levelId].data.elements) {
			if(this._levels[levelId].data.elements[i].type === "sprite" && this._levels[levelId].data.elements[i].isLoaded) {
				loadedLevelsElementsArr.push(i);
			}

			if(this._levels[levelId].data.elements[i].type === "sprite")
				spriteElements.push(i);
		}

		return spriteElements.length === loadedLevelsElementsArr.length;
	}

	draw() {
		const currentLevel = this._levels[this._currentLevelId];
		const elementsInLevel = currentLevel.data.elements;

		// Background draw
		if(currentLevel.data.settings.background) {
			this._context.fillStyle = currentLevel.data.settings.background;
			this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
		}
		
		this._context.save();

		this._context.translate(this._canvas.width/2, this._canvas.height/2);
		this._context.rotate(this._camera.degree * Math.PI/180);
		this._context.translate(-this._canvas.width/2, -this._canvas.height/2);

		// Level draw
		for(let i in elementsInLevel) {
			if(this._isObjectVisible(elementsInLevel, i, 0)) {
				if(elementsInLevel[i].type === "sprite" && elementsInLevel[i].isLoaded) {
					const spriteSheetCoords = currentLevel.spriteSheets[elementsInLevel[i].spriteSheetIndex].sprites[elementsInLevel[i].spriteIndex].rect ? 
											  currentLevel.spriteSheets[elementsInLevel[i].spriteSheetIndex].sprites[elementsInLevel[i].spriteIndex].rect :
											  currentLevel.spriteSheets[elementsInLevel[i].spriteSheetIndex].sprites[elementsInLevel[i].spriteIndex].frames[elementsInLevel[i].currentFrame].rect;
					
					const spriteCoords = elementsInLevel[i].coords;

					this._context.drawImage(
						elementsInLevel[i].image,

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

				if(elementsInLevel[i].type === "text") {
					const textSettings = elementsInLevel[i].settings;

					this._context.fillStyle = textSettings.color || "red";
					this._context.font = `${textSettings.size}px "${textSettings.font}"`;
					
					this._context.textAlign = textSettings.horizontalAlign;
					this._context.textBaseline = "middle";
					this._context.fillText(textSettings.text, elementsInLevel[i].coords[0], elementsInLevel[i].coords[1])
				}

				if(this._debugMode) {
					// Draw borders of elements
					this._context.strokeStyle = "blue";
					this._context.lineWidth = 3;
					this._context.strokeRect(
						elementsInLevel[i].borderCoords[0], elementsInLevel[i].borderCoords[1], 
						elementsInLevel[i].coords[2], elementsInLevel[i].coords[3]);
					this._context.lineWidth = 1;
					this._context.strokeStyle = "black";

					// Draw central points of elements
					this._context.fillStyle = "red";
					this._context.fillRect(
						elementsInLevel[i].coords[0] + elementsInLevel[i].centralPointCoords[0]-5, 
						elementsInLevel[i].coords[1] + elementsInLevel[i].centralPointCoords[1]-5, 
						10, 10);
					this._context.fillStyle = "black";
				}
			}
		}
		
		this._context.restore();
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
		this._previousLevelId = this._currentLevelId;

		if(typeof newLevelValue === "number")
			this._currentLevelId = newLevelValue;
		else if(typeof newLevelValue === "string")
			this._currentLevelId = this._levels.findIndex(level => level.data.settings.name === newLevelValue);

		this._doController(this._currentLevelId);
	}

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}

export default World;