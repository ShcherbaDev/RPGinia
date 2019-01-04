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

	_filterFiles(arr) {
		let tmp = {};
		return arr.filter(a => a.path in tmp ? 0 : tmp[a.path] = 1);
	}

	_loadSignleFile(filePath, fileType, callback) {
		if(this._checkFileType(fileType)) {
			const xml = new XMLHttpRequest();
			let lastFile;
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
					let output = JSON.parse(xml.responseText);

					if(lastFile.type !== "level") {
						lastFile.isLoaded = true;
						lastFile.data = output;
					}
					callback(output, lastFile);
				}
			}
			xml.open("get", this._appPath + filePath, false);
			xml.send();

			this._files = this._filterFiles(this._files);
		}
	}

	_loadLevel(path) {
		let returnedLevelData;
		console.log(path);
		this._loadSignleFile(path.replace(this._appPath, ""), "level", (output, lastFile) => {
			if(output.settings.spriteSheetPath !== undefined) {
				let spriteElements = [];
				let loadedSpriteElements = [];

				for(let i in output.elements) {
					if(output.elements[i].type === "sprite") {
						output.elements[i].image = new Image();
						output.elements[i].isLoaded = false;
						output.elements[i].image.onload = () => {
							output.elements[i].isLoaded = true;
							spriteElements.push(i);
							loadedSpriteElements.push(i);
						}

						this._loadSignleFile(output.settings.spriteSheetPath, "spriteSheet", (response) => {
							response = Array.isArray(response) ? response : [response];
							lastFile.spriteSheets = response;
							output.elements[i].image.src = this._appPath + response[output.elements[i].spriteSheetIndex].file;
							if(spriteElements.length === loadedSpriteElements.length) {
								lastFile.data = output;
								lastFile.isLoaded = true;

								returnedLevelData = lastFile;
							}
						});
					}
				}
			}

			else {
				lastFile.data = output;
				lastFile.isLoaded = true;

				returnedLevelData = lastFile;
			}
		});
		return returnedLevelData;
	}

	/**
	 * Load one JSON file.
	 * @param {String} fileType - File type. Can access only types "level", "language" and "spriteSheet".
	 * @param {String} filePath - Defines a file path. 
	 * @throws Will throw an error if the "fileType" argument is not equals "level" or "language" or "spriteSheet".
	 */
	jsonFile(fileType, filePath) {
		if(this._checkFileType(fileType)) {
			if(fileType === "level") {
				this._loadLevel(filePath);
			}
			return this._files[this._files.findIndex(item => item.path === this._appPath + filePath)];
		}

		else
			throw new Error(`${fileType} type is undefined!`)
	}

	// JSONFILES LOADER FOR MULTIPLE FILES
	// jsonFiles(filesType, filesPath) {
	// 	const xml = this._xml;
	// 	let returnArr = [];

	// 	if(this._checkFileType(filesType)) {
	// 		for(let counter in filesPath) {
	// 			xml.onreadystatechange = () => {
	// 				if(xml.readyState === 1) {
	// 					this._files.push({
	// 						type: filesType,
	// 						isLoaded: false,
	// 						path: this._appPath + filesPath[counter],
	// 						data: {}
	// 					});
	// 				}

	// 				if(xml.readyState === 4) {
	// 					this._files[this._files.length-1].data = JSON.parse(xml.responseText);
	// 					this._files[this._files.length-1].isLoaded = true;

	// 					returnArr.push(this._files[this._files.length-1])
	// 					return this._files[this._files.length-1];
	// 				}
	// 			}

	// 			xml.open("get", this._appPath + filesPath[counter], false);
	// 			xml.send();
	// 		}
	// 	}

	// 	else
	// 		throw new Error(`${filesType} type is undefined!`)

	// 	if(this._debugMode)
	// 		console.info(`${filesType.charAt(0).toUpperCase()}${filesType.substring(1)} files loaded:`, filesPath);
	
	// 	return returnArr;
	// }

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