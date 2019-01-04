import Loaders from "./Loaders.js";

class World {
	constructor(debugModeEnabled = false) {
		this._levels = [];
		this._currentLevelId = null;
		this._previousLevelId = null;
		this._spriteSheets = [];
		this._controller = null;

		this._loaders = new Loaders();

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

	_doController() {
		const levelList = this._levels;
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4) {
				levelList[this._currentLevelId].controller = eval(`(${xml.responseText})`);
			}
		}

		if(levelList[this._currentLevelId].controller === undefined) {
			xml.open("get", this._appPath + levelList[this._currentLevelId].data.settings.controllerPath, false);
			xml.send();
		}
		console.log(this._currentLevelId, this._previousLevelId);

		if(this._currentLevelId === this._previousLevelId) {
			return levelList[this._currentLevelId].controller({
				app: this._app,
				world: this, 
				languages: this._languages,
				keyboard: this._keyboard,
				audio: this._audio,
				player: this._player,
				camera: this._camera
			});
		}

		
		// console.log(this._currentLevelId, this._previousLevelId, levelId);

		// if(levelId !== this._previousLevelId) {
		// 	console.log(true)
		
		// }
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

	_prepareObject(object) {
		const currentLevel = this._levels[this._currentLevelId];

		if(object.borderCoords === undefined) {
			object.borderCoords = [
				object.coords[0],
				object.coords[1]
			];
		}

		if(object.type === "text" && !object.coords[2]) {
			this._context.font = `${object.settings.size}px "${object.settings.font}"`;
			object.coords[2] = this._context.measureText(object.settings.text).width;
		}

		if(object.type === "text" && !object.coords[3]) {
			this._context.font = `${object.settings.size}px "${object.settings.font}"`;
			object.coords[3] = object.settings.size;
		}

		if(object.centralPointCoords === undefined) {
			object.centralPointCoords = [
				object.coords[2].toFixed(0)/2,
				object.coords[3].toFixed(0)/2
			];
		}

		if(object.type === "text") {
			this._context.font = `${object.settings.size}px "${object.settings.font}"`;

			if(object.settings.horizontalAlign === undefined)
				object.settings.horizontalAlign = "center";

			object.borderCoords[1] -= object.settings.size/2;
			object.centralPointCoords[1] -= object.settings.size/2;

			if(object.settings.horizontalAlign === "center") {
				object.borderCoords[0] -= object.coords[2]/2;
				object.centralPointCoords[0] -= object.coords[2]/2;
			}

			if(object.settings.horizontalAlign === "right") {
				object.borderCoords[0] -= object.coords[2];
				object.centralPointCoords[0] -= object.coords[2];
			}
		}

		// Setting up a "layer" property to default value, if it's not defined.
		if(object.layer === undefined)
			object.layer = 1;

		// Setting up a "isVisible" property to default value, if it's not defined.
		if(object.isVisible === undefined)
			object.isVisible = true;

		if(currentLevel.data.settings.spriteSheetPath) {
			if(object.type === "sprite") {
				if(currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].frames) {
					if(!object.frameFrom)
						object.frameFrom = 0;

					if(!object.frameTo)
						object.frameTo = currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].frames.length-1;
					
					if(!object.currentFrame)
						object.currentFrame = object.frameFrom;
				
					if(!object.isRepeat)
						object.isRepeat = false;

					object.spriteAnimation = setInterval(() => {
						if(object.currentFrame < object.frameTo)
							object.currentFrame++;
						
						else {
							if(object.isRepeat)
								object.currentFrame = object.frameFrom;
						
							else {
								clearInterval(object.spriteAnimation);
								delete object.spriteAnimation;
							}
						}
					}, object.interval);
				}

				if(!object.coords[2]) {
					if(currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].rect)
						object.coords[2] = currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].rect[2];
					else 
						object.coords[2] = currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].frames[object.currentFrame].rect[2];
				}

				if(!object.coords[3]) {
					if(currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].rect)
						object.coords[3] = currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].rect[3];
					else 
						object.coords[3] = currentLevel.spriteSheets[object.spriteSheetIndex].sprites[object.spriteIndex].frames[object.currentFrame].rect[3];
				}

				object.image = new Image();
				object.isLoaded = false;
				
				object.image.onload = () => {
					object.isLoaded = true;
				}
				object.image.src = this._appPath + currentLevel.spriteSheets[object.spriteSheetIndex].file;	
			}	
		}
		return object;
	}

	_getReadyLevel(path) {
		const levelList = this._levels;
		this._previousLevelId = this._currentLevelId;
		// console.log(levelList[levelList.findIndex(item => item.path === path)])
		if(levelList[levelList.findIndex(item => item.path === path)] === undefined) {
			this._currentLevelId++;
			levelList[this._currentLevelId] = this._loaders._loadLevel(path);
			levelList[this._currentLevelId].id = this._currentLevelId;
		}

		else
			this._currentLevelId = levelList.findIndex(item => item.path === path)

		// if(!levelList[this._currentLevelId]) {
		// 	levelList[this._currentLevelId] = this._loaders._loadLevel(path);
		// 	levelList[this._currentLevelId].id = this._currentLevelId;
		// }

		// this._currentLevelId = levelList.findIndex(item => item.path === path) || this._currentLevelId;
		
		// if(!levelList[this._currentLevelId]) {
		// 	levelList[this._currentLevelId] = levelList[this._currentLevelId] === undefined ? this._loaders._loadLevel(path) : levelList[this._currentLevelId];
		// 	levelList[this._currentLevelId].id = levelList.length;
		// }
		// console.log(levelList[this._currentLevelId])
		for(let j in levelList[this._currentLevelId].data.elements) {
			this._prepareObject(levelList[this._currentLevelId].data.elements[j])
		}

		// this._sortElements(this._currentLevelId);
		if(levelList[this._currentLevelId].data.settings.controllerPath !== undefined) {
			this._doController(this._currentLevelId);
		}
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

		this._currentLevelId = options.currentLevelId || 0;

		if(options.levels) {
			this._levels = Array.isArray(options.levels) ? options.levels : [options.levels];

			this._getReadyLevel(this._levels[this._currentLevelId].path);
		}

		else
			throw new Error("Levels are not defined!\nPlease connect at least one level to eliminate this error.");
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

	draw() {
		const levelList = this._levels;
		const levelId = this._currentLevelId;
		const currentLevel = levelList[levelId];
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
		const levelElements = this._levels[this._currentLevelId].data.elements;
		return levelElements[levelElements.findIndex(elem => elem.name === elementName)]
	}

	getElementsFromLayer(layerNum) {
		const levelElements = this._levels[this._currentLevelId].data.elements;
		let arr = [];

		for(let i in levelElements) {
			if(levelElements[i].layer === layerNum)
				arr.push(levelElements[i])
		}

		return arr;
	}

	createElement(settings) {
		const levelData = this._levels[this._currentLevelId].data;
		settings = this._prepareObject(settings);
		levelData.elements.push(settings);
		this._sortElements(this._currentLevelId);
		return settings;
	}

	deleteElement(name) {
		const elementsInLevel = levelList[levelId].data.elements;
		elementsInLevel.splice(
			elementsInLevel.findIndex(item => item.name === name), 
			1
		);
		this._sortElements(this._currentLevelId);
	}

	set level(levelPath) {
		if(this._currentLevelId !== this._previousLevelId)
			this._previousLevelId = this._currentLevelId;

		// if(this._levels[this._levels.findIndex(item => item.path === levelPath)] === -1) {
		// 	this._currentLevelId++;
		// 	this._levels[this._currentLevelId] = this._loaders._loadLevel(path);
		// 	this._levels[this._currentLevelId].id = this._currentLevelId;
		// }
		
		this._getReadyLevel(this._appPath + levelPath);
	}

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}

export default World;