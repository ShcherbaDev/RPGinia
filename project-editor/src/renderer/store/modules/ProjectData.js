const state = {
    type: '',
    settings: {},
    spriteSheets: [],
    layers: [],
    objects: [],
    selectedObjects: []
}

const getters = {
    projectType: state => state.type,
    projectSettings: state => state.settings,
    projectSpriteSheets: state => state.spriteSheets,
    projectObjects: state => state.objects,
    selectedObjects: state => state.selectedObjects
}

const mutations = {
    clearProjectStore(state) {
        state.type = '';
        state.settings = {};
        state.spriteSheets = [];
        state.layers = [];
        state.objects = [];
        state.selectedObjects = [];
    },

    setUpProjectStore(state, projData) {
        state.type = '';
        state.settings = {};
        state.spriteSheets = [];
        state.layers = [];
        state.objects = [];
        state.selectedObjects = [];

        const projectType = projData.type;
        const projectData = projData.data;

        state.type = projectType;
        state.settings = projectData.settings;

        if(projectType === 'level') {
            if(projectData.spriteSheets)
                state.spriteSheets = projectData.spriteSheets

            for(let i in projectData.elements)
                projectData.elements[i].$id = parseInt(i)+1;
        }
        state.objects = projectType === 'level' ? projectData.elements : [];
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
        state.objects[state.objects.length-1].$id = state.objects.length; 
        state.selectedObjects.push(state.objects[state.objects.length-1].$id);
    },

    deleteObject(state, objectIndex) {
        const objectIndexInSelectedObjectsList = state.selectedObjects.findIndex(item => item === state.objects[objectIndex].$id);

        if(objectIndexInSelectedObjectsList !== -1) 
            state.selectedObjects.splice(objectIndexInSelectedObjectsList, 1);

        state.objects.splice(objectIndex, 1);
    },

    setObjectProperty(state, args) {
        if(args.propertySetting)
            state.objects[state.objects.findIndex(item => item.$id === args.id)].settings[args.property][args.propertySetting] = args.newPropertyValue;
        else
            state.objects[state.objects.findIndex(item => item.$id === args.id)].settings[args.property] = args.newPropertyValue;
    }
}

const actions = {
    clearProjectStore({ commit }) {
        commit('clearProjectStore');
    },

    setUpProjectStore({ commit }, projData) {
        commit('setUpProjectStore', projData);
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

    addObject({ commit }, newObject) {
        commit('addObject', newObject);
    },

    deleteObject({ commit }, objectIndex) {
        commit('deleteObject', objectIndex);
    },

    setObjectProperty({ commit }, args) {
        commit('setObjectProperty', args);
    }
}

export default { state, getters, mutations, actions }
