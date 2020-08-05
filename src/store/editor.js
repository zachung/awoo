const editor = {
  namespaced: true,
  state: {
    enable: false,
    selectedId: undefined,
    selectedType: undefined
  },
  getters: {
    isEnable (state) {
      return state.enable
    },
    selectedId (state) {
      return state.selectedId
    },
    selectedType (state) {
      return state.selectedType
    },
  },
  actions: {
    setEnable ({ commit }, enable) {
      commit('setEnable', enable)
    },
    setChoiceSymbol ({ commit }, data) {
      commit('setSymbol', data)
    }
  },
  mutations: {
    setEnable (state, enable) {
      state.enable = enable
    },
    setSymbol (state, data) {
      let { id, type } = data
      if (state.selectedId === id && state.selectedType === type) {
        // cancel choice
        id = undefined
        type = undefined
      }
      state.selectedId = id
      state.selectedType = type
    }
  }
}

export default editor