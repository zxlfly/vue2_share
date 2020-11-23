<template>
    <div>
        <form>
            <slot></slot>
        </form>
    </div>
</template>

<script>
export default {
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
    methods: {
        validate(cb) {
            // 调用所有含有prop属性表单项的validate方法并得到promise数组
            const tasks = this.$children
                .filter((item) => item.prop)
                .map((item) => item.validate());
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