<!--  -->
<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest @select="saveSearch" :listScroll="blurInput" ref="suggest" :query="query"></suggest>
        </div>
        <!-- 确认弹窗 -->
        <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空">
        </confirm>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from '../suggest/suggest'
    import {mapActions} from 'vuex'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import Scroll from 'base/scroll/scroll'
    import {playlistMixin, searchMixin} from 'common/js/mixin'
    export default {
        mixins: [playlistMixin, searchMixin],
        data() {
            return {
                hotKey: []
            }
        },
        components: {
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            Scroll
        },
        computed: {
            shortcut(){
                return this.hotKey.concat(this.searchHistory)
            }
        },
        watch: {
            query(newVal){
                if(!newVal){
                    setTimeout(()=> {
                        this.$refs.shortcut.refresh()
                    },20)
                }
            }
        },
        methods: {
            handlePlayList(playlist){
                const bottom = playlist.length > 0 ? '60px' : 0;
                
                this.$refs.shortcutWrapper.style.bottom = bottom;
                this.$refs.searchResult.style.bottom = bottom;

                this.$refs.shortcut.refresh()
                this.$refs.suggest.refresh()
            },
            _getHotKey(){
                getHotKey().then(res => {
                    // console.log(res)
                    if(res.code === ERR_OK){
                        // console.log(res.data.hotkey)
                        this.hotKey = res.data.hotkey.slice(0,10);  //取前十条数据
                    }
                })
            },
            deleteOne(item){
                this.deleteSearchHistory(item);
            },
            showConfirm(){
                this.$refs.confirm.show();
            },
            ...mapActions([
                'clearSearchHistory'
            ])
        },
        created(){
            this._getHotKey()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0

    
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-active
        transform: translate3d(100%, 0, 0)
</style>