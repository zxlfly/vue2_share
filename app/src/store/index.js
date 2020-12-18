import Vue from 'vue'
import Vuex from 'vuex'
import Count1 from './modules/count1'
import Count2 from './modules/count2'
import user from './plugins/user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Count1,
    Count2
  },
  strict:true,
  // 这里只是实例 没有实际的状态
  // plugins:['user']
})
