function defineReactive(obj , key ,val){
    // 解决对象嵌套的问题，嵌套在里层的属性不会被代理
    // 递归遍历
    observe(val)
    Object.defineProperty(obj,key,{
        get(){
            console.log(`get ${key}`);
            return val
        },
        set(newVal){
            if(newVal!=val){
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
function observe(obj){
    if(typeof obj !='object'||obj===null){
        return obj
    }
    Object.keys(obj).forEach((key)=>{
        defineReactive(obj,key,obj[key])
    })
}
observe(obj)
obj.foo
obj.foo=666
obj.bar
obj.bar=666
obj.obj.a
obj.obj.a=666
// 如果重新赋值一个对象，原来的拦截就失效了需要重新处理
obj.obj={
    a:9,
    b:10
}
obj.obj.a
obj.obj.b
