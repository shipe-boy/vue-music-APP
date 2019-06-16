import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getRankList() {
    const url = '/api/getRankList';

    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1
    }

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log(err);
    })
}

export function getMusicList(id) {
    const url = '/api/getMusicList'

    let a = {

    }

    const data = Object.assign({}, commonParams, {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: {
            "detail": {
                "module": "musicToplist.ToplistInfoServer",
                "method": "GetDetail",
                "param": {
                    "topId": parseInt(id),
                    "offset": 0,
                    "num": 20,
                    "period": "2019-06-15"
                }
            },
            "comm": {
                "ct": 24,
                "cv": 0
            }
        }
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log(err);
    })
}