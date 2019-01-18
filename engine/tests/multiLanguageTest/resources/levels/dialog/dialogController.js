function controller(api) {
    let replics = api.app.getGlobalVariable("selectedLanguage") ? 
                api.app.getGlobalVariable("selectedLanguage").data.replics :
                api.loaders.jsonFile('language', '/resources/languages/english.json').data.replics; // If global variable "selectedLanguage" is undefined

    const textMessage = api.world.getElementByName('testText');
    textMessage.settings.text = replics['test_multilanguage_text'];

    const selectedLanguage = api.world.getElementByName('selectedLanguage');
    selectedLanguage.settings.text = replics['selected_language'];
}