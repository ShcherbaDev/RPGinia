export default class Loaders {
    constructor() {
        this._fileList = [];
    }

    async loadJSON(fileType, filePath) {
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

            currentLevelXhr.open("GET", self.__proto__.appPath + filePath, true);
            currentLevelXhr.send();

            currentLevelXhr.onreadystatechange = () => {
                if(currentLevelXhr.readyState === 4) {
                    buffer[length].data.content = JSON.parse(currentLevelXhr.responseText);
                    buffer[length].data.isLoaded = true;


                    if(buffer[length].data.type === "level" && buffer[length].data.content.settings.controllerPath) {
                        buffer[length].data.controller = {
                            xhr: new XMLHttpRequest(),
                            isLoaded: false
                        }
                        const controllerXhr = buffer[length].data.controller.xhr;
                        controllerXhr.open("GET", self.__proto__.appPath + buffer[length].data.content.settings.controllerPath, true);
                        controllerXhr.send();
                        controllerXhr.onreadystatechange = () => {
                            if(controllerXhr.readyState === 4) {
                                buffer[length].data.controller.isLoaded = true;
                                buffer[length].data.controller.content = eval(`(${controllerXhr.responseText})`);
                            }

                            if(controllerXhr.status !== 200)
                                throw new Error(controllerXhr.status + ': ' + controllerXhr.statusText);
                        }
                    
                    }

                    self._fileList.push(buffer[length].data);
                    return self._fileList[self._fileList.length-1];
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

                currentLevelXhr.open("GET", self.__proto__.appPath + filePath[i], true);
                currentLevelXhr.send();

                currentLevelXhr.onreadystatechange = () => {
                    if(currentLevelXhr.readyState === 4) {
                        buffer[i].data.content = JSON.parse(currentLevelXhr.responseText);
                        buffer[i].data.isLoaded = true;


                        if(buffer[i].data.type === "level" && buffer[i].data.content.settings.controllerPath) {
                            buffer[i].data.controller = {
                                xhr: new XMLHttpRequest(),
                                isLoaded: false
                            }
                            const controllerXhr = buffer[i].data.controller.xhr;
                            controllerXhr.open("GET", self.__proto__.appPath + buffer[i].data.content.settings.controllerPath, true);
                            controllerXhr.send();
                            controllerXhr.onreadystatechange = () => {
                                if(controllerXhr.readyState === 4) {
                                    buffer[i].data.controller.isLoaded = true;
                                    buffer[i].data.controller.content = eval(`(${controllerXhr.responseText})`);
                                }

                                if(controllerXhr.status !== 200)
                                    throw new Error(controllerXhr.status + ': ' + controllerXhr.statusText);
                            }
                        
                        }

                        self._fileList.push(buffer[i].data);
                        return self._fileList[self._fileList.length-1];
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
                if(this._fileList[i].type === "level") {
                    if(this._fileList[i].content.settings.controllerPath) {
                        if(this._fileList[i].isLoaded && this._fileList[i].controller.isLoaded)
                            loadedFiles.push(i);
                    }
                    else {
                        if(this._fileList[i].isLoaded)
                            loadedFiles.push(i);
                    }
                }

                else {
                    if(this._fileList[i].isLoaded)
                        loadedFiles.push(i);
                }
            }

            if(loadedFiles.length >= this._fileList.length) {
                clearInterval(checkInterval);
                
                return new Promise(resolve => {
                    callback(resolve);
                })
            } 
        }, interval);
    }

    get levels() {
        let resultArr = [];
        for(let i in this._fileList) {
            if(this._fileList[i].type === "level") {
                resultArr.push(this._fileList[i]);
            }
        }
        return resultArr;
    }

    get languages() {
        let resultArr = [];
        for(let i in this._fileList) {
            if(this._fileList[i].type === "language") {
                resultArr.push(this._fileList[i]);
            }
        }
        return resultArr;
    }

    get spriteSheet() {
        return this._fileList[this._fileList.findIndex(e => e.type === "spriteSheet")];
    }

    get fileList() {
        return this._fileList;
    }
}