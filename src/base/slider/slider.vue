<!--  -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{'active': currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
    props:{
        loop:{  //是否自动轮播
            type: Boolean,
            default: true
        },
        autoPlay:{  //自动轮播
            type: Boolean,
            default: true
        },
        interval:{    //轮播间隔
            type: Number,
            default: 4000
        }
    },
  data () {
    return {
        currentPageIndex: 0,
        dots: []    //下标 
    }
  },
  methods:{
      setSliderWidth(isResize){
          //获取子元素
          this.children = this.$refs.sliderGroup.children;
        
          let width = 0;
          let sliderWidth = this.$refs.slider.clientWidth;
          for(let i = 0; i  < this.children.length; i++){
              let child = this.children[i];
              addClass(child, 'slider-item')    //添加类名
              child.style.width = sliderWidth + 'px';

              width += sliderWidth;
          }
            //循环时加两张图
          if(this.loop && !isResize){
              width += 2*sliderWidth;
          }
          this.$refs.sliderGroup.style.width = width + 'px';
      },
      initSlider(){
          this.slider = new BScroll(this.$refs.slider,{
              scrollX: true,
              scrollY: false,
              momentum: false,
              snap: {
                loop: this.loop,
                speed: 400,
                threshold: 0.3
                },
              click: true
          })

          this.slider.on('scrollEnd', () => {
              let pageIndex = this.slider.getCurrentPage().pageX;
              
              this.currentPageIndex = pageIndex;
              if(this.autoPlay){
                  clearTimeout(this.timer);
                  this.paly();
              }
          })
      },
      initDots(){
          this.dots = new Array(this.children.length)
      },
      paly(){
            this.timer = setTimeout(()=>{
                this.slider.next();
            },this.interval)
      }
  },
  mounted(){
      setTimeout(()=>{
          this.setSliderWidth();
          this.initDots()
          this.initSlider()

        if(this.autoPlay){
            this.paly()
        }

      },20) //浏览器刷新17毫秒一次

      window.addEventListener('resize',() => {
          if(!this.slider){
              return
          }
          this.setSliderWidth(true);
          this.slider.refresh();
      })
  },
  destroyed(){
    clearTimeout(this.timer)
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>