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
obj.obj={
    a:9
}
obj.z=6
obj.z
obj.z=6