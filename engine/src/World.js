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
		console.log(this._levels[levelId].data.settings.controllerPath, levelId, this._levels[levelId].id)
		if(this._levels[levelId].data.settings.controllerPath !== undefined && levelId === this._levels[levelId].id) {
			
			if(!this._levels[levelId].controller) {
				let xml = new XMLHttpRequest();
	
				xml.onreadystatechange = () => {
					if(xml.readyState === 4) {
						this._levels[levelId].controller = eval(`(${xml.responseText})`);
						console.log(levelId);
						
					}
				}
	
				xml.open("get", this._appPath + this._levels[levelId].data.settings.controllerPath, false);
				xml.send();
			}
			console.log(true)
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

	_sortElements(levelId) {
		this._levels[levelId].data.elements.sort((a, b) => {
			if(a.layer > b.layer) 
				return 1;

			if(a.layer < b.layer) 
				return -1;

			return 0;
		});
	}

	_getReadyObjects(levelId) {
		// Sort elements
		this._sortElements(levelId);

		// Controller init
		this._doController(levelId);
	}

	initialize(options) {
		console.log(options)
		// Elements init
		this._app = options.app || null;
		this._keyboard = options.keyboard || null;
		this._languages = options.languages || null;
		this._audio = options.audio || null;
		this._player = options.player || null;
		this._camera = options.camera || null;

		if(this._camera && !this._camera._world)
			this._camera._world = this;

		this._currentLevelId = options.currentLevelId || 0;

		if(options.levels) {
			this._levels = [options.levels[0]];

			console.log(this._levels);

		}

		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");

		// Levels init
		// if(options.levels) {
		// 	this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];

		// 	for(let i in this._levels) {
		// 		// Giving an ID for each level
		// 		this._levels[this._currentLevelId].id = parseInt(i);
		// 		console.log(this._levels);
		// 	}

		// 	// Adding a sprite sheet for each level
		// 	if(this._levels[this._currentLevelId].data.settings.spriteSheetPath) {
		// 		this._openSpriteSheet(this._currentLevelId);
		// 	}
			
			
		// 	// Set up properties to default values.
		// 	for(let j in this._levels[this._currentLevelId].data.elements) {
		// 		if(this._levels[this._currentLevelId].data.elements[j].borderCoords === undefined) {
		// 			this._levels[this._currentLevelId].data.elements[j].borderCoords = [
		// 				this._levels[this._currentLevelId].data.elements[j].coords[0],
		// 				this._levels[this._currentLevelId].data.elements[j].coords[1]
		// 			];
		// 		}

		// 		if(this._levels[this._currentLevelId].data.elements[j].type === "text" && !this._levels[this._currentLevelId].data.elements[j].coords[2]) {
		// 			this._context.font = `${this._levels[this._currentLevelId].data.elements[j].settings.size}px "${this._levels[this._currentLevelId].data.elements[j].settings.font}"`;
		// 			this._levels[this._currentLevelId].data.elements[j].coords[2] = this._context.measureText(this._levels[this._currentLevelId].data.elements[j].settings.text).width;
		// 		}

		// 		if(this._levels[this._currentLevelId].data.elements[j].type === "text" && !this._levels[this._currentLevelId].data.elements[j].coords[3]) {
		// 			this._context.font = `${this._levels[this._currentLevelId].data.elements[j].settings.size}px "${this._levels[this._currentLevelId].data.elements[j].settings.font}"`;
		// 			this._levels[this._currentLevelId].data.elements[j].coords[3] = this._levels[this._currentLevelId].data.elements[j].settings.size;
		// 		}

		// 		if(this._levels[this._currentLevelId].data.elements[j].centralPointCoords === undefined) {
		// 			this._levels[this._currentLevelId].data.elements[j].centralPointCoords = [
		// 				this._levels[this._currentLevelId].data.elements[j].coords[2].toFixed(0)/2,
		// 				this._levels[this._currentLevelId].data.elements[j].coords[3].toFixed(0)/2
		// 			];
		// 		}

		// 		if(this._levels[this._currentLevelId].data.elements[j].type === "text") {
		// 			this._context.font = `${this._levels[this._currentLevelId].data.elements[j].settings.size}px "${this._levels[this._currentLevelId].data.elements[j].settings.font}"`;

		// 			if(this._levels[this._currentLevelId].data.elements[j].settings.horizontalAlign === undefined)
		// 				this._levels[this._currentLevelId].data.elements[j].settings.horizontalAlign = "center";

		// 			this._levels[this._currentLevelId].data.elements[j].borderCoords[1] -= this._levels[this._currentLevelId].data.elements[j].settings.size/2;
		// 			this._levels[this._currentLevelId].data.elements[j].centralPointCoords[1] -= this._levels[this._currentLevelId].data.elements[j].settings.size/2;

		// 			if(this._levels[this._currentLevelId].data.elements[j].settings.horizontalAlign === "center") {
		// 				this._levels[this._currentLevelId].data.elements[j].borderCoords[0] -= this._levels[this._currentLevelId].data.elements[j].coords[2]/2;
		// 				this._levels[this._currentLevelId].data.elements[j].centralPointCoords[0] -= this._levels[this._currentLevelId].data.elements[j].coords[2]/2;
		// 			}

		// 			if(this._levels[this._currentLevelId].data.elements[j].settings.horizontalAlign === "right") {
		// 				this._levels[this._currentLevelId].data.elements[j].borderCoords[0] -= this._levels[this._currentLevelId].data.elements[j].coords[2];
		// 				this._levels[this._currentLevelId].data.elements[j].centralPointCoords[0] -= this._levels[this._currentLevelId].data.elements[j].coords[2];
		// 			}
		// 		}

		// 		// Setting up a "layer" property to default value, if it's not defined.
		// 		if(this._levels[this._currentLevelId].data.elements[j].layer === undefined)
		// 			this._levels[this._currentLevelId].data.elements[j].layer = 1;

		// 		// Setting up a "isVisible" property to default value, if it's not defined.
		// 		if(this._levels[this._currentLevelId].data.elements[j].isVisible === undefined)
		// 			this._levels[this._currentLevelId].data.elements[j].isVisible = true;

		// 		if(this._levels[this._currentLevelId].data.settings.spriteSheetPath) {
		// 			if(this._levels[this._currentLevelId].data.elements[j].type === "sprite") {
		// 				if(this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].frames) {
		// 					if(!this._levels[this._currentLevelId].data.elements[j].frameFrom)
		// 						this._levels[this._currentLevelId].data.elements[j].frameFrom = 0;

		// 					if(!this._levels[this._currentLevelId].data.elements[j].frameTo)
		// 						this._levels[this._currentLevelId].data.elements[j].frameTo = this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].frames.length-1;
							
		// 					if(!this._levels[this._currentLevelId].data.elements[j].currentFrame)
		// 						this._levels[this._currentLevelId].data.elements[j].currentFrame = this._levels[this._currentLevelId].data.elements[j].frameFrom;
						
		// 					if(!this._levels[this._currentLevelId].data.elements[j].isRepeat)
		// 						this._levels[this._currentLevelId].data.elements[j].isRepeat = false;

		// 					this._levels[this._currentLevelId].data.elements[j].spriteAnimation = setInterval(() => {
		// 						if(this._levels[this._currentLevelId].data.elements[j].currentFrame < this._levels[this._currentLevelId].data.elements[j].frameTo)
		// 							this._levels[this._currentLevelId].data.elements[j].currentFrame++;
								
		// 						else {
		// 							if(this._levels[this._currentLevelId].data.elements[j].isRepeat)
		// 								this._levels[this._currentLevelId].data.elements[j].currentFrame = this._levels[this._currentLevelId].data.elements[j].frameFrom;
								
		// 							else {
		// 								clearInterval(this._levels[this._currentLevelId].data.elements[j].spriteAnimation);
		// 								delete this._levels[this._currentLevelId].data.elements[j].spriteAnimation;
		// 							}
		// 						}
		// 					}, this._levels[this._currentLevelId].data.elements[j].interval);
		// 				}

		// 				if(!this._levels[this._currentLevelId].data.elements[j].coords[2]) {
		// 					if(this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].rect)
		// 						this._levels[this._currentLevelId].data.elements[j].coords[2] = this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].rect[2];
		// 					else 
		// 						this._levels[this._currentLevelId].data.elements[j].coords[2] = this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].frames[this._levels[this._currentLevelId].data.elements[j].currentFrame].rect[2];
		// 				}

		// 				if(!this._levels[this._currentLevelId].data.elements[j].coords[3]) {
		// 					if(this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].rect)
		// 						this._levels[this._currentLevelId].data.elements[j].coords[3] = this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].rect[3];
		// 					else 
		// 						this._levels[this._currentLevelId].data.elements[j].coords[3] = this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].sprites[this._levels[this._currentLevelId].data.elements[j].spriteIndex].frames[this._levels[this._currentLevelId].data.elements[j].currentFrame].rect[3];
		// 				}

		// 				this._levels[this._currentLevelId].data.elements[j].image = new Image();
		// 				this._levels[this._currentLevelId].data.elements[j].isLoaded = false;
		// 				this._levels[this._currentLevelId].data.elements[j].image.onload = () => {
		// 					this._levels[this._currentLevelId].data.elements[j].isLoaded = true;	
							
		// 					if(this.allElementsInLevelLoaded()) {
		// 						this._getReadyObjects(this._currentLevelId, j);
		// 					}
		// 				}
		// 				this._levels[this._currentLevelId].data.elements[j].image.src = this._appPath + this._levels[this._currentLevelId].spriteSheets[this._levels[this._currentLevelId].data.elements[j].spriteSheetIndex].file;	
		// 			}					
		// 		}

		// 		else
		// 			this._getReadyObjects(this._currentLevelId, j);
		// 	}
		// }
		
		// else
		// 	throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");

		
	}

	_isObjectVisible(currentLevelObjects, objectIndex, padding) {
		currentLevelObjects[objectIndex].isVisible = 
			currentLevelObjects[objectIndex].isVisible &&
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
			if(this._levels[levelId].data.elements[i].type === "sprite" && this._levels[levelId].data.elements[i].isLoaded)
				loadedLevelsElementsArr.push(i);

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
				if(elementsInLevel[i].type === "rectangle") {
					const rectSettings = elementsInLevel[i].settings;
					this._context.fillStyle = rectSettings.fill;
					this._context.fillRect(
						elementsInLevel[i].coords[0], elementsInLevel[i].coords[1],
						elementsInLevel[i].coords[2], elementsInLevel[i].coords[3],  
					);
				}
				
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
					elementsInLevel[i].borderCoords = [
						elementsInLevel[i].coords[0],
						elementsInLevel[i].coords[1]
					];

					if(elementsInLevel[i].type === "text") {
						if(elementsInLevel[i].settings.horizontalAlign === "center") {
							elementsInLevel[i].borderCoords[0] -= elementsInLevel[i].coords[2]/2;
						}

						if(elementsInLevel[i].settings.horizontalAlign === "right") {
							elementsInLevel[i].borderCoords[0] -= elementsInLevel[i].coords[2];
						}

						elementsInLevel[i].borderCoords[1] = elementsInLevel[i].borderCoords[1] - elementsInLevel[i].settings.size/2;
					}

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

	createElement(settings) {
		if(settings.borderCoords === undefined) {
			settings.borderCoords = [
				settings.coords[0],
				settings.coords[1]
			];
		}

		if(settings.type === "text" && !settings.coords[2]) {
			this._context.font = `${settings.settings.size}px "${settings.settings.font}"`;
			settings.coords[2] = this._context.measureText(settings.settings.text).width;
		}

		if(settings.type === "text" && !this._levels[this._currentLevelId].data.elements[j].coords[3]) {
			this._context.font = `${settings.settings.size}px "${settings.settings.font}"`;
			settings.coords[3] = settings.settings.size;
		}

		if(settings.centralPointCoords === undefined) {
			settings.centralPointCoords = [
				settings.coords[2].toFixed(0)/2,
				settings.coords[3].toFixed(0)/2
			];
		}

		if(settings.type === "text") {
			this._context.font = `${settings.settings.size}px "${settings.settings.font}"`;

			if(settings.settings.horizontalAlign === undefined)
				settings.settings.horizontalAlign = "center";

			settings.borderCoords[1] -= settings.settings.size/2;
			settings.centralPointCoords[1] -= settings.settings.size/2;

			if(settings.settings.horizontalAlign === "center") {
				settings.borderCoords[0] -= settings.coords[2]/2;
				settings.centralPointCoords[0] -= settings.coords[2]/2;
			}

			if(settings.settings.horizontalAlign === "right") {
				settings.borderCoords[0] -= settings.coords[2];
				settings.centralPointCoords[0] -= settings.coords[2];
			}
		}

		// Setting up a "layer" property to default value, if it's not defined.
		if(settings.layer === undefined)
			settings.layer = 1;

		// Setting up a "isVisible" property to default value, if it's not defined.
		if(settings.isVisible === undefined)
			settings.isVisible = true;

		if(this._levels[this._currentLevelId].data.settings.spriteSheetPath) {
			if(settings.type === "sprite") {
				if(this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].frames) {
					if(!settings.frameFrom)
						settings.frameFrom = 0;

					if(!settings.frameTo)
						settings.frameTo = this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].frames.length-1;
					
					if(!settings.currentFrame)
						settings.currentFrame = settings.frameFrom;
				
					if(!settings.isRepeat)
						settings.isRepeat = false;

					settings.spriteAnimation = setInterval(() => {
						if(settings.currentFrame < settings.frameTo)
							settings.currentFrame++;
						
						else {
							if(settings.isRepeat)
								settings.currentFrame = settings.frameFrom;
						
							else {
								clearInterval(settings.spriteAnimation);
								delete settings.spriteAnimation;
							}
						}
					}, settings.interval);
				}

				if(!settings.coords[2]) {
					if(this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].rect)
						settings.coords[2] = this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].rect[2];
					else 
						settings.coords[2] = this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].frames[settings.currentFrame].rect[2];
				}

				if(!settings.coords[3]) {
					if(this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].rect)
						settings.coords[3] = this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].rect[3];
					else 
						settings.coords[3] = this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].sprites[settings.spriteIndex].frames[settings.currentFrame].rect[3];
				}

				settings.image = new Image();
				settings.isLoaded = false;
				settings.image.onload = () => {
					settings.isLoaded = true;	
					
					if(this.allElementsInLevelLoaded()) {
						this._getReadyObjects(i, j);
					}
				}
				settings.image.src = this._appPath + this._levels[this._currentLevelId].spriteSheets[settings.spriteSheetIndex].file;	
			}					
		}

		this._levels[this._currentLevelId].data.elements.push(settings);
		this._sortElements(this._currentLevelId);
		return settings;
	}

	deleteElement(name) {
		const elementsInLevel = this._levels[this._currentLevelId].data.elements;
		elementsInLevel.splice(
			elementsInLevel.findIndex(item => item.name === name), 
			1
		);
		this._sortElements(this._currentLevelId);
	}

	set level(newLevelValue) {
		this._previousLevelId = this._currentLevelId;

		if(typeof newLevelValue === "number")
			this._currentLevelId = newLevelValue;
		else if(typeof newLevelValue === "string")
			this._currentLevelId = this._levels.findIndex(level => level.data.settings.name === newLevelValue);

		this._getReadyObjects(this._currentLevelId);
	}

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}

export default World;