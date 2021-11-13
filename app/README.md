# 关于工程化[vue-cli](https://cli.vuejs.org/zh/guide/)
详细介绍可以去看官方文档，下面是一些项目常见操作  

## 处理资源路径
当在js、css或.vue文件中使用相对路径引用一个静态资源的时候(必须以``.``开头)，该资源会被webpack处理  

### 转换规则
- 如果url使用了绝对路径，它将会被保留不变
  - 也就是回到服务器的对应的静态资源文件目录下去找，对应的就是项目目录种的public
- 如果url是以``.``开头，会作为一个相对的模块请求被解析，基于文件系统的相对路径去找资源
- 如果以``~``开头会作为一个模块请求被解析。这种写法在Node模块中的资源都可以引用
- 如果以``@``开头会作为一个模块请求被解析。Vue Cli默认会设置一个只想``src``的别名@

### 何时使用 public 文件夹
- 通过 webpack 的处理并获得如下好处：
  - 脚本和样式表会被压缩打包在一起，从而减少网络请求
  - 文件丢失会直接报错，而不是到了用户端才产生404
  - 最终生成的文件包含了内容哈希，可以减少浏览器缓存接版本问题
- 如下情况考虑使用public文件夹
  - 有很多图片，需要动态的引用他们的路径
  - 有些库可能不兼容webpack
  - 需要在构建输出时制定一个固定的文件名
- 使用public文件夹的注意事项
  - 如果你的应用没有部署在域名的根部，那么你需要为你的 URL 配置 publicPath 前缀
  ```
  // vue.config.js 
  module.exports = { 
      publicPath: process.env.NODE_ENV === 'production' ? '/cart/' : '/' 
  }
  ```
  - 在 public/index.html 等通过 html-webpack-plugin 用作模板的 HTML 文件中，你需要通过<%= BASE_URL %> 设置链接前缀：
  ```<link rel="icon" href="<%= BASE_URL %>favicon.ico">```
  - 在模板中，先向组件传入BASE_URL：
  ```
  data () { 
      return { 
          publicPath: process.env.BASE_URL 
      } 
  }
  //模板中使用
  <img :src="`${publicPath}my-image.png`">
  ```

## CSS相关

### 使用预处理器
```
# Sass 
npm install -D sass-loader node-sass 
# Less 
npm install -D less-loader less 
# Stylus 
npm install -D stylus-loader stylus
```
然后将style的lang属性设置成对应的预处理器

### 自动化导入样式
自动化导入样式文件 (用于颜色、变量、mixin等)
``npm i -D style-resources-loader``
配置
```
const path = require('path') 
function addStyleResource(rule) { 
    rule.use('style-resource') 
        .loader('style-resources-loader') 
        .options({ patterns: 
            [ 
                //需要自动导入的文件路径
                path.resolve(__dirname, './src/styles/imports.scss'), 
            ], 
        })
}
module.exports = { 
    chainWebpack: config => { 
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'] 
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type))) 
    }, 
}
```
### Scoped CSS
当 <style> 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素。``<style scoped>``  
原理通过使用 PostCSS 来实现以下转换:
```
<template> 
    <div class="red" data-v-f3f3eg9>hi</div> 
</template> 
<style> 
    .red[data-v-f3f3eg9] { color: red; }
</style>
```
父组件使用了scoped属性，其直接子组件上面也会生成哈希属性，因此也是可以控制子组件的样式的   
使用 >>> 操作符可以使 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件的子组件  
但是预处理器无法正确解析>>>,这种情况下可以使用 ``/deep/`` 或 ``::v-deep`` 操作符取而代之  
在修改一些第三方代码时比较方便

### CSS Module
CSS Modules 是一个流行的，用于模块化和组合 CSS 的系统。 vue-loader 提供了与 CSS Modules 的一流集成，可以作为模拟 scoped CSS 的替代方案。
```
<style module lang="scss"> 
    .red { color: #f00; }
    .bold { font-weight: bold; }
</style>
```
模板中通过$style.xx访问
```
<a :class="$style.red">awesome-vue</a> 
<a :class="{[$style.red]:isRed}">awesome-vue</a> 
<a :class="[$style.red, $style.bold]">awesome-vue</a>
```  
JS中访问
```
<script> 
    export default { 
        created () { 
            // -> "red_1VyoJ-uZ" 
            // 一个基于文件名和类名生成的标识符 
            console.log(this.$style.red) 
        } 
    }
</script>
```
调试的时候我们可以发现这种方式添加的类名是很有规律的，在大型项目中使用起来可以方便我们定位元素来自哪里

