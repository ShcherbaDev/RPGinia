import App from "./App.js";

/**
 * Main engine class.
 * @class
 */
class RPGinia {
	/** @constructor */
	constructor() {
		/** 
		 * Defines an app path.
		 * @private 
		 */
		this._appPath = window.location.href;

		/**
		 * Class with main engine functional.
		 * @name App
		 * @memberof RPGinia
		 */
		this.__proto__.App = App;
	}
}

export default RPGinia;