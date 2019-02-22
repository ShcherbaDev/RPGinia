const state = {
    type: '',
    settings: {},
    layers: [],
    objects: [],
    selectedObjects: []
}

const getters = {
    projectType: state => state.type,
    projectSettings: state => state.settings,
    projectObjects: state => state.objects,
    selectedObjects: state => state.selectedObjects
}

const mutations = {
    setUpProjectStore(state, projData) {
        const projectType = projData.type;
        const projectData = projData.data;

        state.type = projectType;
        state.settings = projectData.settings;

        if(projectType === 'level') {
            for(let i in projectData.elements) {
                projectData.elements[i].$id = parseInt(i)+1;
            }
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

    setObjectProperty(state, args) {
        if(args.propertySetting)
            state.objects[state.objects.findIndex(item => item.settings.$id === args.id)].settings[args.property][args.propertySetting] = args.newPropertyValue;
        else
            state.objects[state.objects.findIndex(item => item.settings.$id === args.id)].settings[args.property] = args.newPropertyValue;
    }
}

const actions = {
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

    setObjectProperty({ commit }, args) {
        commit('setObjectProperty', args);
    }
}

export default { state, getters, mutations, actions }
