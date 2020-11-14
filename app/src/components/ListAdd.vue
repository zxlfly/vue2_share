<template>
    <div>
    <!-- 表单输入绑定 --> 
        <input 
            v-model="item" 
            @keydown.enter="addlist"
        /> 
        <!-- 事件处理 --> 
        <button v-on:click="addlist">新增课程</button> 
    </div>
</template>
<script>
export default {
    data() {
        return {
            item: "",
        };
    },
    methods: {
        addlist() {
            if(this.item.trim()==''){
                return
            }
            // 发送自定义事件通知父组件
            // 注意事件名称定义时不要有大写字母出现
            this.$emit("add-list", this.item);
            this.item = "";
        },
    },
};
</script>

<style scoped>
</style>