# RPGinia change log

## v0.1.3
### Editor changes:
* Fixed bug with throwing an error on object creating.
* Fixed a bug in file choosing, where in the dialog box when clicking on "cancel" app did not respond to clicks.
* On clicking on not object list - deselecting all objects.
* Editor is not adding objects borders coordinates and their central points when saving.
* In the objects settings you can now make them invisible.
* Added text object type support.

### Engine changes:
* You can't now change text align.
* Sprite setting `currentFrame` was renamed to `frameIndex`.
* Sprite setting `isRepeat` was renamed to `isRepeating`.
* The default value for sprite setting `interval` was set to 60ms.
* Was added a new sprite setting `isPlaying` for play or stop animation when necessary.

## v0.1.2
### Editor changes:
* The packager to `.exe` was changed from `electron-packager` to `electron-builder`.
* Added common functional for creating levels (like savings, creating new and open existing levels, create and delete objects (till only rectangles supported) and copy/paste objects)

### Engine changes:
* `Camera` class have his own coordination system.
* Now you can set up new canvas sizes and get them.
* Methods `getElementByName` and `getElementsFromLayer` from class `World` are now returns a full object, not their settings. 

## v0.1.1
* English text has been added to README.
* Added project editor. It's not ready and was made only a small part of GUI. Not recommended for use.
* Added `tests` directory in directory `engine`

## v0.1.0
* Made first release.
