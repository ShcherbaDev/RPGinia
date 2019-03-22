# RPGinia change log

## v0.1.3
### Editor changes:
* Fixed bug with throwing an error on object creating.
* Fixed a bug in file choosing, where in the dialog box when clicking on "cancel" app did not respond to clicks.
* Fixed file input text sizes.
* On clicking on not object list - deselecting all objects.
* Editor is not adding objects borders coordinates and their central points anymore when saving.
* If the name of the object does not fit into the block, then three points are put.
* Added text and sprite object types support.
* Added dark theme modals and inputs.
* Added "RPGinia app path" field.
* Added settings modal window.
* Disabled text selection for useless texts.

Documentation for editor is avaiable now! Click [here](https://shcherbadev.github.io/rpginia/docs/index.html) to see! (Ukrainian and russian only)

### Engine changes:
* You can't now change text align.
* Sprite setting `currentFrame` was renamed to `frameIndex`.
* Sprite setting `isRepeat` was renamed to `isRepeating`.
* The default value for sprite setting `interval` was set to 60ms.
* Was added a new sprite setting `isPlaying` for play or stop animation when necessary.
* Was added argument `loadLevelsControllers` for `World` class.
* API documentation was updated.

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
