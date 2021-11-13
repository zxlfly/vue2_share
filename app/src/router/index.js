import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
// 解决重复路由点击的时候报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/listpage',
    name: 'ListPage',
    //延迟加载，在被访问的时候才会加载。可以减小初次加载的文件大小 
    component: () => import( '../views/ListPage.vue')
  },{
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  },{
    path: '/fruitlist',
    name: 'fruit',
    component: () => import('../views/Fruit.vue'),
    // 嵌套路由
    children:[
      {
        path: '/fruitlist/detail/:name', 
        component: () => import('../views/Detail.vue')
      }
    ]
  },{
    path:'/routingguard',
    name:'RoutingGuard',
    meta:{
      auth:true
    },
    component:()=>import ('../views/RoutingGuard.vue'),
    // 
    // beforeEnter(to, from, next){ 
    //   console.log(3222);
    //   // to: Route: 即将要进入的目标 路由对象 
    //   // from: Route: 当前导航正要离开的路由 
    //   // next: Function: 一定要调用该方法来 resolve 这个钩子。 
    //   if(to.meta.auth){
    //     if(window.isLogin){
    //       next()
    //     }else{
    //       next('/login?redirect='+to.fullPath)
    //     }
    //   }else{
    //     next()
    //   }
    // }
  },{ 
    path: '/login', 
    component: () => import('../views/login.vue') 
  },{ 
    path: '/add', 
    component: () => import('../views/Add.vue') 
  },{ 
    path: '/vuex', 
    component: () => import('../views/vuex.vue') 
  },{ 
    path: '/virtualList', 
    component: () => import('../views/VirtualList.vue') 
  },{ 
    path: '/virtualListAutoH', 
    component: () => import('../views/VirtualListAutoH.vue') 
  },{ 
    path: '/compopnents', 
    component: () => import('../views/compopnents.vue') 
  },{ 
    // 会匹配所有路径 
    path: '*', 
    component: () => import('../views/404.vue') 
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：
//全局的, 单个路由独享的, 或者组件级的
//全局的写法
/**
 * 进入RoutingGuard页面需要登录状态才行，
 * 没有登录让用户去登陆
 */
// router.beforeEach((to, from, next) => { 
//   // to: Route: 即将要进入的目标 路由对象 
//   // from: Route: 当前导航正要离开的路由 
//   // next: Function: 一定要调用该方法来 resolve 这个钩子。 
//   if(to.meta.auth){
//     if(window.isLogin){
//       next()
//     }else{
//       next('/login?redirect='+to.fullPath)
//     }
//   }else{
//     next()
//   }

// })


// 动态路由
router.beforeEach((to, from, next) => { 
  // to: Route: 即将要进入的目标 路由对象 
  // from: Route: 当前导航正要离开的路由 
  // next: Function: 一定要调用该方法来 resolve 这个钩子。 
      if(to.path=='/dynamicrouting'){
        if(!window.isAdd){
          next('/add?redirect='+to.fullPath)
        }else{
          next()
        }
      }else{
        next()
      }
})
export default router
