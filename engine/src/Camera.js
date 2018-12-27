export default class Camera {
    constructor() {
        this._world = null;
        this._rotateDeg = 0;
    }

    move(x, y) {
        for(let i in this._world.currentLevel.data.elements) {
            this._world.currentLevel.data.elements[i].coords[0] += x;
            this._world.currentLevel.data.elements[i].coords[1] += y;
        }
    }

    rotate(deg) {
        this._rotateDeg += deg;

        if(this._rotateDeg < 0)
            this._rotateDeg = 360;

        else if(this._rotateDeg > 360)
            this._rotateDeg = 0;
    }

    set levels(newValue) {
        this._levels = newValue;
    }

    get currentLevelObjects() {
        return this._world.currentLevel.data.elements;
    }

    get degree() { return this._rotateDeg }
}