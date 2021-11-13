<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <!--  :style="{ height: listHeight + 'px' }" -->
    <div ref="phantom" class="infinite-list-phantom"></div>
    <!--  :style="{ transform: getTransform }" -->
    <div ref="content" class="infinite-list">
      <div
        v-for="x in visibleData"
        :id="x._index"
        :key="x._index"
        class="infinite-list-item"
      >{{ x.item.val }}</div>
    </div>
  </div>
</template>

<script>
import faker from 'faker'
let arr = []
for (let i = 0; i < 100; i++) {
  arr.push({
    id: 'id' + i,
    val: faker.lorem.sentences() // 长文本
  })
}
export default {
  name: 'VirtualList',
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => arr
    },
    //预估高度
    estimatedItemSize: {
      type: Number,
      default: 100
    },
    //缓冲区比例
    bufferScale: {
      type: Number,
      default: 1
    },
  },
  computed: {
    bufferScaleLen() {
      return this.visibleCount * this.bufferScale
    },
    _listData() {
      return this.listData.map((item, index) => {
        return {
          _index: `_${index}`,
          item
        }
      })
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount)
    },
    belowCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount);
    },
    visibleData() {
      let start = this.start - this.aboveCount;
      let end = this.end + this.belowCount;
      return this._listData.slice(start, end);
    }
  },
  created() {
    this.initPositions();
  },
  mounted() {
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return;
      }
      //获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize();
      //更新列表总高度
      let height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = height + 'px'
      //更新真实偏移量
      this.setStartOffset();
    })
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //起始索引
      start: 0,
      //结束索引
      end: 0,
    };
  },
  methods: {
    initPositions() {
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      })
      );
    },
    //获取列表起始索引
    getStartIndex(scrollTop = 0) {
      let item = this.positions.find(i => i && i.bottom > scrollTop);
      return item.index;
    },
    binarySearch(list, value) {

    },
    //获取列表项的当前尺寸
    updateItemsSize() {
      let nodes = this.$refs.items;
      nodes.forEach((node) => {
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          this.positions[index].height = height;
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }

      })
    },
    //获取当前的偏移量
    setStartOffset(scrollTop) {
      let startOffset;
      if (this.start >= 1) {
        if (this.start >= this.bufferScaleLen) {
          let size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0);
          startOffset = this.positions[this.start].top - size;
        }

      } else {
        startOffset = 0;
      }
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`
    },
    //滚动事件
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;
      // let startBottom = this.positions[this.start - ]
      //此时的开始索引
      this.start = this.getStartIndex(scrollTop);
      // console.log(this.start);
      //此时的结束索引
      this.end = this.start + this.visibleCount;
      //此时的偏移量
      this.setStartOffset(scrollTop);
    }
  }
}
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