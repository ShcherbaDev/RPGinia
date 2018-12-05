export default class Loaders {
	constructor() {
		this._files = [];
		this._xml = new XMLHttpRequest();
	}

	_checkFileType(type) {
		return type === "level" || type === "language";
	}

	jsonFile(fileType, filePath) {
		const xml = this._xml;

		if(this._checkFileType(fileType)) {
			xml.onreadystatechange = () => {
				if (xml.readyState === 1) {
					this._files.push({
						type: fileType,
						isLoaded: false,
						path: this.__proto__.appPath + filePath,
						data: {}
					});
				}

				if (xml.readyState === 4) {
					this._files[this._files.length - 1].data = JSON.parse(xml.responseText);
					this._files[this._files.length - 1].isLoaded = true;

					console.info(`${fileType.charAt(0).toUpperCase()}${fileType.substring(1)} file loaded: ${this.__proto__.appPath + filePath}`);

					return this._files[this._files.length - 1];
				}
			}

			xml.open("get", this.__proto__.appPath + filePath, false);
			xml.send();

			return this._files[this._files.length - 1];
		}

		else
			throw new Error(`${fileType} type is undefined!`)
	}

	jsonFiles(filesType, filesPath) {
		const xml = this._xml;
		let returnArr = [];

		if(this._checkFileType(filesType)) {
			for(let counter in filesPath) {
				xml.onreadystatechange = () => {
					if (xml.readyState === 1) {
						this._files.push({
							type: filesType,
							isLoaded: false,
							path: this.__proto__.appPath + filesPath[counter],
							data: {}
						});
					}

					if (xml.readyState === 4) {
						this._files[this._files.length - 1].data = JSON.parse(xml.responseText);
						this._files[this._files.length - 1].isLoaded = true;

						returnArr.push(this._files[this._files.length - 1])
						return this._files[this._files.length - 1];
					}
				}

				xml.open("get", this.__proto__.appPath + filesPath[counter], false);
				xml.send();
			}
		}

		else
			throw new Error(`${filesType} type is undefined!`)

		console.info(`${filesType.charAt(0).toUpperCase()}${filesType.substring(1)} files loaded:`, filesPath);
	
		return returnArr;
	}

	get levels() {
		let resultArr = [];
		for (let i in this._files) {
			if (this._files[i].type === "level" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	get languages() {
		let resultArr = [];
		for (let i in this._files) {
			if (this._files[i].type === "language" && this._files[i].isLoaded)
				resultArr.push(this._files[i]);
		}
		return resultArr;
	}

	get files() {
		return this._files;
	}

	get xml() {
		return this._xml;
	}
}