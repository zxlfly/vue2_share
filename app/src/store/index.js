import Vue from 'vue'
import Vuex from 'vuex'
import Count1 from './modules/count1'
import Count2 from './modules/count2'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Count1,
    Count2
  }
})
