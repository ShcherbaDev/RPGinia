// Note:
// This class uses a synchronous type of loading files. 
// Actually, I don't know, which of types I need to use: synchronous or asynchronous. 
// Maybe I'll add a new branch with asynchronous type of loading.

/**
 * Class for loading files. Mostly JSON files.
 * @memberof RPGinia.App
 * @class
 */

class Loaders {
	/**
	 * @constructor
	 * @param {Boolean} [enableDebugMode=false] - Enable debug mode to display load or error notifications in console.
	 */
	constructor(enableDebugMode = false) {
		/**
		 * Files array.
		 * @type {Object[]}
		 * @private
		 */
		this._files = [];

		/**
		 * XMLHttpRequest to load files.
		 * @type {Object}
		 * @private
		 */
		this._xml = new XMLHttpRequest();

		/** 
		 * App path from the prototype given from App class.
		 * @type {String}
		 * @private
		 */
		this._appPath = this.__proto__.appPath;

		this._debugMode = enableDebugMode;
	}

	/**
	 * Type checking. Allowed values: "level", "language", "spriteSheet"
	 * @private
	 * @param {String} type 
	 */
	_checkFileType(type) {
		return type === "level" || type === "language" || type === "spriteSheet";
	}

	/**
	 * Load one JSON file.
	 * @param {String} fileType - File type. Can access only types "level", "language" and "spriteSheet".
	 * @param {String} filePath - Defines a file path. 
	 * @throws Will throw an error if the "fileType" argument is not equals "level" or "language" or "spriteSheet".
	 */
	jsonFile(fileType, filePath) {
		const xml = this._xml;
		let lastFile;

		if(this._checkFileType(fileType)) {
			xml.onreadystatechange = () => {
				if(xml.readyState === 1) {
					this._files.push({
						type: fileType,
						isLoaded: false,
						path: this._appPath + filePath,
						data: {}
					});

					lastFile = this._files[this._files.length-1];
				}

				if(xml.readyState === 4) {
					const output = JSON.parse(xml.responseText);

					lastFile.data = output;
					lastFile.isLoaded = true;

					if(this._debugMode)
						console.info(`${fileType} file loaded: ${this._appPath + filePath}`);

					return lastFile;
				}
			}

			xml.open("get", this._appPath + filePath, false);
			xml.send();

			return lastFile;
		}

		else
			throw new Error(`${fileType} type is undefined!`)
	}

	/**
	 * Load multiple JSON files.
	 * @param {String} filesType - Files type. Can access only types "level", "language" and "spriteSheet".
	 * @param {String[]} filesPath - Files pathes array.
	 * @throws Will throw an error if the "filesType" argument is not equals "level" or "language" or "spriteSheet".
	 */
	jsonFiles(filesType, filesPath) {
		const xml = this._xml;
		let returnArr = [];

		if(this._checkFileType(filesType)) {
			for(let counter in filesPath) {
				xml.onreadystatechange = () => {
					if(xml.readyState === 1) {
						this._files.push({
							type: filesType,
							isLoaded: false,
							path: this._appPath + filesPath[counter],
							data: {}
						});
					}

					if(xml.readyState === 4) {
						this._files[this._files.length-1].data = JSON.parse(xml.responseText);
						this._files[this._files.length-1].isLoaded = true;

						returnArr.push(this._files[this._files.length-1])
						return this._files[this._files.length-1];
					}
				}

				xml.open("get", this._appPath + filesPath[counter], false);
				xml.send();
			}
		}

		else
			throw new Error(`${filesType} type is undefined!`)

		if(this._debugMode)
			console.info(`${filesType.charAt(0).toUpperCase()}${filesType.substring(1)} files loaded:`, filesPath);
	
		return returnArr;
	}

	/** 
	 * Get an array of loaded levels.
	 * @readonly
	 * @type {Object[]}
	 */
	get levels() {
		let resultArr = [];
		for(let i in this._files) {
			if(this._files[i].type === "level" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	/** 
	 * Get an array of loaded languages.
	 * @readonly
	 * @type {Object[]}
	 */
	get languages() {
		let resultArr = [];
		for(let i in this._files) {
			if(this._files[i].type === "language" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	/** 
	 * Get an array of loaded sprite sheets.
	 * @readonly
	 * @type {Object[]}
	 */
	get spriteSheets() {
		let resultArr = [];
		for (let i in this._files) {
			if(this._files[i].type === "spriteSheet" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}
	
	/** 
	 * Get an array of files.
	 * @readonly
	 * @type {Object[]}
	 */
	get files() { return this._files }
}

export default Loaders;