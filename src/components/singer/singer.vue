<!--  -->
<template>
  <div class="singer" ref="songer">
        <list-view ref="list" :data="singerList" @select="selectSinger"></list-view>
        <transition name="slide">
            <router-view></router-view>
        </transition>
  </div>
</template>

<script>
import { getSingerList, getSingers } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listView/listView'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门';
const HOT_SINGER_NUM = 10;

export default {
    mixins: [playlistMixin],
  data () {
    return {
        singerList: []
    }
  },
  components:{
      ListView
  },
  methods:{
      handlePlayList(){
            const bottom = this.playList.length > 0 ? '60px' : 0;
            this.$refs.songer.style.bottom = bottom;
            this.$refs.list.refresh();
      },
      _getSingerList(){
          getSingerList().then( (res) => {
            //   console.log(res)
              if(res.code === ERR_OK){
                  this.singerList = this.sortSingerList(res.data.list);
                //   console.log(this.singerList)
              }
          })
          //新接口
          /* getSingers().then(res => {
              console.log(res)
          }) */
      },
      sortSingerList(list){
          let map = {
              hot: {
                  title: HOT_NAME,
                  items: []
              }
          }

            //将所有单个数据整理
          list.forEach((item,index) => {
            //   添加热门歌手
              if(index < HOT_SINGER_NUM){
                  map.hot.items.push(new Singer({
                      id: item.Fsinger_mid,
                      name: item.Fsinger_name
                  }))
              }
              //添加字母列数据
              let key = item.Findex;
              if(!map[key]){
                  map[key] = {
                      title: key,
                      items: []
                  }
              }
              map[key].items.push(new Singer({
                      id: item.Fsinger_mid,
                      name: item.Fsinger_name
                  }))
          })
            //存放数组
          let hot = [];
          let ret = [];
          for( let key in map){
              let val = map[key];
              if(val.title.match(/[a-zA-Z]/)){
                  ret.push(val)
              }else if(val.title === HOT_NAME){
                  hot.push(val)
              }
          }

            //排序
          ret.sort( (a, b) => {
              return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })
          
          return hot.concat(ret)
      },
      selectSinger(singer){
        //   console.log(singer)
          this.$router.push({
              path: `/singer/${singer.id}`
          })

          //提交mutations
        //   console.log(this.setSinger)
          this.setSinger(singer)
      },
        //vuex官网，在组件中提交 Mutation案例
      ...mapMutations({
          setSinger: 'SET_SINGER'
      })
  },
  created(){
      this._getSingerList()
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-active
    transform: translate3d(100%, 0, 0)
</style>