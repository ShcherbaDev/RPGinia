# RPGinia change log

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
