import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './myVuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0
  },
  mutations: {
    add(state){
      state.count++
    }
  },
  actions: {
    asyncAdd({commit}){
      setTimeout(()=>{
        commit('add')
      },1000)
    }
  },
  getters:{
    doubleCount(state){
      return state.count*2
    }
  },
  modules: {

  }
})
