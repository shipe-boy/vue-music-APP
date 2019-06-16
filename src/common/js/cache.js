//localStorage  相关逻辑
import storage from 'good-storage'

const SEARCH_KEY = "__search__";
const SEARCH_MAC_LENGTH = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__FAVORITE__';
const FAVORITE_MAX_LENGTH = 200;

//设置
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);
    insetArr(searches, query, (item) => {
        return item === query
    }, SEARCH_MAC_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches;
}

function insetArr(arr, val, compare, maxlen) {
    // conpare  比较函数
    const index = arr.findIndex(compare);
    if (index === 0) { //第一条数据
        return
    }
    if (index > 0) { //之前数据删除,插入第一条
        arr.splice(index, 1);
    }
    arr.unshift(val)

    if (maxlen && arr.length > maxlen) { //数组长度
        arr.pop();
    }
}

function deleteArr(arr, compare) {
    const index = arr.findIndex(compare);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

//获取本地存储
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

//删除
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);
    deleteArr(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches;
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return [];
}

//设置播放历史
export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, []);
    insetArr(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs)
    return songs
}
//获取
export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}


export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, []);
    insetArr(songs, song, (item) => {
        return song.id === item.id;
    }, FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY, songs)
    return songs
}
export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, []);
    deleteArr(songs, (item) => {
        return song.id === item.id;
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}
export function loadFavorite() {
    return storage.get(FAVORITE_KEY, []);
}