import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
import { commonParams, options } from 'api/config'
import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { getUrl, getLyric } from 'api/song'


export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then(res => {
                // console.log(res)
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric);
                    // console.log(this.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })

    }

}

export function createSong(musicData, url) {
    // console.log(musicData)
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: fillterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        //歌曲图片地址
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        //歌曲地址
        url: url
    })

}

//musicData.singer 是一个对象，我们只要里面的name
function fillterSinger(singer) {
    let ret = [];
    if (!singer) {
        return ''
    }
    singer.forEach(item => {
        ret.push(item.name) //歌手名字
    });
    return ret.join('/') //多人唱时 / 分开
}