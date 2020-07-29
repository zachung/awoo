import Vue from 'vue'
import Index from './Index.vue'
import store from './store/store'
import './index.scss'

new Vue({
  el: '#app',
  components: { Index },
  template: '<index/>',
  store
})
