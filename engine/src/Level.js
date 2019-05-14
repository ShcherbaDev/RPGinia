import ObjectManager from './ObjectManager.js';

class Level {
	constructor(worldClass, levelJsonObject) {
		return (async () => {
			const {settings, elements} = levelJsonObject;
			const {name, background, controllerPath, spriteSheetName, spriteSheetPath} = settings;

			this._world = worldClass;

			this._appPath = this._world._app._appPath;

			this._name = name;
			this._background = background;

			this._spriteSheetName = spriteSheetName;
			this._spriteSheetPath = spriteSheetPath;
			this._spriteSheet = this._spriteSheetName !== undefined ? this._findSpriteSheetByName() : await this._defineSpriteSheetByPath();

			this._originalObjectList = elements;
			this._objectManager = new ObjectManager(this);
			this._objects = this._objectManager._objects;

			if (this._world._levelManager._loadControllers && controllerPath !== undefined) {
				this._controller = await this._defineController(controllerPath);
			}

			this._isActive = false;
            
			return this;
		})();
	}

	_findSpriteSheetByName() {
		const indexOfRequiredSpriteSheet = this._world._loaders.spriteSheets.findIndex(spriteSheet => spriteSheet.name === this._spriteSheetName);

		// If can found a required sprite sheet.
		if (indexOfRequiredSpriteSheet !== -1) {
			return this._world._loaders.spriteSheets[indexOfRequiredSpriteSheet];
		}
		throw new Error(`Can't find sprite sheet with name "${this._spriteSheetName}"`);
	}

	async _defineSpriteSheetByPath() {
		const indexOfRequiredSpriteSheet = this._world._loaders.spriteSheets.findIndex(spriteSheet => spriteSheet.url === this._appPath + this._spriteSheetPath);

		// If can found a require sprite sheet.
		if (indexOfRequiredSpriteSheet !== -1) {
			return this._world._loaders.spriteSheets[indexOfRequiredSpriteSheet];
		}
        
		const newSpriteSheet = await this._world._app._loaders.loadSpriteSheet(this._spriteSheetPath, this._spriteSheetPath);
		return newSpriteSheet;
	}

	async _defineController(controllerPath) {
		const defineFile = await fetch(`${this._appPath}${controllerPath}`);
		const response = await defineFile.text();
		
		const parseLevelControllerFunction = eval;
		return parseLevelControllerFunction(`(${response})`);
	}

	getObjectByName(objectName) {
		return this._objects[this._objects.findIndex(item => item.settings.name === objectName)];
	}

	getObjectsFromLayer(layerNumber) {
		const resultArr = [];

		this._objects.forEach((item) => {
			if (item.settings.layer === layerNumber) {
				resultArr.push(item);
			}
		});

		return resultArr;
	}

	get name() { return this._name; }
}

export default Level;
