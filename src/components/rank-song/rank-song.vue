<!--  -->
<template>
    <music-list :rank="rank" :title="title" :bgimg="bgimg" :songs="songs"></music-list>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {getUrl} from 'api/song'
import {createSong} from 'common/js/song'

    export default {
        data() {
            return {
                songs: [],
                rank: true
            }
        },
        components: {
            MusicList
        },
        computed: {
            title(){
                return this.rankSong.topTitle;
            },
            bgimg(){
                return this.rankSong.picUrl;
            },
            ...mapGetters([
                'rankSong'
            ])
        },
        methods: {
            _getTopList(){
                if(!this.rankSong.id){
                    this.$router.push('/rank')
                    return
                }
                let id = this.$route.params.id;
                getMusicList(id).then(res=> {
                    if(res.code === ERR_OK){
                        // console.log(res.detail.data.songInfoList)
                        this.normalizeSongs(res.detail.data.songInfoList)
                        
                    }
                    
                })
            },
            normalizeSongs(list){
                let ret = [];
                list.forEach(item => {
                    if(item.mid && item.id){
                        getUrl(item.mid).then(res => {
                            //   console.log(res)      //url地址
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
            this._getTopList()
        }
    }
</script>
