<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div v-for="x in visibleData" :key='x.id' class="item" :style="{ height: itemSize + 'px'}">
        {{x.val}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'VirtualList',
  created () {
    let arr = []
    for (let i = 0; i < 1000; i++) {
      arr.push({
        id:'id'+i,
        val:i
      })
    }
    this.listData=arr
  },
  computed:{
    //列表总高度
    listHeight(){
      return this.listData.length * this.itemSize;
    },
    //可显示的列表项数
    visibleCount(){
      return Math.ceil(this.screenHeight / this.itemSize)
    },
    //偏移量对应的style
    getTransform(){
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    //获取真实显示列表数据
    visibleData(){
      console.log(this.listData,this.start,this.end)
      return this.listData.slice(this.start, Math.min(this.end,this.listData.length));
    }
  },
  mounted() {
    this.screenHeight=document.documentElement.clientHeight
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      itemSize:100,
      listData:[],
      //可视区域高度
      screenHeight:0,
      //偏移量
      startOffset:0,
      //起始索引
      start:0,
      //结束索引
      end:4,
    };
  },
  methods: {
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize);
      //此时的结束索引
      this.end = this.start + this.visibleCount;
      //此时的偏移量
      // this.startOffset = scrollTop
      this.startOffset = scrollTop - (scrollTop % this.itemSize);
      console.log(scrollTop,this.startOffset);
    }
  }
};
</script>


<style>
body{
  padding: 0;
  margin: 0;
}
.infinite-list-container {
  height: 100vh;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  background: aqua;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  border-bottom: 1px solid #999;
}
.item{
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid aqua;
  color: #333;
  font-size: 40px;
}
</style>