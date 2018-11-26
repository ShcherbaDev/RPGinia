export default class Loaders {
    constructor() {
        this._files = [];
        this._xml = new XMLHttpRequest();
    }

    jsonFile(fileType, filePath) {
        const xml = this._xml;

        xml.onreadystatechange = () => {
            if(xml.readyState === 1) {
                this._files.push({
                    type: fileType,
                    isLoaded: false,
                    path: this.__proto__.appPath + filePath,
                    data: {}
                });
            }

            if(xml.readyState === 4) {
                this._files[this._files.length-1].data = JSON.parse(xml.responseText);
                this._files[this._files.length-1].isLoaded = true;

                console.info(`${fileType.charAt(0).toUpperCase()}${fileType.substring(1)} loaded: ${this.__proto__.appPath + filePath}`);
                
                return this._files[this._files.length-1];
            }
        }

        xml.open("get", this.__proto__.appPath + filePath, false);  
        xml.send();
    }

    get levels() {
        let resultArr = [];
        for(let i in this._files) {
            if(this._files[i].type === "level" && this._files[i].isLoaded) {
                resultArr.push(this._files[i]);
            }
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