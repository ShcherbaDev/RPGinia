export default class RPGiniaApp {
	constructor(title, canvas, context, sizes = [800, 600], imageSmoothing = false) {
		this._title = title;
		this._canvas = canvas;
		this._context = context;
		this._sizes = sizes;
		this._isImageSmoothing = imageSmoothing;
		this._appPath = window.location.href;
	}
}