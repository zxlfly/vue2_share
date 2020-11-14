<template>
    <div>
        {{$route.params.name}}详情
    </div>
</template>

<script>
    export default {
        // 由于组件会被复用，如果发送请求的方法写在created、mounted里面，那么只有初次加载的时候才会触发
        watch: {
            $route:{
                immediate:true,
                handler(){
                    console.log('发请求');
                }
            }
        },
    }
</script>

<style scoped>
    div{
        color: red;
    }
</style>