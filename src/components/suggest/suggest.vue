<!--  -->
<template>
    <scroll @beforeScroll="listScroll" :beforeScroll="beforeScroll" @scrollToEnd="searchMore" :pullup="pullup" :data="result" ref="suggest" class="suggest">
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div v-show="!hasMore && !result.length" class="no-result-wrapper">
            <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getUrl} from 'api/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'SENGER';
const PAGE_SIZE = 20;

    export default {
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                page: 1,
                result: [],
                pullup: true,    //上拉刷新
                hasMore: true,
                beforeScroll: true
            }
        },
        components:{
            Scroll,
            Loading,
            NoResult
        },
        watch: {
            query(newVal){
                if(!newVal){
                   this.result = [];
                }
                this._search()
            }
        },
        methods: {
            _search(){
                this.page = 1;
                this.hasMore = true;
                this.$refs.suggest.scrollTo(0,0);
                search(this.query, this.page, this.showSinger, PAGE_SIZE).then(res=> {
                    // console.log(res)
                    if(res.code === ERR_OK){
                        this._genResult(res.data)
                        // console.log(res.data.song)
                        this.checkMore(res.data)
                    }   
                })
            },
            _genResult(data){
                let ret = [];
                if(data.zhida && data.zhida.singerid){  //数组第一个是歌手
                    this.result.push({...data.zhida, ...{type:TYPE_SINGER}})    //如果是歌手加上type
                }
                if(data.song){  //歌曲
                    //获取歌曲播放地址
                    // console.log(data.song.list)
                    data.song.list.forEach(item => {
                        if(item.songid && item.albummid){
                        getUrl(item.songmid).then(res => {
                                //   console.log(res)      //url地址
                                this.result.push(createSong(item,res))
                            })
                        }
                    })
                }
                return ret;
            },
            searchMore(){
                if(!this.hasMore)return
                this.page++;
                // console.log(this.page)
                search(this.query, this.page, this.showSinger, PAGE_SIZE).then(res=> {
                    // console.log(res)
                    if(res.code === ERR_OK){
                        this._genResult(res.data)
                        // console.log(res.data)
                        this.checkMore(res.data)
                    }   
                })
            },
            checkMore(data){
                const song = data.song;
                if(!song.list.length || (song.curnum + song.curpage * PAGE_SIZE) >= song.totalnum){
                    this.hasMore = false;
                }
            },
            getIconCls(item){   //图标样式
                if(item.type === TYPE_SINGER){
                    return 'icon-mine';
                }else{
                    return 'icon-music';
                }
            },
            getDisplayName(item){
                // console.log(item)
                if(item.type === TYPE_SINGER){
                    return item.singername
                }else{
                    return `${item.name}-${item.singer}`
                }
            },
            selectItem(item){
                if(item.type === TYPE_SINGER){  //歌手详情页 
                    // console.log(item)
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    })
                    this.$router.push({
                        path: `/search/${singer.id}`
                    })
                    //传数据
                    this.setSinger(singer)
                }else{  //点击歌曲，往vuex播放列表添加一首
                    this.insertSong(item)
                }

                //存入历史纪录
                this.$emit('select')
            },
            listScroll(){
                this.$emit('listScroll')
            },
            refresh(){
                this.$refs.suggest.refresh();
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>