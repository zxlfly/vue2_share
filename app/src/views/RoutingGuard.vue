<template>
    <div>
        <h1>登录了才能进来的页面</h1>
    </div>
</template>

<script>
export default {
    //可以在路由组件内直接定义以下路由导航守卫。
    //beforeRouteEnter,beforeRouteUpdate,beforeRouteLeave
    beforeRouteEnter(to, from, next) {
        console.log(3222);
        // to: Route: 即将要进入的目标 路由对象
        // from: Route: 当前导航正要离开的路由
        // next: Function: 一定要调用该方法来 resolve 这个钩子。
        if (to.meta.auth) {
            if (window.isLogin) {
                next();
            } else {
                next("/login?redirect=" + to.fullPath);
            }
        } else {
            next();
        }
    },
};
</script>

<style scoped>
</style>