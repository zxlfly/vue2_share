import Vue from 'vue'
function create(Component, props) {
    // 传递一个组件配置，返回一个组件实例，并且挂载到body上
    // 方法一：Vue.extend(Component)
    // 得到组件的构造函数
    const Ctor= Vue.extend(Component)
    // propsData props被占用为定义属性，传值的话就换成了propsData来实现
    const comp = new Ctor({'propsData':props})
    comp.$mount()
    document.body.appendChild(comp.$el)
    comp.remove = () => {
        document.body.removeChild(comp.$el)
        comp.$destroy()
    }
    // 方法二：new Vuew()
    // const vm = new Vue({
    //     render: (h) => h(Component, { props }),
    // }).$mount();
    // // dom追加  mount会替换掉原来的dom
    // document.body.appendChild(vm.$el)
    // // 获取组件实例
    // // 因为是根实例 所有第一个就是的
    // const comp = vm.$children[0]
    // // 销毁的方法
    // comp.remove = () => {
    //     document.body.removeChild(vm.$el)
    //     vm.$destroy()
    // }
    return comp
}
export default create