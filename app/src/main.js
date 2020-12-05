import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import create from './untils/create'
Vue.config.productionTip = false
Vue.prototype.$create = create
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
