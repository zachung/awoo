const editor = {
  namespaced: true,
  state: {
    isChatKeying: false,
    isControlShow: false
  },
  getters: {
    isChatKeying (state) {
      return state.isChatKeying
    },
    isControlShow (state) {
      return state.isControlShow
    }
  },
  actions: {
    setChatKeying ({ commit }, isKeying) {
      commit('setChatKeying', isKeying)
    },
    setControlShow ({ commit }, isShow) {
      commit('setControlShow', isShow)
    }
  },
  mutations: {
    setChatKeying (state, isKeying) {
      state.isChatKeying = isKeying
    },
    setControlShow (state, isShow) {
      state.isControlShow = isShow
    }
  }
}

export default editor
