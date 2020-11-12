import Vue from 'vue'
import VueRouter from 'vue-router'

import defaultRouters from './routers/default'
Vue.use(VueRouter)

const routes = defaultRouters

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
