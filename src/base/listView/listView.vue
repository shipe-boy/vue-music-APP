<!--  -->
<template>
    <scroll ref="listview" class="list-view" :data="data" :listScroll="true" :probeType="probeType" @scroll="scroll">
        <ul>
            <li ref="listgroup" class="list-group" v-for="(group,index) in data" :key="index">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li class="list-group-item" v-for="(item,index) in group.items" :key="index" @click="selectItem(item)">
                        <img class="avatar" v-lazy="item.avatar" alt="">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="listTouchStart" @touchmove.prevent.stop="ListTouchMove">
            <ul>
                <li class="item" :class="{'current': currentIndex === index}" v-for="(item, index) in shortCutList" :key="index" :data-index="index">{{item}}</li>
            </ul>
        </div>
        <div ref="fixed" class="list-fixed" v-if="fixedTitle">
            <h1 class="fixed-title"> {{ fixedTitle }} </h1>
        </div>
        <!-- 加载动画 -->
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18;   //每个字母高度
const TITLE_HEIGHT = 30;

export default {
    props:{
        data: {
            type: Array,
            default: []
        }
    },
    components:{
        Scroll,
        Loading
    },
    data () {
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: ''
        }
    },
    computed:{
        shortCutList(){
            return this.data.map(group=>{
                return group.title.substring(0,1)
            })
        },
        fixedTitle(){
            if(this.scrollY > 0){
                return "";
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
        }
    },
    methods:{
        listTouchStart(e){
            let index = getData(e.target,'index');
            //   console.log(index)
                let fistTouch = e.touches[0];
                this.touch.y1 = fistTouch.pageY;
                this.touch.fistIndex = index;
                this._scrollTo(index);
        },
        ListTouchMove(e){
                let fistTouch = e.touches[0];
                this.touch.y2 = fistTouch.pageY;
                //获取第一次点击与滑动距离之差
                let disY = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
                //或   let disY = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
                let index = parseInt(this.touch.fistIndex) + disY;
                // console.log(index)
                this._scrollTo(index);
        },
        refresh(){
            this.$refs.listview.refresh();
        },
        _scrollTo(index){
            // console.log(index)
            if(!index && index !== 0)return //点击上边padding
            if(index < 0){  //touchmove移动超出边界
                index = 0;
            }else if(index > this.listHeight -2){
                index = this.listHeight -2;
            }
            this.scrollY = -this.listHeight[index];
            this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
        },
        scroll(position){
            // console.log(position)
            this.scrollY = position.y;
        },
        calculateHeight(){  //计算高度
            this.listHeight = [];
            const list = this.$refs.listgroup;
            let height = 0;
            this.listHeight.push(height);

            for(let i = 0; i < list.length; i++){
                let item = list[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectItem(item){
            this.$emit("select", item)
        }
    },
    watch:{
        data(){ //监听data变化
            setTimeout(() => {
                this.calculateHeight()
            },20)
        },
        scrollY(newY,oldY){
            // console.log(newY)
            // console.log(this.listHeight) //页面热更新时是undefined
            // if(!this.listHeight) return
            const listHeight = this.listHeight;
            //当再顶部时向上拉 newY>0
            if(newY > 0){
                this.currentIndex = 0;
                return
            }
            //再中间部分滚动 listHeight.length - 1
            for(let i = 0; i < listHeight.length - 1; i++){
                let height1 = listHeight[i];
                let height2 = listHeight[i+1];
                if(!height2 || (-newY)>= height1 && (-newY)<height2){
                    this.currentIndex = i;
                    this.diff = height2 + newY;
                    // console.log(this.diff)
                    return
                }
            }
            //再底部时还往下拉 listHeight一开始就添加了一个0所以-2
            this.currentIndex = listHeight.length - 2;
        },
        diff(newVal){
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
            // console.log(this.fixedTop,fixedTop)
            if(this.fixedTop === fixedTop){
                // console.log(1)
                return
            }
            
            this.fixedTop = fixedTop;
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px, 0)`;
        }
    },
    created(){
        //不再data里定义是不需要vue给他们设置set和get来监听他们的变化
        this.touch = {}
        this.listScroll = true;
        this.probeType = 3;
    }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>