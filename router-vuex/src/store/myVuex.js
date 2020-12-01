// 实现一个Vuex插件
let Vue
// 实现一个Store类
class Store {
    constructor(options){
        this.$options = options

        this._mutations=options.mutations
        this._actions=options.actions
        this._getters=options.getters
        // getters
        this.getters={}
        // 遍历getters配置，动态设置计算属性放到_vm的computed上
        const computed={}
        // 保存store实例
        const store = this
        // 遍历getters将每个getter设置成计算属性放到_vm上
        Object.keys(this._getters).forEach(key=>{
            // 获取用户定义的getter
            const getter = store._getters[key]
            // 转换成computed可以使用的无参数形式
            computed[key]=function(){
                return getter(store.state)
            }
            // 为getters定义只读属性,使用对应的getter的时候从_vm中取
            Object.defineProperty(store.getters,key,{
                get:()=>store._vm[key]
            })
        })
        // 实现响应式的state
        // 不直接暴露state做一层代理，不允许直接修改state
        this._vm = new Vue({
            data() {
                return {
                    $$state: options.state
                }
            },
            computed
        })
        
        // 绑定上下文为store实例 也可以直接使用箭头函数
        this.commit=this.commit.bind(this)
        this.dispatch=this.dispatch.bind(this)
        
    }
    get state(){
        return this._vm._data.$$state
    }
    set state(v){
        throw new Error("please use replaceState to reset state");
    }
    // 实现commit：根据⽤户传⼊type获取并执⾏对应mutation
    commit(type, payload) {
        // 获取对应的mutation方法
        const mutation = this._mutations[type]
        if(!mutation){
            throw new Error(`unknown mutation type: ${type}`);
        }else{
            mutation(this.state,payload) 
        }
    }
    // 实现dispatch：根据⽤户传⼊type获取并执⾏对应action
    dispatch(type,payload){
        // 获取对应的mutation方法
        const action = this._actions[type]
        if(!action){
            throw new Error(`unknown action ${action}`);
        }else{
            action(this,payload)
        }
    }
    
}
function install(_Vue){
    Vue = _Vue
    // 挂载到Vue原型上
    Vue.mixin({
        beforeCreate(){
            if(this.$options.store){
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}
// 因为vuex的使用方式的原因 所以这里导出的是个对象
export default {
    Store,
    install
}