<template>
    <div>
        <form>
            <slot></slot>
        </form>
    </div>
</template>

<script>
import emitter from '../../mixins/emitter'
export default {
    componentName: "Form",
    mixins:[emitter],
    name: "Form",
    provide() {
        return {
            // 将表单的实例传递下去，方便子组件获取
            form: this,
        };
    },
    props: {
        // model放在form组件中方便集中式管理表单数据
        model: {
            type: Object,
            required: true,
        },
        rules: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            formItemList: []
        }
    },
    created () {
        this.$on('formItemAdd',(parmes)=>{
            this.formItemList.push(parmes)
        })
    },
    methods: {
        validate(cb) {
            // 调用所有含有prop属性表单项的validate方法并得到promise数组
            // this.$children只能查找子组件 如果存在嵌套就会存在问题
            // const tasks = this.$children
            //     .filter((item) => item.prop)
            //     .map((item) => item.validate());
            // // 所有通过才算成功
            // Promise.all(tasks)
            //     .then(() => cb(true))
            //     .catch(() => cb(false));
            // 广播的方式是自上而下的递归，这种解决方法不太好，这里使用主动收集的方式实现
            // 子表单项挂在的时候把对应的实例对象添加到表单组件的formItemList数组中，需要触发表单验证的时候可以直接使用收集的实例触发
            // form需要监听添加事件。表单项使用dispatch触发
            if(this.formItemList.length===0&&cb){
                return cb(true)
            }
            const tasks = this.formItemList.map((item) => item.validate());
            // 所有通过才算成功
            Promise.all(tasks)
                .then(() => cb(true))
                .catch(() => cb(false));
        },
    },
};
</script>

<style scoped>
</style>