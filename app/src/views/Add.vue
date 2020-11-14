<template>
    <div>
        <button @click="login">添加路由</button>
    </div>
</template>

<script>
export default {
    methods: {
        login() {
            window.isAdd = true;
            this.$router.addRoutes([
                {
                    path: "/dynamicrouting",
                    component: () => import("../views/DynamicRouting.vue"),
                },
            ]);
            this.$router.push(this.$route.query.redirect);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>