<template>
    <div>
        <button @click="login">登录</button>
    </div>
</template>

<script>
    export default {
        methods: {
            login() {
                window.isLogin=true
                this.$router.push(this.$route.query.redirect)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>