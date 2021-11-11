# index.html
一个简单的基本示例
## 计算属性 vs 监听器
  - **监听器更通用**,理论上计算属性能实现的监听器都能实现  
  - 处理数据的场景不同，监听器适合一个数据响应多个数据，计算属性适合一个数据受多个数据影响  
  - **计算属性有缓存性**，计算所得的值如果依赖的数据没有改变不会重复计算  
  - 监听器适合**执行异步操作或较大开销操作**的情况
## 生命周期
每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。  
## 使用生命周期钩子
在Vue实例的生命周期过程中会运行一些叫做生命周期钩子的函数，这给用户在不同阶段添加自己代码
的机会。  
**生命周期三个阶段：初始化、更新、销毁**  
- 初始化：beforeCreate、created、beforeMount、mounted  
- 更新：beforeUpdate、updated  
- 销毁：beforeDestroy、destroyed  

# component.html
组件简单示例
**常用api**
  - 数据相关API
    - Vue.set
      - 向响应式的数据对象中添加属性，使新添加的属性也是响应式的可以触发更新
      - 使用方法： ``Vue.set(目标对象, 对应的key, 对应的value)``
    - Vue.delete
      - 删除对象的属性，如果是响应式的，会触发更新
      - 使用方法： ``Vue.delete(目标对象, 对应的key)``
  - 事件相关API
    - vm.$on
      - 监听当前实例上的自定义事件，由$emit触发。回调函数会接受所传入的参数
      - ``vm.$on('test', function (msg) { console.log(msg) })``
    - vm.$emit
      - 触发当前实例上的事件。附加的参数都会传给监听回调
    - vm.$once
      - 监听一个自定义事件，但是自会触发一次，触发后就会被移除
    - vm.$off
      - 移除自定义事件监听器
        - 如果没有提供参数，将移除所有的监听器
        - 只提供了事件，则移除对应事件的监听器
        - 即提供了事件又提供了回调函数，则移除对应事件有改回调的监听器
  - 组件或元素引用
    - ref和vm.$refs
      - ref可以设置元素或者组件的应用，应用信息将会注册在父组件的$refs上。对DOM元素组件都有效
      - ```<input type="text" ... ref="inp">  mounted(){ // mounted之后才能访问到inp this.$refs.inp.focus() }```
      - ref是作为渲染结果被创建的，在初始渲染的时候不能访问
      - $refs不是响应式的
      - 当ref使用的组件或者元素上使用了v-for，引用信息将是包含所有dom元素或组件信息的数组
  - 事件总线
    - 通过在vue的原型上添加一个vue的实例，通过这个vue的实例进行通信，且不回收其他组件的相互影响
    - ``Vue.prototype.$bus = new Vue();``

# Vue组件化的理解
**定义**：组件是可复用的 Vue 实例，准确讲它们是VueComponent的实例，继承自Vue。  
**优点**：组件化可以增加代码的复用性、可维护性和可测试性。  
**使用场景**：什么时候使用组件？以下分类可作为参考：  
**通用组件**：实现最基本的功能，具有通用性、复用性，例如按钮组件、输入框组件、布局组件等。  
**业务组件**：它们完成具体业务，具有一定的复用性，例如登录组件、轮播图组件。  
**页面组件**：组织应用各部分独立内容，需要时在不同页面组件间切换，例如列表页、详情页组件  
**如何使用组件**  
-定义：Vue.component()，components选项，sfc  
-分类：有状态组件，functional，abstract  
-通信：props，$emit()/$on()，provide/inject，$children/$parent/$root/$attrs/$listeners  
-内容分发：<slot>，<template>，v-slot  
-使用及优化：is，keep-alive，异步组件  
**组件的本质**  
vue中的组件经历如下过程  
组件配置 => VueComponent实例 => render() => Virtual DOM=> DOM  
所以组件的本质是产生虚拟DOM 

# transition.html
简单的动画实例  
在组件示例的基础上，对message组件和list组件增加了动画效果  
**css用法**
- ``.fade-enter { opacity: 0; }``
  - 定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
- ``.fade-enter-active { transition: opacity .5s; }``
  - 定义进入过渡生效时的状态。在元素被插入之前生效，在过渡/动画完成之后移除。
- ``.fade-enter-to { opacity: 1; }``
  - 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 enter 被移除)，在过渡/动画完成之后移除。
- ``.fade-leave { opacity: 1; }``
  - 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
- ``.fade-leave-active { transition: opacity .5s; }``
  - 定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除.这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
- ``.fade-leave-to { opacity: 0; }``
  -  定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 leave 被删除)，在过渡/动画完成之后移除。
