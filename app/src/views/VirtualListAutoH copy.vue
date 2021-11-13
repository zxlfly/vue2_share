<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div :style="{ height: listHeight + 'px' }" class="infinite-list-phantom"></div>
    <!--  ref="list"  -->
    <div class="infinite-list" :style="{ transform: `translate3d(0,${startOffset}px,0)` }">
      <div
        v-for="x in visibleData"
        :id="x.id"
        :key="x.id"
        class="infinite-list-item"
        ref="items"
      >{{ x.val }}</div>
    </div>
  </div>
</template>

<script>
import faker from 'faker'
let arr = []
for (let i = 0; i < 500; i++) {
  arr.push({
    id: 'id' + i,
    val: faker.lorem.sentences() // 长文本
  })
}
export default {
  name: 'VirtualList',
  props: {
    //所有列表数据
    listData:{
      type:Array,
      default:()=>arr
    },
    //预估高度
    estimatedItemSize:{
      type:Number,
      default: 50
    },
    //缓冲区比例
    bufferScale:{
      type:Number, 
      default:1
    },
  },
  computed: {
    //列表总高度
    listHeight() {
      return this.positions[this.positions.length - 1].bottom
    },
    //可显示的列表项数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.itemSize)
    },
    //获取真实显示列表数据
    visibleData() {
      let start = this.start - this.aboceCount
      let end = this.end + this.underCount
      return this.listData2.slice(start, end);
    },
    // 上缓冲区
    aboceCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount)
    },
    // 下缓冲区
    underCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount)
    }
  },
  created() {
    this.initPositions()
  },
  mounted() {
    this.screenHeight = document.documentElement.clientHeight
    this.start = 0;
    this.end = this.start + this.visibleCount;
    // dom挂载之后第一次计算高度
    this.updateFn()
  },
  update() {
    this.updateFn()
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //偏移量
      startOffset: 0,
      //起始索引
      start: 0,
      //结束索引
      end: 0,
      // 缓存列表项信息
      positions: [],
    };
  },

  methods: {
    updateFn() {
      //渲染完成后，获取列表每项的位置信息并缓存
      this.$nextTick(function () {
        // 没有子项
        if (!this.$refs.items || !this.$refs.items.length) {
          return
        }
        // 获取真实元素大小
        this.updateItemsSize()
        // 列表总高度
      //   let height = this.positions[this.positions.length - 1].bottom;
      // this.$refs.phantom.style.height = height + 'px'
        // 更新真实偏移量
        this.setStartOffset()
      })
    },
    initPositions() {
      this.positions = this.listData.map((item, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      }))
    },
    updateItemsSize() {
      let nodes = this.$refs.items
      nodes.forEach(node => {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = Number(node.id.slice(2))
        let oldHeight = this.positions[index].height
        let cha = oldHeight - height
        // 存在差值
        if (cha != 0) {
          // 更新
          this.positions[index].bottom = this.positions[index].bottom - cha
          this.positions[index].height = height
          //后面都需要更新
          for (let i = index + 1; i < this.positions.length; i++) {
            this.positions[i].top = this.positions[i - 1].bottom;
            this.positions[i].bottom = this.positions[i].bottom - cha;
          }
        }
      });
    },
    getStartIndex(scrollTop = 0) {
      let item = this.positions.find(i => i && i.bottom > scrollTop);
      return item.index;
    },
    setStartOffset() {
      let startOffset
      if (this.start >= 1) {
        if(this.start>this.bufferScale*this.visibleCount&&this.lastIndex!=this.start){
          startOffset = this.positions[this.start - 1].bottom
          this.lastIndex=this.start
        }
      } else {
        startOffset = 0;
      }
      // this.$refs.list.style.transform = `translate3d(0,${startOffset}px,0)`
      this.startOffset = startOffset
    },
    scrollEvent() {
      this.$nextTick(() => {
        this.scrollEventCb()
        // requestAnimationFrame(this.scrollEventCb)
      })
    },
    scrollEventCb() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      //此时的开始索引
      this.start = this.getStartIndex(scrollTop)
      //此时的结束索引
      this.end = this.start + this.visibleCount;
      //此时的偏移量
      // // this.startOffset = scrollTop
      // if (this.start >= 1) {
      //   this.startOffset = this.positions[this.start - 1].bottom
      // } else {
      //   this.startOffset = 0;
      // }
      this.setStartOffset()
      // requestAnimationFrame(this.scrollEventCb)
    }
  }
};
</script>


<style>
body {
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
</style>