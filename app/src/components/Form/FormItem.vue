<template>
    <div>
        <div>
            <label v-if="label">{{ label }}</label>
            <slot></slot>
        </div>
        <div class="error" v-if="error">
            {{ error }}
        </div>
    </div>
</template>

<script>
import emitter from '../../mixins/emitter'
export default {
    name: "FormItem",
    componentName: "FormItem",
    mixins:[emitter],
    inject: ["form"],
    props: {
        label: {
            type: String,
            default: "",
        },
        prop: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            error: "",
        };
    },
    mounted() {
        // 监听校验事件
        this.$on("validate", () => {
            this.validate();
        });
        if(this.prop){
            this.dispatch('Form','formItemAdd',this);
        }
    },
    methods: {
        // 校验函数
        // 由第三方成熟的校验库async-validator
        // 这里没有使用
        validate() {
            // 通过inject: ['form']来获取队形的规则和值
            // 获取对应FormItem校验规则
            const rule = this.form.rules[this.prop];
            // 获取校验值
            const value = this.form.model[this.prop];
            // 返回一个执行承诺promise
            return new Promise((resolve, reject) => {
                if (rule.required && value == "") {
                    reject(false);
                    this.error = rule.message;
                } else {
                    resolve(true);
                    this.error = "";
                }
            });
        },
    },
};
</script>

<style scoped>
.error {
    color: red;
}
</style>