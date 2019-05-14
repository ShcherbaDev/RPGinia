import Level from './Level.js';
import Renderer from './Renderer.js';

class LevelManager {
	constructor(worldClass) {
		this._world = worldClass;

		this._loaders = this._world._loaders;

		this._renderer = new Renderer(this, this._world, this._loaders);

		this._loadControllers = this._world._loadControllers;

		this._levelList = [];
	}

	_applyAdditionalOptions(options = {}) {
		let {cameraPosition} = options;

		if (cameraPosition === undefined) {
			cameraPosition = [0, 0];
		}
		
		this._world._camera._x = cameraPosition[0];
		this._world._camera._y = cameraPosition[1];
	}

	_doController(levelContent) {
		if (levelContent._controller !== undefined) {
			levelContent._controller({
				app: this._world._app,
				audioManager: this._world._app._audioManager,
				keyboard: this._world._app._keyboard,
				loaders: this._world._loaders,
				world: this._world
			});
		}
	}

	_doLevel(levelContent, additionalOptions) {
		const newLevel = levelContent;
		const additionalOptionsForNewLevel = additionalOptions;

		// Disable activity of previous level.
		this._levelList[this._levelList.findIndex(async level => level._isActive)]._isActive = false;

		// Enable activity of new level.
		newLevel._isActive = true;

		this._applyAdditionalOptions(additionalOptionsForNewLevel);

		this._doController(newLevel);

		if (this._world._app._debugMode) {
			console.info(`Level with name "${newLevel._name}" is now active!`);
		}
		return newLevel;
	}

	/**
	 * Changes level to another.
	 * @param {object|string} levelObjOrName - Level object from loaders or existing level's name.
	 * 
	 * @param {object} additionalOptions - Options that will set the necessary values for game subsystems when changing levels.
	 * @param {number[]} additionalOptions.cameraPosition - The start coordinates of camera when changing the level.
	 */
	async setLevel(levelObjOrName, additionalOptions) {
		// If level is object and not an array.
		if (typeof levelObjOrName === 'object' && !Array.isArray(levelObjOrName)) {
			const searchedLevelId = this._levelList.findIndex(level => level._name === levelObjOrName.data.settings.name);

			// If given level is already exist.
			if (searchedLevelId === -1) {
				const levelContent = await new Level(this._world, levelObjOrName.data);
				this._levelList.push(levelContent);
				return this._doLevel(levelContent, additionalOptions);
			}
			throw new Error(`Level with name "${this._levelList[searchedLevelId].settings.name}" is already exist!`);
		}
		// If argument was given as a string.
		else if (typeof levelObjOrName === 'string') {
			const searchedLevelId = this._levelList.findIndex(level => level._name === levelObjOrName);

			// If level with typed name wasn't found.
			if (searchedLevelId === -1) {
				throw new Error(`Level with name "${levelObjOrName}" wasn't found!`);
			}
			else {
				return this._doLevel(this._levelList[searchedLevelId], additionalOptions);
			}
		}
		else {
			throw new TypeError('Argument\'s type should be a string or a object!');
		}
	}

	async getActiveLevel() {
		const activeLevel = await this._levelList[this._levelList.findIndex(level => level._isActive)];
		return activeLevel;
	}
}

export default LevelManager;
