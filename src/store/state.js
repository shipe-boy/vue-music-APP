import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
    singer: {},
    playing: false, //是否播放
    fullScreen: false, //是否全屏
    playList: [], //歌曲播放列表
    sequenceList: [], //顺序歌曲列表
    mode: playMode.sequence, //播放模式
    currentIndex: -1, //当前播放歌曲索引
    disc: {},
    rankSong: {},
    searchHistory: loadSearch(), //搜索历史
    playHistory: loadPlay(),
    favoriteList: loadFavorite() //收藏列表
}

export default state