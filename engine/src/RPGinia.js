import App from "./App.js";

export default class RPGinia {
	constructor() {
		this._appPath = window.location.href;

		App.prototype.appPath = this._appPath;
		this._app = App;
	}

	get app() {
		return this._app;
	}

	get compositor() {
		return this._comp;
	}

	get load() {
		return this._load;
	}
}