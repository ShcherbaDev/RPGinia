const state = {
    settings: {},
    spriteSheet: [],
    appPath: '',
    objects: [],
    selectedObjects: []
};

const getters = {
    projectSettings: state => state.settings,
    projectSpriteSheets: state => state.spriteSheet,
    projectAppPath: state => state.appPath,
    projectObjects: state => state.objects,
    selectedObjects: state => state.selectedObjects
};

const mutations = {
    clearProjectStore(state) {
        state.settings = {};
        state.spriteSheet = [];
        state.appPath = '';
        state.objects = [];
        state.selectedObjects = [];
    },

    setUpProjectStore(state, projData) {
        state.settings = {};
        state.spriteSheet = {};
        state.appPath = '';
        state.objects = [];
        state.selectedObjects = [];

        const projectData = projData;

        state.settings = projectData.settings;

        state.appPath = projData.appPath;

        state.spriteSheet = projectData.spriteSheets[projectData.spriteSheets.findIndex(item => item.name === state.settings.spriteSheetName || item.url.indexOf(state.settings.spriteSheetPath.replace(/\\/g, '/')) !== -1)];

        for (let i in projectData.data._objects) {
            projectData.data._objects[i].$id = parseInt(i)+1;
        }

        state.objects = projectData.data._objects;
    },

    setProjectSetting(state, args) {
        state.settings[args.settingName] = args.newValue;
    },

    setProjectAppPath(state, newValue) {
        state.appPath = newValue;
    },

    selectObject(state, id) {
        state.selectedObjects.push(id);
    },

    unselectObject(state, args) {
        state.selectedObjects.splice(args.from, args.to);
    },

    clearSelectedObjects(state) {
        state.selectedObjects = [];
    },

    addObject(state, obj) {
        state.objects[state.objects.findIndex(item => item.settings === obj)].$id = state.objects.length;
    },

    deleteObject(state, objectIndex) {
        const objectIndexInSelectedObjectsList = state.selectedObjects.findIndex(item => item === state.objects[objectIndex].$id);

        if(objectIndexInSelectedObjectsList !== -1) 
            state.selectedObjects.splice(objectIndexInSelectedObjectsList, 1);

        state.objects.splice(objectIndex, 1);
    },

    setObjectProperty(state, args) {
        if (args.propertySetting !== undefined) {
            if (args.propertySettingOption !== undefined) {
                state.objects[state.objects.findIndex(item => item.$id === args.id)].settings[args.property][args.propertySetting][args.propertySettingOption] = args.newPropertyValue;
            } 
            else {
                state.objects[state.objects.findIndex(item => item.$id === args.id)].settings[args.property][args.propertySetting] = args.newPropertyValue;
            }
        }
        else {
            state.objects[state.objects.findIndex(item => item.$id === args.id)].settings[args.property] = args.newPropertyValue;
        }
    }
};

const actions = {
    clearProjectStore({ commit }) {
        commit('clearProjectStore');
    },

    setUpProjectStore({ commit }, projData) {
        commit('setUpProjectStore', projData);
    },

    setProjectSetting({ commit }, args) {
        commit('setProjectSetting', args);
    },

    setProjectAppPath({ commit }, newValue) {
        commit('setProjectAppPath', newValue);
    },

    selectObject({ commit }, id) {
        commit('selectObject', id);
    },

    unselectObject({ commit }, args) {
        commit('unselectObject', args);
    },

    clearSelectedObjects({ commit }) {
        commit('clearSelectedObjects');
    },

    addObject({ commit }, obj) {
        commit('addObject', obj);
    },

    deleteObject({ commit }, objectIndex) {
        commit('deleteObject', objectIndex);
    },

    setObjectProperty({ commit }, args) {
        commit('setObjectProperty', args);
    }
};

export default { state, getters, mutations, actions }
