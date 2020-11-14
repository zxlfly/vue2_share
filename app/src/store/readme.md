# vuex
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以可预测的方式发生变化。  

## 基础介绍：
- **State**将应用的全局状态定义在这
- **Mutation**修改state只能通过Mutation
- **Action**类似于Mutation，修改state（本质上修改state还是调用的Mutation）
  - action提交的是Mutation，而不是直接变更state
  - action可以包含任意异步操作
- **Getter**可以使用getters从store的state中派生一些状态（类似vue组件的计算属性）
  
**mapState()/mapMutation()/mapAction()/mapGetters()**
这些方法在我们使用vuex 的时候可以简化我们的操作，可以直接映射，避免直接访问$store
- mapState
- mapGetters
- mapMutation
- mapAction

## 关于模块化
在中大型项目中，使用单一的状态树，应用的所有状态都集中到一个比较大的对象中。当应用变得非常复杂的时候，store对象就有可能变得很臃肿。  
此时可以利用vuex中的modules来实现模块化，将store进行分割，每个分割的模块中都有自己的State、Mutation、Action、Getter  
分割后的每个模块最好设置namespace为true，使每个模块拥有自己的命名空间。这样封装度和复用性更好

## 严格模式
严格模式下，无论什么时候发生state改变，如果不是通过的mutation引起的，就会抛出错误。**建议开启**
```
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
开了严格模式表单的双向绑定v-model就会受到影响（值设置的store里面的state），需要处理下，可以手动实现双向绑定

## 插件
vuex的store接受plugins选项，这个选项暴露出每次 mutation 的钩子。vuex插件就是一个函数，它接受store最为唯一参数
```
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}
...
const store = new Vuex.Store({
    // ...
    plugins: [myPlugin]
})
```
可以用来初始化store，状态持久化等操作