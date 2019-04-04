const namespaced = true;

const state = {
    playgroundSizes: [0, 0],
    autoPlaygroundSizesEnabled: false
};

const getters = {
    playgroundSizes: state => state.playgroundSizes,
    autoPlaygroundSizesEnabled: state => state.autoPlaygroundSizesEnabled
};

const mutations = {
    setDataToDefault(state) {
        state.playgroundSizes = [];
        state.autoPlaygroundSizesEnabled = true;
    },

    setUpEditorData(state, editorData) {
        const { sizes, autoSizesEnabled } = editorData.playground;

        state.playgroundSizes = sizes;
        state.autoPlaygroundSizesEnabled = autoSizesEnabled;
    },

    setPlaygroundSizes(state, newSizes) {
        state.playgroundSizes = newSizes;
    },

    setAutoPlaygroundResizing(state, newValue) {
        state.autoPlaygroundSizesEnabled = newValue;
    }
};

const actions = {
    setDataToDefault({ commit }) {
        commit('setDataToDefault');
    },

    setUpEditorData({ commit }, editorData) {
        commit('setUpEditorData', editorData);
    },

    setPlaygroundSizes({ commit }, newSizes) {
        commit('setPlaygroundSizes', newSizes);
    },

    setAutoPlaygroundResizing({ commit }, newValue) {
        commit('setAutoPlaygroundResizing', newValue);
    }
};

export default { namespaced, state, getters, mutations, actions }
