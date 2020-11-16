<template>
    <div>
        <h1>vuex基础示例</h1>
        <div>来自多个模块的数据进行操作</div>
        <h3>count1模块</h3>
        <div>{{ count1 }}</div>
        <div>{{ doubleCount1 }}</div>
        <button @click="add">addCount1</button>
        <button @click="asyncAdd">asyncAddCount1</button>
        <hr />
        <h3>count2模块</h3>
        <div>{{ this["Count2/count1"] }}</div>
        <div>{{ this["Count2/doubleCount1"] }}</div>
        <button @click="this['Count2/add']">addCount2</button>
        <button @click="this['Count2/asyncAdd']">asyncAddCount2</button>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {};
    },
    methods: {
        // 这样写后面数组里面的key可以直接在template中使用
        ...mapMutations("Count1", ["add"]),
        ...mapActions("Count1", ["asyncAdd"]),
        // 如果这么写就麻烦些需要  this['key']
        ...mapMutations(["Count2/add"]),
        ...mapActions(["Count2/asyncAdd"]),
    },
    computed: {
        // 在模块对应的属性有重名的时候可以设置别名来区别
        ...mapGetters("Count1", ["doubleCount1"]),
        ...mapState("Count1", ["count1"]),
        ...mapGetters(["Count2/doubleCount1"]),
        ...mapState(["Count2/count1"]),
    },
};
</script>

<style lang="scss" scoped>
</style>