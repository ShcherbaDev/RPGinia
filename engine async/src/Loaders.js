export default class Loaders {
    constructor() {
        this._fileList = [];
    }

    loadJSON(fileType, filePath) {
        const self = this;
        let buffer = [];

        if(typeof filePath === "string") {          
            buffer.push({
                xhr: new XMLHttpRequest(),
                data: {
                    type: fileType,
                    path: filePath,
                    isLoaded: false
                }
            });

            const length = buffer.length-1;
            const currentLevelXhr = buffer[length].xhr;

            currentLevelXhr.open("GET", this.__proto__.appPath + filePath, true);
            currentLevelXhr.send();

            currentLevelXhr.onreadystatechange = () => {
                if(currentLevelXhr.readyState === 3)
                    buffer[length].data.content = JSON.parse(currentLevelXhr.responseText);

                if(currentLevelXhr.readyState === 4) {
                    buffer[length].data.isLoaded = true;

                    if(buffer[length].data.type === "level" && buffer[length].data.content.settings.controllerPath) {
                        buffer[length].controllerXhr = new XMLHttpRequest();
                        const controllerXhr = buffer[length].controllerXhr;
                        controllerXhr.open("GET", this.__proto__.appPath + buffer[length].data.content.settings.controllerPath, true);
                        controllerXhr.send();
                        controllerXhr.onreadystatechange = () => {
                            if(controllerXhr.readyState === 4)
                                buffer[length].data.controller = eval(`(${controllerXhr.responseText})`);

                            if(controllerXhr.status !== 200)
                                throw new Error(controllerXhr.status + ': ' + controllerXhr.statusText);
                        }
                    }

                    self._fileList.push(buffer[length].data);
                }

                if(currentLevelXhr.status !== 200)
                    throw new Error(currentLevelXhr.status + ': ' + currentLevelXhr.statusText);
            }
        }

        else if(Array.isArray(filePath)) {
            for(let i in filePath) {
                buffer.push({
                    xhr: new XMLHttpRequest(),
                    data: {
                        type: fileType,
                        path: filePath[i],
                        isLoaded: false
                    }
                });

                const currentLevelXhr = buffer[i].xhr;

                currentLevelXhr.open("GET", this.__proto__.appPath + filePath[i], true);
                currentLevelXhr.send();

                currentLevelXhr.onreadystatechange = () => {
                    if(currentLevelXhr.readyState === 3)
                        buffer[i].data.content = JSON.parse(currentLevelXhr.responseText);

                    if(currentLevelXhr.readyState === 4) {
                        buffer[i].data.isLoaded = true;

                        if(buffer[i].data.type === "level" && buffer[i].data.content.settings.controllerPath) {
                            buffer[i].controllerXhr = new XMLHttpRequest();
                            const controllerXhr = buffer[i].controllerXhr;
                            controllerXhr.open("GET", this.__proto__.appPath + buffer[i].data.content.settings.controllerPath, true);
                            controllerXhr.send();
                            controllerXhr.onreadystatechange = () => {
                                if(controllerXhr.readyState === 4)
                                    buffer[i].data.controller = eval(`(${controllerXhr.responseText})`);

                                if(controllerXhr.status !== 200)
                                    throw new Error(controllerXhr.status + ': ' + controllerXhr.statusText);
                            }
                        }

                        self._fileList.push(buffer[i].data);
                    }

                    if(currentLevelXhr.status !== 200)
                        throw new Error(currentLevelXhr.status + ': ' + currentLevelXhr.statusText);
                }
            }
        }
    }

    onAllFilesLoaded(callback, interval = 500) {
        let loadedFiles = [];

        const checkInterval = setInterval(() => {
            for(let i in this._fileList) {
                if(this._fileList[i].isLoaded)
                    loadedFiles.push(i);
            }

            if(loadedFiles.length === this._fileList.length) {
                clearInterval(checkInterval);
                
                return new Promise(resolve => {
                    callback(resolve);
                })
            } 
        }, interval);
    }

    get fileList() {
        return this._fileList;
    }
}