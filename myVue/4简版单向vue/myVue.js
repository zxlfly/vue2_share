// 实现思路
// 1. defineReactive时为每⼀个key创建⼀个Dep实例
// 2. 初始化视图时读取某个key，例如name1，创建⼀个watcher1
// 3. 由于触发name1的getter⽅法，便将watcher1添加到name1对应的Dep中
// 4. 当name1更新，setter触发时，便可通过对应Dep通知其管理所有Watcher更新

// 涉及类型介绍
// MyVue：框架构造函数
// Observer：执⾏数据响应化（分辨数据是对象还是数组）
// Compile：编译模板，初始化视图，收集依赖（更新函数、watcher创建）
// Watcher：执⾏更新函数（更新dom）
// Dep：管理多个Watcher，批量更新
function defineReactive(obj , key ,val){
    observe(val)
    Object.defineProperty(obj,key,{
        get(){
            console.log(`get ${key}`);
            return val
        },
        set(newVal){
            if(newVal!=val){
                observe(newVal)
                console.log(`set ${key}`);
                val=newVal
            }
        }
    })
}

function observe(obj){
    if(typeof obj !='object'||obj===null){
        return obj
    }
    new Observe(obj)
}
class Observe{
    constructor(value){
        this.value=value
        if(Array.isArray(value)){

        }else{
            this.walk(value)
        }
    }
    walk(obj) {
        Object.keys(obj).forEach((key)=>{
            defineReactive(obj,key,obj[key])
        })
    }
}
function proxy(vm){
    Object.keys(vm.$data).forEach(key=>{
        Object.defineProperty(vm,key,{
            get (){
                return vm.$data[key]
            },
            set (v){
                vm.$data[key]=v
            }
        })
    })
}
class MyVue{
    constructor(options){
        this.$options=options
        this.$data=options.data
        observe(this.$data)
        proxy(this)
        new Compile(options.el,this)
    }
}
//遍历dom树，找到动态的表达式或者指令等
class Compile{
    constructor(el,vm){
        this.$vm=vm
        this.$el=document.querySelector(el)
        if(this.$el){
            this.compile(this.$el)
        }
    }
    //递归传入节点，根据节点类型不同做不同的操作
    compile(el){
        const childNodes = el.childNodes
        childNodes.forEach(node =>{
            // if(node.nodeType===1){
            //     console.log('元素节点',node.nodeName);
            // }else if(node.nodeType===3){
            //     console.log('文本节点',node.textContent);
            // }
            if(node.nodeType===1){
                this.compileElement(node)
                if(node.childNodes){
                    this.compile(node)
                }
            }else if(this.IsInter(node)){
                this.compileText(node)
            }
            
        })
    }
    IsInter(node){
        return node.nodeType===3&&/\{\{(.*)\}\}/.test(node.textContent)
    }
    compileText(node){
        node.textContent=this.$vm[RegExp.$1]
    }
    compileElement(node){
        let nodeAttrs=node.attributes
        Array.from(nodeAttrs).forEach(attr=>{
            const attrName = attr.name
            const exp = attr.value
            if(attrName.indexOf('v-')===0){
                const dir = attrName.substring(2)
                this[dir]&&this[dir](node,exp)
            }else if(attrName.indexOf('@')===0){
                const dir = attrName.substring(1)
                this[dir]&&this[dir](node,exp)
            }
        })
    }
    text(node,exp){
        node.textContent=this.$vm[exp]
    }
    html(node,exp){
        node.innerHTML=this.$vm[exp]
    }
    click(node,exp){
        node.addEventListener('click',()=>{
            this.$vm.$options.methods[exp].bind(this.$vm)()
            console.log(this.$vm['number']);
        },false)
    }
    model(node,exp){
        node.addEventListener('input',(e)=>{
            this.$vm[exp]=e.target.value
        },false)
        node.value=this.$vm[exp]
    }
}