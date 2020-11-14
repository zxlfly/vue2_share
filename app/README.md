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
    - ```
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
