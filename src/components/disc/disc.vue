<!--  -->
<template>
    <!-- <transition name="slide"> -->
        <music-list :title="title" :bgimg="bgimg" :songs="songs"></music-list>
    <!-- </transition> -->
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getUrl} from 'api/song'
    export default {
        data() {
            return {
                songs: []
            }
        },
        components: {
            MusicList
        },
        computed: {
            title() {
                return this.disc.dissname
            },
            bgimg(){
                return this.disc.imgurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        methods: {
            init(){
                if(!this.disc.dissid){
                    this.$router.push('/recommend');
                }
                getDiscList(this.disc.dissid).then(res=>{
                    // console.log(res)
                    if(res.code === ERR_OK){
                        // console.log(res.cdlist[0].songlist)
                        this.normalizeSongs(res.cdlist[0].songlist)

                    }
                })
            },
            normalizeSongs(list){
                let ret = [];
                list.forEach(item => {
                    if(item.mid){
                        getUrl(item.mid).then(res => {
                            //   console.log(res)      //url地址
                            //   ret.push(createSong(musicData,res))
                            // console.log(item.album.mid)
                            let data = {
                                songid: item.id,
                                songmid: item.mid,
                                singer: item.singer,
                                songname: item.name,
                                albumname: item.album.name,
                                interval: item.interval,
                                albummid: item.album.mid
                            }
                            this.songs.push(createSong(data,res))
                        })

                    }
                })
                return ret;
            }
        },
        created(){
            this.init();
        }
    }

    /*
    000qNGGd2crA4m
    0049byBQ0wqtF8
    https://y.gtimg.cn/music/photo_new/T002R300x300M0000049byBQ0wqtF8.jpg?max_age=2592000

    https://y.gtimg.cn/music/photo_new/T002R300x300M000001FEsFG2wNm5x.jpg?max_age=2592000
    
    */
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>