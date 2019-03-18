const namespaced = true;

const state = {
    playgroundSizes: []
};

const getters = {
    playgroundSizes: state => state.playgroundSizes
};

const mutations = {
    setDataToDefault(state) {
        state.playgroundSizes = [];
    },

    setPlaygroundSizes(state, newSizes) {
        state.playgroundSizes = newSizes;
    } 
};

const actions = {
    setDataToDefault({ commit }) {
        commit('setDataToDefault');
    },

    setPlaygroundSizes({ commit }, newSizes) {
        commit('clearProjectStore', newSizes);
    }
};

export default { namespaced, state, getters, mutations, actions }
