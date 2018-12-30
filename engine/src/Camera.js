/**
 * Class for move or rotate camera.
 * @memberof RPGinia.App
 * @class
 */
class Camera {
    /**
     * @hideconstructor
     */
    constructor() {
        /**
         * Link to the World class for getting elements from it.
         * @private
         */
        this._world = null;

        /**
         * Camera rotate degree. Value can be from 0 to 360. If value is less than 0, it will become to 360. If value is greater than 360, it will become to 0.
         * @private
         */
        this._rotateDeg = 0;
    }

    /**
     * Move camera.
     * @param {Number} x - X axis.
     * @param {Number} y - Y axis.
     */
    move(x, y) {
        const levelElements = this._world.currentLevel.data.elements;
        for(let i in levelElements) {
            levelElements[i].coords[0] += x;
            levelElements[i].coords[1] += y;
        }
    }
    
    /**
     * Rotate camera.
     * @param {Number} deg - Value of how much the degree will increase.
     */
    rotate(deg) {
        this._rotateDeg += deg;

        if(this._rotateDeg < 0)
            this._rotateDeg = 360;

        else if(this._rotateDeg > 360)
            this._rotateDeg = 0;
    }

    /** 
	 * Get a camera rotation degree.
	 * @readonly
	 * @type {Number}
	 */
    get degree() { return this._rotateDeg }
}

export default Camera;