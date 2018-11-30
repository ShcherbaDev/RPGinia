import Loaders from "./Loaders.js";
import World from "./World.js";

export default class App {
	constructor(title = "RPGinia app", canvas = document.querySelector("canvas"), sizes = [800, 600], isImageSmoothingEnabled = true) {
		this._title = title;
		this._canvas = canvas;
		this._context = this._canvas.getContext("2d");
		this._sizes = sizes;
		this._isImageSmoothingEnabled = isImageSmoothingEnabled;

		Loaders.prototype.appPath = this.__proto__.appPath;
		this._loaders = Loaders;

		World.prototype.appPath = this.__proto__.appPath;
		World.prototype.canvas = this._canvas;
		World.prototype.context = this._context;
		this._world = World;

		this._init();
	}

	_init() {
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
		this._context.imageSmoothingEnabled = this._isImageSmoothingEnabled;
	}

	clearPlayground() {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	get loaders() { return this._loaders }
	get world() { return this._world }

	get canvas() { return this._canvas }
	get context() { return this._context }
}