**css库用法**
demo中并没有使用css库的例子  
这里以官方推荐的animate.css为例简单说明下用法  
```<transition enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">```
**js用法**
可以在<transition>属性中声明 JavaScript 钩子，使用JS实现动画。  
```
<transition 
  v-on:before-enter="beforeEnter" // 动画开始前，设置初始状态 
  v-on:enter="enter" // 执行动画 
  v-on:after-enter="afterEnter" // 动画结束，清理工作 
  v-on:enter-cancelled="enterCancelled" // 取消动画 
  v-on:before-leave="beforeLeave" 
  v-on:leave="leave" 
  v-on:after-leave="afterLeave" 
  v-on:leave-cancelled="leaveCancelled" 
>
</transition>
...
methods: { 
  beforeEnter(el) { 
    el.style.opacity = 0 // 设置初始状态 
  },
  enter(el, done) { 
    document.body.offsetHeight; // 触发回流激活动画 
    el.style.opacity = 1 // 设置结束状态 
  } 
},
```
**列表过度**
利用transition-group可以对v-for渲染的每个元素应用过度 

# 可复用性 & 组合
**过滤器filter**  
  - Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式
  - 过滤器是函数可以接受参数
  - 过滤器可以串联使用
  - 全局的和局部的重名，局部的覆盖全局的
  - 分为全局和组件内
    - 全局用法
      - 
      ```
      Vue.filter('capitalize', function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      })
      ```  
    - 组件内
      - 
      ```
      filters: {
        capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      }
    ```
**自定义指令directive**
  - 除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。
  - 钩子函数
    - **bind**只调用一次，指令第一次绑定到元素时调用。在这里可以进行初始化设置
    - **inserted**被绑定元素插入到父节点时调用，此时父节点存在但不一定已经插入到了dom中
    - **update**所在组件的VNode更新时调用，但是子组件VNode不一定更新了。指令的值可能发生改变也可能没有，可以通过比较更新前的值来忽略不必要的模板更新
    - **componentUpdated**指令所在的组件的VNode以及其子组件的Vnode都更新之后调用
    - **unbind**指令与元素解绑的时候调用一次
  - 钩子函数参数
    - **el**指令绑定的元素，可以用来dom操作
    - **binding**一个对象
      - *name*：指令名
      - *value*：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2
      - *oldValue*：指令绑定的前一个的值，仅在update和componentUpdated中可用
      - *expression*：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"
      - *arg*：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"
      - *modifiers*：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
      - *vnode*：Vue编译时生成的虚拟节点
      - *oldVnode*：上一个虚拟节点，仅在update和componentUpdated中可用
    - **el**指令绑定的元素，可以用来dom操作
  - 分为全局和组件内
    - 全局用法
      - ```
      - // 注册一个全局自定义指令 `v-focus`
      Vue.directive('focus', {
        // 当被绑定的元素插入到 DOM 中时
        inserted: function (el) {
        // 聚焦元素
        el.focus()
      }
      })
      ```  
    - 组件内
      - ```
      directives: {
        focus: {
          // 指令的定义
          inserted: function (el) {
            el.focus()
          }
        }
      }
    ```
**函数渲染**
在实际的项目开发中大多数情况下用不到，写起来相对于模板的形式来书复杂  
当模板代码冗长时，可以考虑使用函数渲染，利用js的能力编译能力减少代码量  
将组件的templateg改用render函数实现
```
render: function (createElement) {
    return createElement(
      ...
    )
  }
```
平时我们看到的h函数就是createElement,h函数返回的就是大名鼎鼎的虚拟dom  
虚拟dom就是一个原生的js对象，用来描述dom结构属性的（后面源码部分在做展开）  
h函数相关的参数用法可以查看vue2的官网，此次分享不会详细介绍函数渲染  
由于函数渲染的特性，我们还可以使用jsx，函数式组件（和react类似，在react的分享中会详细介绍）
**函数式组件**：组件没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法时，可以将组件标记为
functional ，这意味它无状态 (没有响应式数据)，也没有实例 (没有 this 上下文)。  

# 混入mixin
提供了一种很灵活的方式来分发可复用的功能。  
一个混入对象可以包含任意组件对象。
当组件使用混入对象时，所有混入对象的选项都将被“混入”到该组件本身的选项  
```
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```
# 插件
插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：
1. 添加全局方法或者property
2. 添加全局资源：指令、过滤器等。如vue-touch
3. 通过全局混入一些组件选项
4. 添加Vue实例方法，通过把它们添加到Vue.property上实现
5. 一个库，提供自己的api，同时提供上面的一个或多个功能
**插件开发**
Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：
```
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```
**使用插件**
使用Vue.use即可引入插件,需要在你调用 new Vue()之前
``Vue.use(MyPlugin)``
Vue.use 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。  
Vue.js 官方提供的一些插件 (例如 vue-router) 在检测到 Vue 是可访问的全局变量时会自动调用 Vue.use()。
```
const MyPlugin = { 
  install (Vue, options) { 
    Vue.component('heading', {...})
  }
}
if (typeof window !== 'undefined' && window.Vue) { 
  window.Vue.use(MyPlugin) 
}
```
然而在像 CommonJS 这样的模块环境中，你应该始终显式地调用 Vue.use()：  
```
// 用 Browserify 或 webpack 提供的 CommonJS 模块环境时
var Vue = require('vue')
var VueRouter = require('vue-router')

// 不要忘了调用此方法
Vue.use(VueRouter)
```


## MVVM  
三要素：响应式、模板引擎和渲染  
响应式：Vue如何监听数据变化？  
模板：Vue的模板如何编译和解析？  
渲染：Vue如何将模板转化成html？  