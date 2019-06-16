<!--  -->
<template>
    <music-list :title="title" :bgimg="bgimg" :songs="songs" ></music-list>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetial} from 'api/singer'
import {getUrl} from 'api/song'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

import MusicList from '../music-list/music-list'

export default {
  data () {
    return {
        songs: []
    }
  },
  components:{
      MusicList
  },
  computed: {
      ...mapGetters([
          'singer'
      ]),
      title(){
          return this.singer.name;
      },
      bgimg(){
          return this.singer.avatar;
      }
  },
  watch:{
      songs(newVal){
        //   console.log()
        //   this.songs = newVal;
        //   console.log(this.songs)
      }
  },
  methods: {
      getDetial(){
          //刷新是没有singer
          if(!this.singer.id){
              this.$router.push('/singer')
              return
          }
          getSingerDetial(this.singer.id).then( res => {
            //   console.log(res)
              if(res.code === ERR_OK){
                //   console.log(res.data.list)
                this.songsList(res.data.list);
                // console.log(this.songs)
              }
          })
      },
      //整理获取的数据
      songsList(list){
          let ret = [];
            list.forEach((item) => {
              let {musicData} = item;
              if(musicData.songid && musicData.albummid){
                   getUrl(musicData.songmid).then(res => {
                    //   console.log(res)      //url地址
                    //   ret.push(createSong(musicData,res))
                      this.songs.push(createSong(musicData,res))
                  })
              }
          })
        //   console.log(ret)
          return ret;
      }
  },
  created(){
    //   console.log(this.singer)
      this.getDetial()
  }
}

</script>