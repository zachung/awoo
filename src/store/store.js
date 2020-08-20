import Vue from 'vue'
import Vuex from 'vuex'
import editor from './editor'
import ui from './ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    editor,
    ui
  }
})

export default store