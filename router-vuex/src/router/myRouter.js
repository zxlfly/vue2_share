// 这里没有实现嵌套路由
/**
 * 嵌套路由router-view需要设置一个标记routerView=true
 *  初始标记当前深度depth为0
 *      向上查找自己的parent
 *          根据routerView判断是否为router-view
 *              是就+1
 *                  冒泡完成后就可以得到当前router-view的深度
 * 
 * 路由匹配时获取代表深度层级的matched数组
 *  current不再需要是响应式的，定义一个新的响应式数据matched数组
 *      定义一个match方法，递归遍历routes
 *          根据current将对应的route添加到matched数组中
 *              route有children的就递归调用
 *                  最终生成一个符合当前路径的路由数组
 * router-view根绝自己的深度从matched数组中取对应的组件进行渲染，如果没有复制null
 * 
 * onHashChange触发时要清空matched数组重新调用match方法生成新的路由数组进行匹配
 */
let Vue
class VueRouter {
    constructor(options) {
        // 保存传入的配置参数
        this.$options = options
        // 设置响应式的current
        const init = window.location.hash.slice(1) || '/'
        // 因为this本身不是响应式的，所以不能直接使用set api
        Vue.util.defineReactive(this,'current',init)
        // 监听hashchange事件
        window.addEventListener('hashchange',this.onHashChange.bind(this))
        window.addEventListener('load',this.onHashChange.bind(this))
        // 缓存path和route映射关系 避免每次current变化的时候都需要遍历
        this.routeMap={}
        this.$options.routes.forEach(route=>{
            this.routeMap[route.path]=route
        })
    }
    onHashChange(){
        this.current = window.location.hash.slice(1)
    }
}
// install方法 注册$router
// 在使用插件的时候，会自动调用这个方法，vue实例作为参数传入
VueRouter.install = function (_Vue) {
    // 保存下Vue实例
    Vue = _Vue
    // 在vue实例根上挂载$router
    // 这里使用mixin是因为use在前，router实例创建在后，而install需要用到Vue实例
    Vue.mixin({
        beforeCreate() {
            // 只有根组件拥有router选项
            // main.js
            // new Vue({
            //     router,
            //     store,
            //     render: h => h(App)
            //   }).$mount('#app')
            if (this.$options.router) {
                // 挂载到根上
                Vue.prototype.$router = this.$options.router
            }
        }
    })
    // 实现两个全局组件
    Vue.component('router-view', {
        render(h) {
            // 动态获取对应的组件
            // let component = null
            // this.$router.$options.routes.forEach(route=>{
            //     if (route.path === this.$router.current) {
            //         component = route.component
            //     }
            // })
            // 使用映射
            const {routeMap,current} = this.$router
            const component = routeMap[current]?routeMap[current].component:null
            return h(component)
        }
    })
    // 就是实现一个a
    Vue.component('router-link', {
        props: {
            to: {
                type:String,
                required: true
            }
        },
        render(h) {
            // return <a href={'#'+this.to}>{this.$slots.default}</a>;
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, [
                this.$slots.default
            ])
        }
    })
}
export default VueRouter