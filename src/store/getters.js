//通过getters取数据再组件中使用
export const singer = state => state.singer

export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
    //通过索引获得当前播放歌曲的信息
export const currentSong = state => {
    return state.playList[state.currentIndex] || {};
}

//歌单
export const disc = state => state.disc

//排行榜
export const rankSong = state => state.rankSong


export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList