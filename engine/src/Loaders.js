export default class Loaders {
    constructor() {
        this._files = [];
    }

    async jsonFile(fileType, filePath) {
        // let xml = new XMLHttpRequest();  
        // xml.onload = () => {
        //     this._files.push({
        //         type: fileType,
        //         path: this.__proto__.appPath + filePath,
        //         data: JSON.parse(xml.responseText)
        //     });
        //     return this._files[this._files.length-1]
        // }
        // xml.open("get", this.__proto__.appPath + filePath, true);  
        // xml.send();

        return fetch(this.__proto__.appPath + filePath)
            .then(response => response.json())
            .then(givenData => {
                this._files.push({
                    type: fileType,
                    path: this.__proto__.appPath + filePath,
                    data: givenData
                });
                return this._files[this._files.length-1];
            })
    }

    static get files() {
        return this._files;
    }

    get files() {
        return this._files;
    }
}