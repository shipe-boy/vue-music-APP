<!--  -->
<template>
    <div class="player" v-if="playList.length>0">
        <!-- 展开 -->
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdRotate">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{ playingLyric }}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ format(currentTime) }}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="changeProgress"></progress-bar>
                        </div>
                        <span class="time time-r">{{ format(currentSong.duration) }}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableClas">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableClas">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disableClas">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)" class="icon"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 收起 -->
        <transition name="mini">
            <div class="mini-player" @click="open" v-show="!fullScreen">
                <div class="icon">
                    <img :class="cdRotate" width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="32" :percent="percent">
                        <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlayList">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <play-list ref="playlist"></play-list>
        <audio ref="audio" :src="currentSong.url" @error="error" @play="ready" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script>
    import animations from 'create-keyframe-animation'
    import { mapGetters, mapMutations, mapActions } from 'vuex'
    import { prefixStyle } from 'common/js/dom'
    import { playMode } from 'common/js/config'
    import ProgressBar from 'base/progress-bar/progress-bar'
    import ProgressCircle from 'base/progress-circle/progress-circle'
    
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'
    import PlayList from '../play-list/play-list'
    import {playerMixin} from 'common/js/mixin'

    const transform = prefixStyle('transform');
    const transitionDuration = prefixStyle('transitionDuration');

    export default {
        mixins: [playerMixin],
        data() {
            return {
                songReady: false, //节流，防止连续点击出错
                currentTime: 0,
                currentLyric: null,
                currentLineNum: 0,
                currentShow: 'cd',
                playingLyric: ''
            }
        },
        components: {
            ProgressBar,
            ProgressCircle,
            Scroll,
            PlayList
        },
        computed: {
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play';
            },
            miniIcon() {
                // console.log(this.playing)
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
            },
            cdRotate() {
                return this.playing ? 'play' : 'play pause';
            },
            disableClas() {
                return this.songReady ? "" : 'disable';
            },
            percent() {
                return this.currentTime / this.currentSong.duration;
            },
            ...mapGetters([
                'fullScreen',
                'playing',
                'currentIndex'
            ])
        },
        watch: { //根据vuex的数据控制页面的audio
            //歌曲发生变化时就播放
            currentSong(newSong, oldSong) {
                if(!newSong.id) return
                if (newSong.id === oldSong.id) return
                if (this.currentLyric) {
                    this.currentLyric.stop();
                    this.currentTime = 0;
                    this.playingLyric = "";
                    this.currentLineNum = 0;
                }
                clearTimeout(this.timer);
                //dom加载完成后再播放
                this.timer = setTimeout(()=> {   //兼容微信
                    this.$refs.audio.play();
                    //获取歌词
                    this.getLyric();
                }, 1000)
                /* this.$nextTick(() => {   //正常的
                    this.$refs.audio.play();
                    //获取歌词
                    this.getLyric();
                }) */
            },
            playing(newVal) {
                this.$nextTick(() => {
                    let audio = this.$refs.audio;
                    newVal ? audio.play() : audio.pause();
                })
            }
        },
        methods: {
            back() {
                this.setFullScreen(false);
            },
            open() {
                this.setFullScreen(true);
            },
            enter(el, done) {
                const { x, y, scale } = this.getPosAndScale();

                let animation = {
                    0: {
                        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0, 0, 0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0, 0, 0) scale(1)`
                    }
                }
                //调用api
                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                })
                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter() {
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = '';
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style.transform = '';
            },
            leave(el, done) {
                // 回调函数 done 是可选的
                this.$refs.cdWrapper.style.transition = 'all 0.4s';
                const { x, y, scale } = this.getPosAndScale();
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend', done)
            },
            afterLeave() {
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style.transform = '';
            },
            getPosAndScale() {
                //左下角唱片
                const targetWidth = 40;
                const paddingLeft = 40;
                const paddingBottom = 30;
                //中心唱片
                let paddingTop = 80;
                let width = window.innerWidth * 0.8;
                //初始缩放
                let scale = targetWidth / width;
                //初始x，y  就是左下角的中心
                let x = -(window.innerWidth / 2 - paddingLeft);
                let y = window.innerHeight - paddingTop - (width / 2) - paddingBottom;
                //返回初始位置和缩放比
                return {
                    x,
                    y,
                    scale
                }
            },
            togglePlaying() {
                if (!this.songReady) return
                this.setPlayingState(!this.playing)
                //控制歌词滚动的开关
                if (this.currentLyric) {
                    this.currentLyric.togglePlay();
                }
            },
            prev() {
                if (!this.songReady) return //节流
                if(this.playList.length === 1){
                    this.loop();
                    return
                }else{
                    let index = this.currentIndex - 1;
                    if (index === -1) {
                        index = this.playList.length - 1;
                    }
                    this.setCurrentIndex(index)
                    // watch里改变
                    if (!this.playing) { //暂停时切换要改变playing状态
                        this.togglePlaying()
                    }
                }
                this.songReady = false;
            },
            next() {
                if (!this.songReady) return //节流
                if(this.playList.length === 1){
                    this.loop();
                    return;
                }else{
                    let index = this.currentIndex + 1;
                    if (index === this.playList.length) {
                        index = 0;
                    }
                    this.setCurrentIndex(index)
                    //watch里改变
                    if (!this.playing) { //暂停时切换要改变playing状态
                        this.togglePlaying()
                    }
                }
                this.songReady = false;
            },
            ready() {
                this.songReady = true;
                this.savePlayHistory(this.currentSong)
            },
            error() { //解决歌曲加载失败后songReady一直未false，其他按钮不能用
                this.songReady = true;
            },
            updateTime(e) {
                this.currentTime = e.target.currentTime;
            },
            format(time) { //格式化事件戳
                time = time | 0; //相当于Math.floor(time)
                const minute = time / 60 | 0;
                const second = this.pad(time % 60);
                return `${minute}:${second}`
            },
            pad(num, n = 2) { //给时间补0
                //n字符串长度
                let len = num.toString().length;
                while (len < n) {
                    num = '0' + num;
                    len++;
                }
                return num;
            },
            changeProgress(percent) {
                // console.log(this.currentSong.duration, percent)
                let currentTime = this.currentSong.duration * percent;
                this.$refs.audio.currentTime = currentTime;
                if (!this.playing) { //暂停时拖动后播放
                    this.togglePlaying()
                }
                //歌词跟随进度
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000);
                }
            },
            end() { //歌曲播放完了
                if (this.mode === playMode.loop) { //单曲循环
                    this.loop();
                } else {
                    this.next()
                }

            },
            loop() { //单曲循环
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
                //单曲循环时歌词回顶
                if (this.currentLyric) {
                    this.currentLyric.seek(0);
                }
            },
            getLyric() {
                this.currentSong.getLyric().then(lyric => {
                    if(this.currentSong.lyric !== lyric) return
                    this.currentLyric = new Lyric(lyric, this.handlelyric)
                    // console.log(this.currentLyric)
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                }).catch(err => {
                    this.currentLyric = null;
                    this.playingLyric = "";
                    this.currentLineNum = 0;
                })
            },
            handlelyric({ lineNum, txt }) {
                if(!this.$refs.lyricList) return
                this.currentLineNum = lineNum;
                if (lineNum > 5) {
                    //比如时第六行了，就是往上滚动一行；
                    let lineEl = this.$refs.lyricLine[lineNum - 5];
                    this.$refs.lyricList.scrollToElement(lineEl, 1000);
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000);
                }
                this.playingLyric = txt;
            },
            middleTouchStart(e) {
                this.touch.init = true;
                // 用来判断是否是同一次移动
                this.touch.moved = false
                let touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
            },
            middleTouchMove(e) {
                if (!this.touch.init) return
                let touch = e.touches[0];
                //差值
                let disX = touch.pageX - this.touch.startX;
                let disY = touch.pageY - this.touch.startY;

                if (Math.abs(disY) > Math.abs(disX)) { //认为是纵向滑动
                    return
                }
                if (!this.touch.moved) {
                    this.touch.moved = true
                }
                //歌词页距离左侧
                let left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
                let offsetwidth = Math.min(0, Math.max(-window.innerWidth, left + disX));
                this.touch.percent = Math.abs(offsetwidth / window.innerWidth);

                this.$refs.lyricList.$el.style[transitionDuration] = "0";
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`;

                //修改cd透明度
                this.$refs.middleL.style[transitionDuration] = "0";
                this.$refs.middleL.style.opacity = 1 - this.touch.percent;

            },
            middleTouchEnd() {
                if (!this.touch.moved) {
                    return
                }
                let offsetwidth;
                let opacity;
                if (this.currentShow === 'cd') { //从右向左滑
                    if (this.touch.percent > 0.1) {
                        offsetwidth = -window.innerWidth;
                        opacity = 0;
                        this.currentShow = 'lyric';
                    } else {
                        offsetwidth = 0;
                        opacity = 1;
                    }
                } else { //从左向右滑
                    if (this.touch.percent < 0.9) {
                        offsetwidth = 0;
                        opacity = 1;
                        this.currentShow = 'cd';
                    } else {
                        opacity = 0;
                        offsetwidth = -window.innerWidth;
                    }
                }
                this.$refs.lyricList.$el.style[transitionDuration] = "300ms";
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`;
                //修改cd透明度
                this.$refs.middleL.style[transitionDuration] = "300ms";
                this.$refs.middleL.style.opacity = opacity;

            },
            showPlayList(){
                this.$refs.playlist.show();
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN'
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        },
        created() {
            this.touch = {}
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>