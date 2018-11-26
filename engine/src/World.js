export default class World {
	constructor(levels) {
		this._levelList = levels;
	}

	get levelList() {
		return this._levelList;
	}
}