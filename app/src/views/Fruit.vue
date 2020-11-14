<template>
    <div>
        <h1>水果列表</h1>
        <ul>
            <li @click="toPage(x)" v-for="x in list" :key='x'>{{x}}</li>
        </ul>
        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                    '苹果',
                    '香蕉',
                    '西瓜',
                    '菠萝蜜',
                    '人生果',
                ]
            }
        },
        methods: {
            toPage(x) {
                this.$router.push(`/fruitlist/detail/${x}`)
            }
        },
    }
</script>

<style scoped>
    li{
        cursor: pointer;
    }
</style>