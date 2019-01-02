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
		// let previousFile = this._files.length > 1 ? this._files.length-1 : 0;
		// console.log(previousFile, this._files, this._files[previousFile]);

		if(this._checkFileType(fileType)) {
			const xml = this._xml;
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
					const output = JSON.parse(xml.responseText);
					lastFile.isLoaded = lastFile.type !== "level" ? true : false;
					lastFile.data = output;


					return callback(output);
				}
			}

			xml.open("get", this._appPath + filePath, false);
			xml.send();
		}
	}

	/**
	 * Load one JSON file.
	 * @param {String} fileType - File type. Can access only types "level", "language" and "spriteSheet".
	 * @param {String} filePath - Defines a file path. 
	 * @throws Will throw an error if the "fileType" argument is not equals "level" or "language" or "spriteSheet".
	 */
	jsonFile(fileType, filePath) {
		if(this._checkFileType(fileType)) {
			const loadFile = this._loadSignleFile(filePath, fileType, (output) => {
				let lastFile = this._files[this._files.length-1];
				if(lastFile.type === "level" && output.settings.spriteSheetPath !== undefined) {
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
								output.elements[i].image.src = this._appPath + response[output.elements[i].spriteSheetIndex].file;
								if(spriteElements.length === loadedSpriteElements.length) {
									lastFile.data = output;
									return lastFile;
								}
							});
						}
					}
				}

				this._files = this._filterFiles(this._files);

				return lastFile;
			});
			console.log(loadFile)
			return loadFile;
			// console.log(this._files);

			// const xml = this._xml;
			// let lastFile;
			// xml.onreadystatechange = () => {
			// 	if(xml.readyState === 1) {
			// 		this._files.push({
			// 			type: fileType,
			// 			isLoaded: false,
			// 			path: this._appPath + filePath,
			// 			data: {}
			// 		});
	
			// 		lastFile = this._files[this._files.length-1];
			// 	}
	
			// 	if(xml.readyState === 4) {
			// 		const output = JSON.parse(xml.responseText);
					
			// 		if(lastFile.type === "level" && output.settings.spriteSheetPath !== undefined) {
			// 			for(let i in output.elements) {
			// 				if(output.elements[i].type === "sprite") {
			// 					output.elements[i].image = new Image();
			// 					output.elements[i].isLoaded = false;
			// 					output.elements[i].image.onload = () => {
			// 						output.elements[i].isLoaded = true;
			// 					}
			// 					this._loadSignleFile(output.settings.spriteSheetPath, "spriteSheet", (response) => {
			// 						output.elements[i].image.src = this._appPath + response[output.elements[i].spriteSheetIndex].file;
			// 					});
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			// xml.open("get", this._appPath + filePath, false);
			// xml.send();



			// this._loadSignleFile(filePath, fileType)
			// 	.then(response => {
			// 		if(fileType === "level" && response.settings.spriteSheetPath !== undefined) {
			// 			for(let i in response.elements) {
			// 				if(response.elements[i].type === "sprite") {
			// 					this._loadSignleFile("spriteSheet", response.settings.spriteSheetPath).then(resp => {
			// 						console.log("asd");
			// 						// response.elements[i].image = new Image();
			// 						// response.elements[i].image.onload = () => {

			// 						// }
								
									
			// 						// response.elements[i].image.src = 
			// 					});
								
			// 					// response.elements[i].image.src = 
			// 				}
			// 			}
			// 		}
			// 		return response;

			// 		// console.log(response, this._files);
			// 	}).then(output => {
			// 		console.log(output)
			// 		return output;
			// 	});

			// xml.onreadystatechange = () => {
			// 	if(xml.readyState === 1) {
			// 		this._files.push({
			// 			type: fileType,
			// 			isLoaded: false,
			// 			path: this._appPath + filePath,
			// 			data: {}
			// 		});

			// 		lastFile = this._files[this._files.length-1];
			// 	}

			// 	if(xml.readyState === 4) {
					
			// 		const output = JSON.parse(xml.responseText);
					
			// 		if(fileType === "level" && output.settings.spriteSheetPath !== undefined) {
			// 			console.log();
			// 			for(let i in output.elements) {
			// 				if(output.elements[i].type === "sprite") {
			// 					output.elements[i].image = new Image();
			// 					output.elements[i].isLoaded = false;
			// 					output.elements[i].image.onload = () => {
			// 						output.elements[i].isLoaded = true;
			// 					}
			// 					this._loadSignleFile(output.settings.spriteSheetPath, "spriteSheet")
			// 						.then(response => {
			// 							output.elements[i].image.src = this._appPath + response[0].file;
			// 						});
			// 				}
			// 			}
			// 		}

			// 		lastFile.data = output;
					
					// lastFile.isLoaded = true;

					// if(this._debugMode)
					// 	console.info(`${fileType} file loaded: ${this._appPath + filePath}`);

					// return lastFile;
			// 	}
			// }

			// xml.open("get", this._appPath + filePath, false);
			// // xml.send();

			// return lastFile;
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