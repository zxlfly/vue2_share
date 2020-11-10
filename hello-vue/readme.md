# index.html
一个简单的基本示例
## 计算属性 vs 监听器
  -**监听器更通用**,理论上计算属性能实现的监听器都能实现  
  -处理数据的场景不同，监听器适合一个数据响应多个数据，计算属性适合一个数据受多个数据影响  
  -**计算属性有缓存性**，计算所得的值如果依赖的数据没有改变不会重复计算  
  -监听器适合**执行异步操作或较大开销操作**的情况
## 生命周期
每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。  
## 使用生命周期钩子
在Vue实例的生命周期过程中会运行一些叫做生命周期钩子的函数，这给用户在不同阶段添加自己代码
的机会。  
**生命周期三个阶段：初始化、更新、销毁**  
-初始化：beforeCreate、created、beforeMount、mounted  
-更新：beforeUpdate、updated  
-销毁：beforeDestroy、destroyed  

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
    - 通过在vue的原型上添加一个vue的实例，通过这个vue的实例进行通信，切不回收其他组件的相互影响
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
## MVVM  
三要素：响应式、模板引擎和渲染  
响应式：Vue如何监听数据变化？  
模板：Vue的模板如何编译和解析？  
渲染：Vue如何将模板转化成html？  