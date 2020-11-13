<template>
    <div>
        <!-- 条件渲染 -->
        <p v-if="list.length == 0">没有任何课程信息</p>
        <!-- 列表渲染 -->
        <ul>
            <!-- class绑定 -->
            <li :key="c" v-for="c in list">
                {{ c }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props:{
            // 新增课程时也要访问list，因此作为属性传递 
            list: { type: Array, default: ()=>[] },
        },
        data() {
            return {
            }
        },
        
    }
</script>

<style scoped>

</style>