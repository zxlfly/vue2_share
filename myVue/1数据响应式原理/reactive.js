// 数据变更能够响应在视图中，就是数据响应式。
// vue2中利⽤ Object.defineProperty() 实现变更检测。

//定义defineReactive
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
const obj={}
defineReactive(obj,'foo','6666')
obj.foo
obj.foo=888