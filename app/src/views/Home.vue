<template>
  <div class="home">
    <div @click="toPage(item.path)" v-for="(item,card) in list" :key="card" class="item">
      {{item.des}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      list: [
        {
          'path':'/listpage',
          'des':'基础示例中的addlist'
        }
      ]
    }
  },
  methods: {
    toPage(path) {
      // 字符串
      this.$router.push(path)
      // 对象
      //router.push({ path: 'home' })
      // 命名的路由
      //router.push({ name: 'user', params: { userId: '123' }})
      // 带查询参数，变成 /register?plan=private
      //router.push({ path: 'register', query: { plan: 'private' }})
    }
  },
}
</script>
<style>
  .item{
    display: flex;
    align-items: center;
    height: 50px;
    width: 92%;
    margin:0 auto;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    justify-content: center;
    cursor: pointer;
    font-weight: 500;
  }
  .item:hover{
    color: rgba(219, 16, 43, 0.931);
  }
</style>