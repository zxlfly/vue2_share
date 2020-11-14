home--例子的列表页面，以及相关介绍

## 路由组件缓存
**利用keepalive做组件缓存，保留组件状态，提高执行效率**
```
<keep-alive include="about"> 
    <router-view></router-view> 
</keep-alive>
```
**keep-alive**
  - props
    - **include**-字符串或正则表达式。只有名称匹配的组件会被缓存。
    - **exclude**-字符串或正则表达式。任何名称匹配的组件都不会被缓存。
    - **max**-数字。最多可以缓存多少组件实例。
  - 用法
    - <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
    - 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
  