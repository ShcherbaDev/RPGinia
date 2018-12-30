/**
 * Keyboard event handler class 
 * @memberof RPGinia.App
 * @class
 */
class Keyboard {
	/**
	 * @constructor
	 * @param {Boolean} [debugModeEnable=false] - Debug mode for key press notifications.
	 */
	constructor(debugModeEnable = false) {
		/**
		 * @private
		 */
		this._keys = [];

		/**
		 * @private
		 */
		this._keyState = [];

		/**
		 * @private
		 */
		this._pressActions = [];

		/**
		 * @private
		 */
		this._debugEnable = debugModeEnable;

		this._init();
	}

	_init() {
		window.onkeydown = e => {
			for(let i in this._keys) {
				if(this._keys[i].keyCode === e.keyCode) {
					this._keys[i].isActive = true;

					if(this._keys[i].action !== null)
						return this._keys[i].action(e);
				}
				else continue;
			}

			if(this._debugEnable)
				console.log(e);
		}

		window.onkeyup = e => {
			for(let i in this._keys) {
				if(this._keys[i].keyCode === e.keyName)
					this._keys[i].isActive = false;
			}
		}
	}

	addKey(key, keyCode) { 
		this._keys.push({
			keyName: key,
			keyCode: keyCode,
			action: null,
			isActive: false
		});
	}

	pressEvent(callback, key) {
		this._keys[this._keys.findIndex(item => item.keyName === key)].action = callback;
	}

	isPressed(key) { return !!this._keys[this._keys.findIndex(item => item.keyName === key)].isActive }

	get keys() { return this._keys }
}

export default Keyboard;