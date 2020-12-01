# vue-router源码实现
- 作为一个插件存在：实现VueRouter类个install方法
- 实现两个全局组件：router-view，router-link
- 监控url变化：监听hashchange或popstate事件
- 响应最新的url，切换页面：创建一个响应式的属性current记录当前的url，当它改变时获取对应的组件并显示

# Vuex源码实现
- 实现一个插件：声明store类，挂载$store
- 实现commit根据用户传入的type执行对应的mutation
- 实现dispatch根据用户传入type执行对应的action，同时传递上下文
- 实现getters，按照getters定义对state做派生
