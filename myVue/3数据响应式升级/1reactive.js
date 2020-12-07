// 通过get set方法就形成了闭包，可以有效的将值保存在内存中
function defineReactive(obj , key ,val){
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
// 不对外暴露defineReactive
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
// 不能处理嵌套
obj.obj.a
obj.obj.a=666
