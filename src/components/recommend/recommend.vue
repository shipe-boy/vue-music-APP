<!--  -->
<template>
    <div class="recommend" ref="recommend">
    <scroll-view ref="scroll" class="recommend-content" :data="songList">
      <div>
        <div v-if="sliders.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item,index) in sliders" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item,index) in songList" :key="index" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <loading></loading>
      </div>
    </scroll-view>
    <transition name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getRecommend, getSongList } from 'api/recommend'
import {ERR_OK} from 'api/config'
import {playlistMixin} from 'common/js/mixin'
import Slider from 'base/slider/slider'
import ScrollView from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapMutations} from 'vuex'
export default {
    mixins: [playlistMixin],
  data () {
    return {
        sliders: [],
        radioList: [],
        songList: []
    }
  },
  components: {
      Slider,
      ScrollView,
      Loading
  },
  methods: {
      handlePlayList(){
            const bottom = this.playList.length > 0 ? '60px' : 0;
            this.$refs.recommend.style.bottom = bottom;
            this.$refs.scroll.refresh();
      },
      _getRecommend(){
          getRecommend().then( (res) => {
              if(res.code === ERR_OK){
                  //返回了推荐页的所有数据
                //   console.log(res.data)
                  this.sliders = res.data.slider;
              }
          })
      },
      //请求pc端的歌单列表
      _getSongList(){
          getSongList().then( res=>{
              if(res.code === ERR_OK){
                //   console.log(res)
                  this.songList = res.data.list;
                //   console.log(this.songList)
              }
          })
      },
      loadImage(){ //解决better-scroll的高度计算问题
        //   console.log("onload")  //五张图片，执行了五次
        if(!this.checkLoadong){ //只执行一次
            // console.log(this.$refs.scroll) 就是scroll的实例
            this.$refs.scroll.refresh();
            this.checkLoadong = true;
        }
          
      },
      selectItem(item){
        //   console.log(item)
          this.$router.push({
              path: `/recommend/${item.dissid}`
          })
          this.setDisc(item)
      },
      ...mapMutations({
          'setDisc': 'SET_DISC'
      })
  },
  created(){
      //测试 better-scroll的高度计算
     /*  setTimeout(()=>{
          this._getRecommend();
      },1000) */
      this._getRecommend();
      this._getSongList();
      //测试loading效果
      /*  setTimeout(()=>{
          this._getSongList();
      },1000) */
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
    
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>