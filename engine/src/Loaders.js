/**
 * Class for loading files.
 * @memberof RPGinia
 * @class
 */

class Loaders {
	/**
	 * @constructor
	 */
	constructor(rpginiaApp) {
		this._app = rpginiaApp;

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this._app._appPath;

		this._debugMode = this._app._debugMode;

		/**
		 * Files array.
		 * @type {Object[]}
		 * @private
		 */
		this._files = [];

		this._app._loaders = this;
	}

	_checkLevelCondition(json) {
		const {settings, elements} = json;
		const {name} = settings;

		return settings !== undefined && name !== undefined && elements.length >= 1;
	}

	_checkSpriteSheetCondition(json) {
		return json.length >= 1;
	}

	_checkFileConditions(type, url, json) {
		const isUnique = () => this._files.indexOf(url) === -1;
		
		// If file is not exist
		if (isUnique()) {
			if (type === 'level') {
				return this._checkLevelCondition(json);
			}
			if (type === 'spriteSheet') {
				return this._checkSpriteSheetCondition(json);
			}
			// There aren't any rules for json only files.
			if (type === 'json') {
				return true;
			}
		}
		return false;
	}

	_getFilesByType(type) {
		const resultArr = [];

		this._files.forEach((file) => {
			if (file.type === type) {
				resultArr.push(file);
			}
		});

		return resultArr;
	}

	async _loadJsonFile(type, path, ...args) {
		const request = await fetch(`${this._appPath}${path}`);
		const json = await request.json();

		if (this._checkFileConditions(type, request.url, json)) {
			const settings = {
				type,
				url: request.url,
				data: json
			};

			if (type === 'spriteSheet' || type === 'json') {
				settings.name = args[0];
			}

			this._files.push(settings);

			const newFile = this._files[this._files.length - 1];

			// Log to console if debug mode is enabled.
			if (this._app._debugMode) {
				let fileName = null;

				if (type === 'level') {
					fileName = newFile.data.settings.name;
				}
				else if (type === 'spriteSheet' || type === 'json') {
					fileName = args[0];
				}

				console.info(`${type.toUpperCase()} "${fileName}" has been loaded!`);
			}

			return newFile;
		}
		
		throw new Error(`${type.toUpperCase()} didn't passed the conditions!`);
	}

	async loadLevel(path) {
		const loadedLevel = await this._loadJsonFile('level', path);
		return loadedLevel;
	}

	async loadSpriteSheet(name, path) {
		const loadedSpriteSheet = await this._loadJsonFile('spriteSheet', path, name);
		return loadedSpriteSheet;
	}

	async loadJsonFile(name, path) {
		const loadedJsonFile = await this._loadJsonFile('json', path, name);
		return loadedJsonFile;
	}

	/** 
	 * Get an array of loaded levels.
	 * @readonly
	 * @type {Object[]}
	 */
	get levels() {
		return this._getFilesByType('level');
	}

	/** 
	 * Get an array of loaded sprite sheets.
	 * @readonly
	 * @type {Object[]}
	 */
	get spriteSheets() {
		return this._getFilesByType('spriteSheet');
	}

	/**
	 * Get an array of files that are not processed by the engine.
	 * @readonly
	 * @type {Object[]}
	 */
	get jsonFiles() {
		return this._getFilesByType('json');
	}

	// /** 
	//  * Get an array of loaded levels.
	//  * @readonly
	//  * @type {Object[]}
	//  */
	// get levels() {
	// 	const resultArr = [];
	// 	for (const i in this._files) {
	// 		if (this._files[i].type === 'level' && this._files[i].isLoaded) { resultArr.push(this._files[i]); }
	// 	}
	// 	return resultArr;
	// }

	// /** 
	//  * Get an array of loaded languages.
	//  * @readonly
	//  * @type {Object[]}
	//  */
	// get languages() {
	// 	const resultArr = [];
	// 	for (const i in this._files) {
	// 		if (this._files[i].type === 'language' && this._files[i].isLoaded) { resultArr.push(this._files[i]); }
	// 	}
	// 	return resultArr;
	// }

	// /** 
	//  * Get an array of loaded sprite sheets.
	//  * @readonly
	//  * @type {Object[]}
	//  */
	// get spriteSheets() {
	// 	const resultArr = [];
	// 	for (const i in this._files) {
	// 		if (this._files[i].type === 'spriteSheet' && this._files[i].isLoaded) { resultArr.push(this._files[i]); }
	// 	}
	// 	return resultArr;
	// }
	
	/** 
	 * Get an array of files.
	 * @readonly
	 * @type {Object[]}
	 */
	get files() { return this._files; }
}

export default Loaders;
