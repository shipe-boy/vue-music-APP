import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getSingerList() {
    const url = 'http://c.y.qq.com/v8/fcg-bin/v8.fcg';

    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        // g_tk: 1664029744,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })

    return jsonp(url, data, options)
}

//新接口 
export function getSingers() {
    const url = '/api/getSingers';

    const data = Object.assign({}, commonParams, {
        g_tk: 1665723276,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: { "comm": { "ct": 24, "cv": 0 }, "singerList": { "module": "Music.SingerListServer", "method": "get_singer_list", "param": { "area": -100, "sex": -100, "genre": -100, "index": -100, "sin": 0, "cur_page": 1 } } }
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        console.log(err);
    })
}

//歌手详情
export function getSingerDetial(id) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 80,
        songstatus: 1,
        singermid: id
    })

    return jsonp(url, data, options)
}