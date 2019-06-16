import * as types from './mutation-type'
import { playMode } from 'common/js/config'
import { random } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

//点击播放
export const selectPlay = function({ commit, state }, { list, index }) {
    let temp = list.slice(); //不允许直接传list
    // console.log(list)
    /* commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list) */
    commit(types.SET_SEQUENCE_LIST, temp)
        /* if (state.mode === playMode.random) {
            let randmoList = random(temp);
            commit(types.SET_PLAYLIST, randmoList)
            index = findIndex(randmoList, list[index])
        } else {
            commit(types.SET_PLAYLIST, temp)
        } */
    commit(types.SET_PLAYLIST, temp)
    commit(types.SET_CURRENT_INDEX, index)

    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)

}

//随机播放
export const randomPlay = function({ commit }, { list }) {
    let temp = list.slice(); //不允许直接传list
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, temp)
    let randmoList = random(temp);
    commit(types.SET_PLAYLIST, randmoList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}


//添加歌曲到播放列表
export const insertSong = function({ commit, state }, song) {
        let playlist = state.playList.slice();
        let sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;


        //记录当前歌曲
        let currentSong = playlist[currentIndex];

        //修改playlist
        //查找列表中是否已经有了这首歌
        let fpIndex = findIndex(playlist, song)
            //再当前歌曲下一位插入歌曲
        currentIndex++ //插入一首歌，索引+1
        playlist.splice(currentIndex, 0, song) //当前索引（已经是+1的位置）位插入歌曲
        if (fpIndex > -1) { //已经有这首歌了
            //当前插入的索引大于列表中的索引，也就是插在后面了
            if (currentIndex > fpIndex) {
                playlist.splice(fpIndex, 1);
                currentIndex--;
            } else { //也就是插在前面了
                playlist.splice(fpIndex + 1, 1)
            }
        }

        //修改sequenceList
        //歌曲要插入的位置
        let currentSIndex = findIndex(sequenceList, currentSong) + 1;
        //查找之前sequenceList里有没有这首歌
        let fsIndex = findIndex(sequenceList, song)
        sequenceList.splice(currentSIndex, 0, song)
        if (fsIndex > -1) { //已经有这首歌了
            //当前插入的索引大于列表中的索引，也就是插在后面了
            if (currentSIndex > fsIndex) {
                sequenceList.splice(fsIndex, 1);
            } else { //也就是插在前面了
                sequenceList.splice(fsIndex + 1, 1)
            }
        }

        commit(types.SET_PLAYLIST, playlist)
        commit(types.SET_SEQUENCE_LIST, sequenceList)
        commit(types.SET_CURRENT_INDEX, currentIndex)
        commit(types.SET_FULL_SCREEN, true)
        commit(types.SET_PLAYING_STATE, true)

    }
    /*
    var arr = [1,2,3,4];

        当前索引 2
        
        插入 2  发现已经有了，返回下标 1
        
        插入位置 index++（3） [1,2,3,2,4]

        删除  3 》 1    index = 3 要是删除后仍然选中2 就--
            [1,3,2,4]

    */


//缓存到localStorage
export const saveSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

//删除一个
export const deleteSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

//清空
export const clearSearchHistory = function({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}


//删除一首歌
export const deleteSong = function({ commit, state }, song) {
    let playlist = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)

    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playlist.length) { //播放歌曲再删除歌曲的后面,或者是最后已首歌
        currentIndex--;
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    //播放列表是否空了，不播放歌曲
    const playingState = playlist.length > 0;
    commit(types.SET_PLAYING_STATE, playingState)
}


//删除所有歌曲
export const deleteSongList = function({ commit }) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

//收藏列表
export const saveFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}