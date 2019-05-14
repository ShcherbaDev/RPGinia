import LevelManager from './LevelManager.js';
import GameObject from './GameObject.js';
import Camera from './Camera.js';

/**
 * Class for drawing levels and doing their logic.
 * @memberof RPGinia
 * @class
 */
class World {
	/**
	 * @constructor
	 * @param {Boolean} [loadLevelsControllers=true] - Load levels controllers.
	 */
	constructor(appClass, loadLevelsControllers = true) {
		this._app = appClass;
		this._loaders = this._app._loaders;

		/** 
		 * Playground tag from the prototype given from App class.
		 * @type {Object}
		 * @private
		 */
		this._canvas = this._app._canvas;

		/** 
         * Get a context object for drawing given from App class.
         * @private
         * @type {Object}
         */
		this._context = this._app._context;

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this._app._appPath;

		/**
		 * Should playground draw objects borders boolean.
		 * @private
		 */
		this._debugMode = this._app._debugMode;

		/**
		 * Should level manager load controllers for levels.
		 * @private
		 */
		this._loadControllers = loadLevelsControllers;

		this._camera = new Camera();

		/**
		 * Level manager for changing levels.
		 * @private
		 */
		this._levelManager = new LevelManager(this);
	}

	_getActiveSpriteSheet() {
		return this._loaders._getFilesByType('spriteSheet').findIndex(async spriteSheet => spriteSheet.name === await this._levelManager.getActiveLevel()._spriteSheetName);
	}

	/** 
	 * Draws level objects. Must be used in a loop.
	 * @example
	 * function loop() {
	 * 	world.render();
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	async render() {
		await this._levelManager._renderer.render();
	}

	// LevelManager methods
	async getActiveLevel() {
		const activeLevel = await this._levelManager.getActiveLevel();
		return activeLevel;
	}
	
	async setLevel(levelObjOrName, additionalOptions) {
		const newLevel = await this._levelManager.setLevel(levelObjOrName, additionalOptions);
		return newLevel;
	}

	// ObjectManager methods
	async sortObjectsByLayer(objectList) {
		const currentLevel = await this._levelManager.getActiveLevel();
		
		let sortList = objectList;

		if (sortList === undefined) {
			sortList = currentLevel._objects;
		}

		return currentLevel._objectManager.sortObjectsByLayer(sortList);
	}

	async getObjectByName(name) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.getObjectByName(name);
	}

	async getObjectsFromLayer(layerNumber) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.getObjectsFromLayer(layerNumber);
	}

	async addObjectInCurrentLevel(settings) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.addObject(settings);
	}

	async deleteObjectInCurrentLevel(name) {
		const currentLevel = await this._levelManager.getActiveLevel();
		return currentLevel._objectManager.deleteObject(name);
	}
	
	get app() { return this._app; }

	get loaders() { return this._loaders; }

	get levelManager() { return this._levelManager; }
	
	get camera() { return this._camera; }

	/** 
	 * Get levels array.
	 * @readonly
	 * @type {Object[]}
	 */
	get levels() { return this._levelManager._levelList; }

	static get LevelManager() { return LevelManager; }

	static get Object() { return GameObject; }
}

export default World;
