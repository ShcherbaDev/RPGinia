import Loaders from './Loaders.js';
import World from './World.js';
import Keyboard from './Keyboard.js';
import AudioManager from './AudioManager.js';

/**
 * Class with main engine functional.
 * @global
 */
class RPGinia {
	/**
	 * @constructor
	 * @param {String} [title=RPGinia app] - App's title.
	 * @param {Object} [canvas=document.querySelector("canvas")] - App's playground.
	 * @param {Array} [sizes=[800, 600]] - Playground sizes. First element - width, second element - height.
	 * @param {Boolean} [isImageSmoothingEnabled=false] - Image smoothing.
	 */
	constructor(appPath = window.location.href, debugModeEnabled = false, title = 'RPGinia app', canvas = document.querySelector('canvas'), sizes = [800, 600], isImageSmoothingEnabled = false) {
		this._appPath = appPath;
		this._debugMode = debugModeEnabled;
		
		this._title = title;
		this._canvas = canvas;
		this._context = this._canvas.getContext('2d');
		this._sizes = sizes;
		this._isImageSmoothingEnabled = isImageSmoothingEnabled;

		this._loaders = null;
		this._keyboard = null;
		this._audioManager = null;

		/**
		 * An array of global variables
		 * @private
		 */
		this._globalVariables = [];

		this._init();
	}
	
	/**
	 * Initialize method for setting up the playground's sizes and image smoothing.
	 * @private
	 */
	_init() {
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
		this._context.imageSmoothingEnabled = this._isImageSmoothingEnabled;
	}
	
	/**
	 * Clears a playground. Must be used in a loop.
	 * @example
	 * function loop() {
	 * 	app.clearBackground();
	 * 
	 *	// Your drawing actions here...
	 *
	 * 	requestAnimationFrame(loop);
	 * }
	 * loop();
	 */
	clearPlayground() {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	/**
	 * Adds a global variable into an global variables array.
	 * @param {String} name - The name of a global variable. 
	 * @param {*} value - The value of a global variable.
	 * @returns {*} The value of a created global variable.
	 */
	setGlobalVariable(name, value) {
		this._globalVariables[name] = value;
		return this._globalVariables[name];
	}

	/**
	 * Gets a value of global variable by name.
	 * @param {String} name - Searched global variable name.
	 * @returns {*} The value of searched global variable.
	 */
	getGlobalVariable(name) {
		return this._globalVariables[name];
	}

	/** 
	 * Get a canvas object.
	 * @readonly
	 * @type {Object}
	 */
	get canvas() { return this._canvas; }

	/** 
	 * Get a context object for drawing object
	 * @readonly
	 * @type {Object}
	 */
	get context() { return this._context; }

	/** 
	 * Get an array of global variables.
	 * @readonly
	 * @type {Object[]}
	 */
	get globalVariables() { return this._globalVariables; }

	/** 
	 * Get a canvas sizes.
	 * @readonly
	 * @type {Number[]}
	 */
	get sizes() { return this._sizes; }

	get appPath() { return this._appPath; }

	get keyboard() { return this._keyboard; }

	get audioManager() { return this._audioManager; }

	static get Keyboard() { return Keyboard; }

	static get AudioManager() { return AudioManager; }

	static get Loaders() { return Loaders; }

	static get World() { return World; }

	/**
	 * Set new canvas sizes.
	 * @param {Number[]} newSizesValue - New canvas sizes. First value - width, second - height.
	 */
	set sizes(newSizesValue) {
		this._sizes = newSizesValue;
		this._canvas.width = this._sizes[0];
		this._canvas.height = this._sizes[1];
	}
}

export default RPGinia;
