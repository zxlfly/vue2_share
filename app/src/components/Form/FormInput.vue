<template>
    <div>
        <!-- 实现组件的双绑v-model 就是实现:value 和@input事件 -->
        <!-- v-bind="$attrs" 处理的是非props里面的属性（class style除外） 进行绑定 但是最外面的根元素（div）也会绑定 可以设置inheritAttrs为false解决-->
        <!-- 如果有业务有逻辑的属性 最好不要放到这里面 -->
        <input 
            v-bind="$attrs" 
            :type="type" 
            :value="value" 
            @input="onInput" 
        />
    </div>
</template>

<script>
    export default {
        inheritAttrs:false,
        props: {
            value: {
                type: String,
                default: ''
            },
            type:{
                type:String,
                default:'text'
            }
        },
        name:'FormInput',
        methods: {
            onInput(e) {
                // 事件监听派发要是同一个对象，所以考虑组件可能多次嵌套的问题这里不能直接使用$emit或者$parent进行派发
                // 可以使用向上广播的方式
                this.$emit('input',e.target.value)
                // $parent指FormItem
                this.$parent.$emit('validate');
            }
        },
    }
</script>

<style scoped>

</style>