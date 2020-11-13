import Home from '../../views/Home.vue'
const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },{
      path: '/listpage',
      name: 'ListPage',
      //延迟加载，在被访问的时候才会加载。可以减小初次加载的文件大小 
      component: () => import(/* webpackChunkName: "about" */ '../../views/ListPage.vue')
    },{
      path: '/about',
      name: 'About',
      //延迟加载，在被访问的时候才会加载。可以减小初次加载的文件大小 
      component: () => import(/* webpackChunkName: "about" */ '../../views/About.vue')
    }
]
export default routes