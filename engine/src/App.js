import Loaders from "./Loaders.js";

export default class App {
    constructor(title = "RPGinia app", canvas = document.querySelector("canvas"), sizes = [800, 600], isImageSmoothingEnabled = true) {
        this._title = title;
		this._canvas = canvas;
		this._context = this._canvas.getContext("2d");
		this._sizes = sizes;
		this._isImageSmoothingEnabled = isImageSmoothingEnabled;

        Loaders.prototype.appPath = this.__proto__.appPath;
        this._loaders = Loaders;

		this._init();
    }

    _init() {
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
        this._context.imageSmoothingEnabled = this._isImageSmoothingEnabled;
    }
    
    get compositor() { return this._compositor }
    get loaders() { return this._loaders }
}