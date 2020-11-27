// 广播自上而下派发事件，树形遍历使用的时候要注意避免产生性能问题
// componentName自定义的组件名 和vue框架本身没有关系 不是name属性
function broadcast(componentName, eventName, params) {
    // 遍历所有的子元素，如果子元素的componentName和传入的componentName相同，则派发事件
    this.$children.forEach(child => {
        var name = child.$options.componentName;
        // 相同就派发事件
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            // 不同就继续递归遍历
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}
export default {
    methods: {
        // 冒泡的方式向上查找相同componentName派发事件
        dispatch(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            // 向上查找
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            // 找到了就派发事件
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        }
    }
};