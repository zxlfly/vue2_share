<template>
    <div class="message-box" v-if="show"> 
        <slot></slot> 
        <span class="message-box-close" @click="$emit('update:show', false)">X</span>
    </div>
</template>
<script>
export default {
    props: ["show"],

};
</script>

<style scoped>
.message-box {
    padding: 10px 20px;
    background: #4fc08d;
    border: 1px solid #42b983;
}

.message-box-close {
    float: right;
}
</style>