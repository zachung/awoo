const editor = {
  namespaced: true,
  state: {
    isChatKeying: false,
    isControlShow: false,
    isDashboardShow: false
  },
  getters: {
    isChatKeying (state) {
      return state.isChatKeying
    },
    isControlShow (state) {
      return state.isControlShow
    },
    isDashboardShow (state) {
      return state.isDashboardShow
    }
  },
  actions: {
    setChatKeying ({ commit }, isKeying) {
      commit('setChatKeying', isKeying)
    },
    setControlShow ({ commit }, isShow) {
      commit('setControlShow', isShow)
    },
    setDashboardShow ({ commit }, isShow) {
      commit('setDashboardShow', isShow)
    }
  },
  mutations: {
    setChatKeying (state, isKeying) {
      state.isChatKeying = isKeying
    },
    setControlShow (state, isShow) {
      state.isControlShow = isShow
    },
    setDashboardShow (state, isShow) {
      state.isDashboardShow = isShow
    }
  }
}

export default editor
