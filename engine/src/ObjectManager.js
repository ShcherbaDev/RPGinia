import Rectangle from './ObjectTypes/Rectangle.js';
import Sprite from './ObjectTypes/Sprite.js';
import Text from './ObjectTypes/Text.js';
import Trigger from './ObjectTypes/Trigger.js';

class ObjectManager {
	constructor(levelClass) {
		this._level = levelClass;
		this._world = this._level._world;

		this._objects = this._defineObjectList();
	}

	_sortObjectsByLayer(objectList = this._objects) {
		return objectList.sort((a, b) => {
			if (a.settings.layer > b.settings.layer) {
				return 1;
			}
			if (a.settings.layer < b.settings.layer) {
				return -1;
			}

			return 0;
		});
	}

	_createObjectFromType(type, settings) {
		if (type === 'rectangle') {
			return new Rectangle(this, settings);
		}
		if (type === 'sprite') {
			return new Sprite(this, settings);
		}
		if (type === 'text') {
			return new Text(this, settings);
		}
		if (type === 'trigger') {
			return new Trigger(this, settings);
		}
		throw new Error('Can\'t add a new object!');
	}

	_setNewObjectByType(settings) {
		const {type} = settings;
		const createdObject = this._createObjectFromType(type, settings);
		return createdObject;
	}

	_defineObjectList() {
		const originalObjectList = this._level._originalObjectList;

		let resArr = [];

		originalObjectList.forEach(item => resArr.push(this._setNewObjectByType(item)));
		resArr = this._sortObjectsByLayer(resArr);

		return resArr;
	}

	sortObjectsByLayer(objectList = this._objects) {
		this._sortObjectsByLayer(objectList);
	}

	getObjectByName(objectName) {
		return this._objects[this._objects.findIndex(item => item.settings.name === objectName)];
	}

	getObjectsFromLayer(layerNumber) {
		const resultArr = [];

		this._objects.forEach((item) => {
			if (item.settings.layer === layerNumber) {
				resultArr.push(item);
			}
		});

		return resultArr;
	}

	addObject(settings) {
		const {type} = settings;
		const createdObject = this._createObjectFromType(type, settings);

		this._objects = this._sortObjectsByLayer();

		return createdObject;
	}

	deleteObject(name) {
		this._objects.splice(this._objects.findIndex(item => item.settings.name === name), 1);
		this._objects = this._sortObjectsByLayer();
		return true;
	}
}

export default ObjectManager;
