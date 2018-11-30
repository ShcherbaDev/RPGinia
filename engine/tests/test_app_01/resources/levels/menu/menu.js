function controller(worldClass) {
    console.log(`Current level name: ${this.data.settings.name}\nTyped from the controller file (${worldClass.__proto__.appPath + this.data.settings.controllerPath})`)
}