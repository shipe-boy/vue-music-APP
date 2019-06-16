import axios from 'axios'
import { commonParams } from './config'


// 获取vkey
export function getUrl(songid) {
    // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    const url = '/api/vkey'

    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq.json',
        format: 'json',
        data: {
            "req": {
                "module": "CDN.SrfCdnDispatchServer",
                "method": "GetCdnDispatch",
                "param": {
                    "guid": "417935244",
                    "calltype": 0,
                    "userip": ""
                }
            },
            "req_0": {
                "module": "vkey.GetVkeyServer",
                "method": "CgiGetVkey",
                "param": {
                    "guid": "417935244",
                    "songmid": [songid],
                    "songtype": [0],
                    "uin": "0",
                    "loginflag": 1,
                    "platform": "20"
                }
            },
            "comm": { "uin": 0, "format": "json", "ct": 24, "cv": 0 }
        }
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        // console.log(res.data.req_0.data.midurlinfo[0].purl)
        let url = res.data.req_0.data.midurlinfo[0].purl;
        return Promise.resolve("http://isure.stream.qqmusic.qq.com/" + url)
            // return "http://isure.stream.qqmusic.qq.com/" + url;
    }).catch((err) => {
        console.log(err);
    })
}


export function getLyric(mid) {
    const url = '/api/lyric';

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: new Date(),
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        platform: 'yqq.json',
        needNewCode: 0
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log(err);
    })
}