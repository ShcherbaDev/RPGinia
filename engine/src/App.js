import Loaders from "./Loaders.js";
import World from "./World.js";
import Keyboard from "./Keyboard.js";
import AudioManager from "./AudioManager.js";
import RPGinia from "./RPGinia.js";

/**
 * Class with main engine functional.
 * @memberof RPGinia
 * @class
 */
class App {
	/**
	 * 
	 * @param {string} [title] 
	 * @param {Object} [canvas] 
	 * @param {Array} [sizes] 
	 * @param {boolean} [isImageSmoothingEnabled] 
	 */
	constructor(title = "RPGinia app", canvas = document.querySelector("canvas"), sizes = [800, 600], isImageSmoothingEnabled = false) {
		this._title = title;
		this._canvas = canvas;
		this._context = this._canvas.getContext("2d");
		this._sizes = sizes;
		this._isImageSmoothingEnabled = isImageSmoothingEnabled;

		this._globalVariables = [];

		this.__proto__.Loaders = Loaders;
		this.__proto__.Keyboard = Keyboard;
		this.__proto__.AudioManager = AudioManager;

		World.prototype.canvas = this._canvas;
		World.prototype.context = this._context;
		this.__proto__.World = World;

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

	setGlobalVariable(name, value) {
		this._globalVariables[name] = value;
	}

	getGlobalVariable(name) {
		return this._globalVariables[name];
	}

	get canvas() { return this._canvas }
	get context() { return this._context }

	get globalVariables() { return this._globalVariables }
}

export default RPGinia;