## 数据Mock和请求代理
- 数据模拟
  - 使用开发服务器配置before[选项](https://cli.vuejs.org/zh/config/#devserver)，可以编写接口，提供模拟数据。
    - 
    ```
    devServer:{ 
        before(app) { 
            app.get(
                '/api/list', (req, res) => { 
                    res.json([
                        { name: 'cup', price: 8999 },
                        { name: 'gpu', price: 8999 }
                    ])
                }
            ) 
        } 
    }
    ```
    - 调用
    ```
    import axios from 'axios' 
    export function getList() { return axios.get('/api/list').then(res => res.data) }
    ```
- 代理
  - 设置开发服务器代理选项可以有效避免调用接口时出现的跨域问题。
    - ```devServer: { proxy: 'http://localhost:3000' }```
  - 自定义测试接口
    ```
    // 需要安装express：npm i express   
    const express = require('express') 
    const app = express() 
    app.get('/api/courses', (req, res) => { 
        res.json([{ name: 'cpu', price: 8999 }, { name: 'gpu', price: 8999 }]) 
    })
    app.listen(3000)
    ```

# 路由
vue-router相关示例。具体介绍查看router文件夹下的readme
# 状态管理
vuex相关示例。具体介绍查看store文件夹下的readme

# 组件化
任意的应用界面都可以抽象成为一个组件树。组件化能提高开发效率，方便复用，简化调试步骤，提升项目的可维护性，便于多人协同开发。  
将参照elementUI2的表单组件实现一个表单组。
**组件通信常⽤⽅式**
- **props**  
  ```
    //父传子
    //child 和data同级别
    props: { msg: String }
    //parent
    <child  msg='我是参数' />
  ```
- **vuex**:创建唯⼀的全局数据管理者store，通过它管理数据并通知组件状态变更。
- **$emit/$on**  
  ```
    //子传父
    //child 事件中触发
    this.$emit('funcname',data)
    //parent 
    <child  @funcname='func' />
  ```
- **event bus**
  ```
  // main.js
  Vue.prototype.$bus = new Vue()
  // child1
  this.$bus.$on('foo', handle)
  // child2
  this.$bus.$emit('foo')
  ```
**边界情况**
- **children**:⽗组件可以通过$children访问⼦组件实现⽗⼦通信。
```
// parent
this.$children[0].xx = 'xxx'
```
- **$parent**
```
//兄弟之间
// brother1
this.$parent.$on('foo', handle)
// brother2
this.$parent.$emit('foo')
```
- **$root**：通过共同祖辈搭桥
- **$refs**:获取⼦节点引⽤
- **provide/inject**:能够实现祖先和后代之间传值
```
//注入组件
provide() {
    return {foo: 'foo'} 
}
//其子组件都可以使用
inject: ['foo']
```
- **非props特性**
  - **$attrs**
    - 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件
  - **$listeners**
    - 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
    - 例如在孙子组件内$emit一个事件，通常我们是在父组件中完成对应的操作，因为父组件使用了该组件，但是如果我们想在爷爷组件处理的话就可以用这个属性转到爷爷上去处理

## 插槽
插槽语法是Vue 实现的内容分发 API，⽤于复合组件开发。该技术在通⽤组件库开发中有⼤量应⽤。
- **匿名插槽**
```
// comp hello会显示在slot处
<div> 
    <slot></slot>
</div>
// parent
<comp>hello</comp>
```
- **具名插槽**:将内容分发到⼦组件指定位置
```
// comp
<div> 
    <slot></slot> 
    <slot name="content"></slot>
</div>
// parent
<Comp>
    <!-- 默认插槽⽤default做参数 -->
    <template v-slot:default>具名插槽</template>
    <!-- 具名插槽⽤插槽名做参数 -->
    <template v-slot:content>内容...</template>
</Comp>
```
- **作用域插槽**:分发内容要⽤到⼦组件中的数据，默认的请会使用父组件的数据
```
// comp
<div> 
    <slot :foo="foo"></slot>
</div>
// parent
<Comp>
    <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
    <template v-slot:default="slotProps">
    来⾃⼦组件数据：{{slotProps.foo}}
    </template>
</Comp>
```

## Form 通⽤表单组件，收集数据、校验数据并提交。
- 表单Form
  - 载体输入数据model和校验规则rules
  - 校验validate
- 表单项FormItem
  - 载体包含输入项
  - label标签添加
  - 校验执行者
  - 显示错误信息
- FormInput
  - 双绑
  - 图标
  - 操作触发反馈

## 虚拟滚动列表
### VirtualList 定高
本示例的是最基础的实现方法，原理就是一个最外层的滚动容器**container**，高度为可视区域的高度；里面放一个撑大小的容器**box**，高度为所有列表项的高度和；和这个撑大小的容器还有一个真正显示列表的容器**list**，高度为可视区域的高度；这个列表容器内部为列表项。
- container
  - 
  ```
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  ```
  - 容器还需要监听他的滚动事件scroll
    - 通过滚动了多少距离，计算当前显示列表的第一项显示的哪一项
      - 下取整的方式使用滚动距离除列表项的高度
    - 结束的下标为计算的结果加上可视区域能显示多少项
    - 计算list的偏移量的时候直接使用scroll的滚动量
      - 那样列表区域会一直在中间，看着就没有滚动的效果
      - 我们需要滚动走了一项，再将list容器还原到视图位置
- box
  - 就是撑位置的，滚动条也是因为他
  - 需要设置一下z-index，不要让他挡住了list
- list
  - 需要使用``position: absolute;``
  - 再通过动态计算``translate3d(0,${this.startOffset}px,0)``
  - 使其一直显示在可视区域

在这种实现方式也是有局限性的，如果高度需要是活的那就不行了。  

### VirtualListAutoH 不定高（在上面的基础上实现）
使用预估高度的方式，先行渲染，然后缓存对应的高度。  
在上一个例子的基础上添加缓冲区解决快速滑动白屏的问题

### VLIntersectionObserver 不定高（这里使用[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)，是浏览器原生提供的构造函数,不兼容IE，接受两个参数：callback是可见性变化时的回调函数，option是配置对象（该参数可选））
!todo