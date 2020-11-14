# vuex
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以可预测的方式发生变化。  

## 基础介绍：
- **State**将应用的全局状态定义在这
- **Mutation**修改state只能通过Mutation
- **Action**类似于Mutation，修改state（本质上修改state还是调用的Mutation）
  - action提交的是Mutation，而不是直接变更state
  - action可以包含任意异步操作
- **Getter**可以使用getters从store的state中派生一些状态（类似vue组件的计算属性）
  
**mapState()/mapMutations()/mapActions()/mapGetters()**
这些方法在我们使用vuex 的时候可以简化我们的操作，可以直接映射，避免直接访问$store
- **mapState**在computed中使用
``
mapState(namespace?: string, map: Array<string> | Object<string | function>): Object
``
  - 为组件创建计算属性以返回 Vuex store 中的状态
  - 第一个参数可选，是一个命名空间
  - 第二个参数如果是数组，数组项为对应state的key值（string类型）
    - 一般我们映射计算属性的名称会与state的节点名称相同，所有我们可以直接传一个字符串数组,再利用对象展开运算符
    - ```
        computed: {
            ...mapState('user', ['isLogin'])
        }
    ```
  - 第二个参数如果是对象
    - 可以使用箭头函数返回
    - 可以设置别名
    - 可以是一个函数返回一个处理过后的值
    - ```
     computed: mapState({
        // 箭头函数可使代码更简练
        count: state => state.count,

        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',

        // 为了能够使用 `this` 获取局部状态，必须使用常规函数
        countPlusLocalState (state) {
            return state.count + this.localCount
        }
    })
    ```
  
- **mapGetters**在computed中使用，基本同mapState一样使用方式，区别在于第二个参数不能是函数
- **mapMutations**在methods中使用，其余使用方法同mapState
- **mapActions**在methods中使用，其余使用方法同mapState

## 关于模块化
在中大型项目中，使用单一的状态树，应用的所有状态都集中到一个比较大的对象中。当应用变得非常复杂的时候，store对象就有可能变得很臃肿。  
此时可以利用vuex中的modules来实现模块化，将store进行分割，每个分割的模块中都有自己的State、Mutation、Action、Getter  
```
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
分割后的每个模块最好设置namespace为true，使每个模块拥有自己的命名空间。这样封装度和复用性更好
```
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```
就像上面的例子，如果要在带命名空间的模块内访问全局内容。  
全局的**state和getter**分别对应的**rootState和rootGetters** 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。  
如果我们需要在子模块中调用全局的 action 或 mutation，则需要将``{root: true}``作为第三参数传给``dispatch``或``commit``即可
```
modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```
如果需要在带命名空间的模块内注册全局action，一样添加``root: true``，并将这个action的定义放在函数的handler中
```
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```
当使用 mapState, mapGetters, mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时,如果出现了重名的情况，除了修改名称外，也可以不使用上面介绍的方法
```
computed: {
    ...mapState('user', ['isLogin'])
}
```
直接将模块的空间名称直接和字符串拼接在一起使用
```
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```
**createNamespacedHelpers**这个api可以简化最上面的用法
```
computed: {
    ...mapState('user', ['isLogin'])
}
//通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```
在插件中可能需要考虑模块的空间名问题。这种情况可以通过插件的参数对象来允许用户指定命名空间
```
// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
  return function (store) {
    // 把空间名字添加到插件模块的类型（type）中去
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```
### 模块动态注册
在store创建之后，可以使用``store.registerModule``方法注册模块
```
import Vuex from 'vuex'

const store = new Vuex.Store({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```
之后可以通过``store.state.myModule``和``store.state.nested.myModule``访问。可以通过``store.hasModule(moduleName)``来检查是否注册成功  
动态创建的模块可以使用``store.unregisterModule(moduleName)``来卸载  
### 模块重用
有时我们可能需要创建一个模块的多个实例，如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。这个问题和vue的data是同样的问题。解决方法也一样(使用函数的形式)
```
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutation, action 和 getter 等等...
}
```
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