// 到这里一个简版的基于对象的拦截就实现了，但是没有处理数组
//数组响应式，本质就是覆盖了原有的7个变更方法，在这些方法被调用的时候，额外执行通知变更逻辑
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
const obj={
    foo:'foo',
    bar:'bar',
    obj:{
        a:1
    }
}
function set(obj,key,val){
    defineReactive(obj,key,val)
}
function observe(obj){
    if(typeof obj !='object'||obj===null){
        return obj
    }
    Object.keys(obj).forEach((key)=>{
        defineReactive(obj,key,obj[key])
    })
}
observe(obj)
// obj.foo
// obj.foo=666
// obj.bar
// obj.bar=666
// obj.obj.a
// obj.obj.a=666
// obj.obj={
//     a:9
// }
set(obj,'z',8)
obj.z
obj.z=6