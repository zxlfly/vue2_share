<template>
    <div>
        <List :list="list" />
        <ListAdd @add-list="addlist"></ListAdd>
        <Message :show.sync="show">新增成功！</Message>
    </div>
</template>

<script>
    import List from '../components/List'
    import ListAdd from '../components/ListAdd'
    import Message from '../components/Message'
    export default {
        components: {
            List,ListAdd,Message
        },
        data(){
            return {
                title: 'zxl',
                list:[1],
                show:false
            }
        },
        methods: {
            addlist(e) {
                this.list.push(e)
                this.show=true
            }
        },
    }
</script>

<style>

</style>