

<script>
export default {
    data() {
        return {
            item: "",
        };
    },
    template: `
                <div>
                <!-- 表单输入绑定 --> 
                    <input 
                        v-model="item" 
                        @keydown.enter="addlist"
                    /> 
                    <!-- 事件处理 --> 
                    <button v-on:click="addlist">新增课程</button> 
                </div> 
            `,
    methods: {
        addlist() {
            // 发送自定义事件通知父组件
            // 注意事件名称定义时不要有大写字母出现
            this.$emit("add-list", this.item);
            this.item = "";
        },
    },
};
</script>

<style lang="scss" scoped>
</style>