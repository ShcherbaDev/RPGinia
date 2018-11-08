import RPGiniaApp from "./RPGiniaApp.js";
export default class testClass extends RPGiniaApp {
	constructor() {
		super(...arguments);
		console.log(this)
	}
}