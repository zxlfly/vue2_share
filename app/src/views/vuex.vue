<template>
    <div>
        <h1>vuex基础示例</h1>
        <div>来自多个模块的数据进行操作</div>
        <h3>count1模块</h3>
        <div>count1:---{{ count1 }}</div>
        <div>doubleCount1:---{{ doubleCount1 }}</div>
        <button @click="add">addCount1</button>
        <button @click="asyncAdd">asyncAddCount1</button>
        <hr />
        <h3>count2模块</h3>
        <div>count2:---{{ count2 }}</div>
        <div>countAlias:---{{ countAlias }}</div>
        <div>countAdd1:---{{ countAdd1 }}</div>
        <div>doubleCount2:---{{ doubleCount2 }}</div>
        <button @click="this['Count2/add']">addCount2</button>
        <button @click="this['Count2/asyncAdd']">asyncAddCount2</button>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            num:100
        };
    },
    mounted () {
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
        ...mapGetters("Count1", ["doubleCount1"]),
        ...mapState("Count1", ["count1"]),
        // 在模块对应的属性有重名的时候可以设置别名来区别
        ...mapGetters({  
            // 传字符串参数
            doubleCount2: 'Count2/doubleCount1',
        }),
        // ...mapState(["Count2/count1"]),
        ...mapState({  
            // 箭头函数可使代码更简练
            count2: state => state.Count2.count1,
            // 为了能够使用 `this` 获取局部状态，必须使用常规函数
            countAdd1 (state) {
                return state.Count2.count1 + this.num
            }
        }),
        ...mapState('Count2',{  
            // 如果要使用下面这种用法，在我们当前的示例中得传入命名空间Count2
            countAlias:'count1',
        })
        /*mapState实现源码
        在我们直接传入对象不传namespace的时候
        会执行
        return typeof val === 'function'
            ? val.call(this, state, getters)
            : state[val]
        }
        如果我们不传namespace 使用 countAlias:'Count2/count1' 
        得到的值将是state['Count2/count1']
        这样将取不到值
        export const mapState = normalizeNamespace((namespace, states) => {
            const res = {}
            if (__DEV__ && !isValidMap(states)) {
                console.error('[vuex] mapState: mapper parameter must be either an Array or an Object')
            }
            normalizeMap(states).forEach(({ key, val }) => {
                res[key] = function mappedState () {
                let state = this.$store.state
                let getters = this.$store.getters
                if (namespace) {
                    const module = getModuleByNamespace(this.$store, 'mapState', namespace)
                    if (!module) {
                    return
                    }
                    state = module.context.state
                    getters = module.context.getters
                }
                return typeof val === 'function'
                    ? val.call(this, state, getters)
                    : state[val]
                }
                // mark vuex getter for devtools
                res[key].vuex = true
            })
            return res
        })
        */
    },
};

</script>

<style scoped>
</style>