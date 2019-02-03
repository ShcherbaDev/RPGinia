import Object from './Object.js';
import Text from './ObjectTypes/Text.js';
import Rectangle from './ObjectTypes/Rectangle.js';
import Sprite from './ObjectTypes/Sprite.js';

class World {
	constructor(debugModeEnabled = false) {
		this._levels = [];
		this._currentLevelId = null;
		this._previousLevelId = null;
		this._controller = null;

		this._debugMode = debugModeEnabled;

		this._app = null;
		this._loaders = null;
		this._keyboard = null;
		this._languages = null;
		this._audio = null;
		this._player = null;
		this._camera = null;

		this._canvas = this.__proto__.canvas;
		this._context = this.__proto__.context;
		this._appPath = this.__proto__.appPath;

		this.__proto__.Object = Object;
		Object.prototype.appPath = this._appPath;
		Object.prototype.context = this._context;
	}

	_doController(levelId) {
		// Notice:
		// If you want to change the level, but there are keyboard 
		// events or intervals at the current level, make sure that in
		// pressEvent, isPressed and intervals includes checking for the
		// current level name.

		const levelList = this._levels;
		let xml = new XMLHttpRequest();

		xml.onreadystatechange = () => {
			if(xml.readyState === 4)
				levelList[levelId].controller = eval(`(${xml.responseText})`);
		}

		if(levelList[levelId].controller === undefined) {
			xml.open("get", this._appPath + levelList[levelId].data.settings.controllerPath, false);
			xml.send();
		}
		
		levelList[levelId].controller({
			app: this._app,
			world: this,
			loaders: this._loaders,
			languages: this._languages,
			keyboard: this._keyboard,
			audio: this._audio,
			player: this._player,
			camera: this._camera
		});
	}

	_sortElements(levelId) {
		this._levels[levelId].data.elements.sort((a, b) => {
			if(a.settings.layer > b.settings.layer) 
				return 1;

			if(a.settings.layer < b.settings.layer) 
				return -1;

			return 0;
		});
	}

	_prepareObject(object, spriteSheets) {
		if(object.type === 'rectangle')
			return new Rectangle(object);

		else if(object.type === 'sprite')
			return new Sprite(object, spriteSheets);

		else if(object.type === 'text')
			return new Text(object);
	}

	_getReadyLevel(path) {
		const levelList = this._levels;
		this._previousLevelId = this._currentLevelId;
		
		if(levelList[levelList.findIndex(item => item.path === path)] === undefined) {
			this._currentLevelId++;
			levelList[this._currentLevelId] = this._loaders.jsonFile('level', path);
			levelList[this._currentLevelId].id = this._currentLevelId;
		}

		else
			this._currentLevelId = levelList.findIndex(item => item.path === path)

		for(let j in levelList[this._currentLevelId].data.elements) {
			levelList[this._currentLevelId].data.elements[j] = 
				levelList[this._currentLevelId].data.elements[j].type !== 'sprite' ?
				this._prepareObject(levelList[this._currentLevelId].data.elements[j]) :
				this._prepareObject(levelList[this._currentLevelId].data.elements[j], levelList[this._currentLevelId].data.spriteSheets);
		}

		this._sortElements(this._currentLevelId);

		if(levelList[this._currentLevelId].data.settings.controllerPath !== undefined)
			this._doController(this._currentLevelId);
	}

	_isObjectVisible(object, padding) {
		if(object.isVisible) {
			return object.coords[0] <= this._canvas.width-padding &&
				object.coords[1] <= this._canvas.height-padding &&
				object.coords[0] + object.coords[2] >= padding &&
				object.coords[1] + object.coords[3] >= padding;
		}

		else {
			return false;
		}
	}

	initialize(options) {
		// Elements init
		this._app = options.app || null;
		this._loaders = options.loaders || null;
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

		if(this._camera) {
			this._context.translate(this._canvas.width/2, this._canvas.height/2);
			this._context.rotate(this._camera.degree * Math.PI/180);
			this._context.translate(-this._canvas.width/2, -this._canvas.height/2);
		}

		// Level draw
		for(let i in elementsInLevel) {
			const objSettings = elementsInLevel[i].settings;
			
			if(this._isObjectVisible(objSettings, 0)) {
				elementsInLevel[i].draw();

				// If debug mode is enabled - show borders and center points of objects
				if(this._debugMode)
					elementsInLevel[i].drawInDebug();
			}
		}
		
		this._context.restore();
	}

	getElementByName(elementName) {
		const levelElements = this._levels[this._currentLevelId].data.elements;
		return levelElements[levelElements.findIndex(elem => elem.settings.name === elementName)].settings;
	}

	getElementsFromLayer(layerNum) {
		const levelElements = this._levels[this._currentLevelId].data.elements;
		let arr = [];

		for(let i in levelElements) {
			if(levelElements[i].settings.layer === layerNum)
				arr.push(levelElements[i].settings)
		}

		return arr;
	}

	createElement(settings, spriteSheets) {
		const levelData = this._levels[this._currentLevelId].data;
		levelData.elements.push(
			settings.type !== 'sprite' ?
			this._prepareObject(settings) :
			this._prepareObject(settings, spriteSheets || this._levels[this._currentLevelId].spriteSheets)
		);
		this._sortElements(this._currentLevelId);
		return settings;
	}

	deleteElement(name) {
		const elementsInLevel = this._levels[this._currentLevelId].data.elements;
		const searchingElement = elementsInLevel.findIndex(item => item.settings.name === name);
		if(searchingElement !== -1) {
			elementsInLevel.splice(searchingElement, 1);
			this._sortElements(this._currentLevelId);
		}
	
		else
			throw new Error(`Element with name "${name}" is not defined!`);
	}

	set level(levelPath) {
		if(this._currentLevelId !== this._previousLevelId)
			this._previousLevelId = this._currentLevelId;
		this._getReadyLevel(levelPath);
	}

	get currentLevel() { return this._levels[this._currentLevelId] }
	get currentLevelName() { return this._levels[this._currentLevelId].data.settings.name }
	get currentLevelId() { return this._currentLevelId }
	get levels() { return this._levels }
}

export default World;