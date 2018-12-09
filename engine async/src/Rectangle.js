export default class Rectangle {
    constructor(coords, world, currentElementIndex) {
        this._appPath = window.location.href;
        this._coords = [coords[0], coords[1]];
        this._sizes = [coords[2], coords[3]];
        this._world = world;
        this._currentElement = this._world._levels[this._world._currentLevelId].content.elements[currentElementIndex];
        this._image = {
            image: new Image(),
            isLoaded: false
        };
        // console.log(this._world._levels[this._world._currentLevelId]);
        if(this._world._levels[this._world._currentLevelId].isLoaded && this._currentElement.type === "sprite")
            this._init(currentElementIndex);
    }

    _init(currentElementIndex) {
        this._image.image.onload = () => {
            this._image.isLoaded = true;
            return this._image;
        }
        console.log(currentElementIndex, this._currentElement, this._world._levels[this._world._currentLevelId].content.elements);
        this._image.image.src = this._appPath + this._world._spriteSheet.content[this._currentElement.spriteSheetIndex].file;
    }

    get imageData() {
        return this._image;
    }
}