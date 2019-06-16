<!--  -->
<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgimg">
            <div class="play-wrapper">
                <div @click="playRandom" ref="playbtn" v-show="songs.length>0" class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll @scroll="scroll" :probeType="probeType" :list-scroll="listScroll" :data="songs" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
            </div>
            <div v-show="!songs.length" class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const TITLE_HEIGHT = 40;
const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter')
    export default {
        mixins: [playlistMixin],
        props: {
            bgimg: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Loading,
            Scroll,
            SongList
        },
        data() {
            return {
                scrollY: 0
            }
        },
        watch: {
            songs(newVal){
                // this.songs = newVal;
                // console.log(newVal)            
            },
            scrollY(newVal){
                // console.log(newVal,this.minTranslateY)
                let maxY = Math.max(this.minTranslateY,newVal);
                let zIndex = 0;
                let scale = 1;
                let blur = 0;

                this.$refs.layer.style[transform] = `translate3d(0, ${maxY}px, 0)`;
                
                const percent = Math.abs(newVal / this.imgHeight);
                if(newVal > 0){ //下拉图片放大
                    scale = 1 + percent;
                    zIndex = 10;
                }else{  //上拉图片模糊
                    blur = Math.min(20 * percent, 20);
                } 
                this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
                
                //与顶部级间隙，即控制图片
                if(newVal < this.minTranslateY){
                    zIndex = 10;
                    this.$refs.bgimg.style.paddingTop = 0;
                    this.$refs.bgimg.style.height = TITLE_HEIGHT + 'px';          
                    this.$refs.playbtn.style.display = 'none';
                }else{  //正常情况
                    this.$refs.bgimg.style.paddingTop = '70%';
                    this.$refs.bgimg.style.height = 0;
                    this.$refs.playbtn.style.display = '';
                }
                this.$refs.bgimg.style.zIndex = zIndex;
                this.$refs.bgimg.style[transform] = `scale(${scale})`;                     
            }
        },
        computed:{
            bgStyle(){
               return `background-image:url(${this.bgimg})`;
            }
        },
        methods: {
            handlePlayList(playlist){
                const bottom = playlist.length > 0 ? "60px" : 0;
                this.$refs.list.$el.style.bottom = bottom;
                this.$refs.list.refresh();
            },
            scroll(position){
                this.scrollY = position.y;
            },
            back(){
                this.$router.back();
            },
            selectItem(item, index){
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            playRandom(){
                this.randomPlay({
                    list: this.songs
                })
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        },
        created(){
            this.probeType = 3;
            this.listScroll = true;
        },
        mounted(){
        //    console.log(this.songs) 
            this.imgHeight = this.$refs.bgimg.clientHeight;
            this.minTranslateY = -this.imgHeight + TITLE_HEIGHT;
            //设置列表初始距离顶部高度
            this.$refs.list.$el.style.top = `${this.imgHeight}px`;
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>