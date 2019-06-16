import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey() {
    const url = '/api/getHotKey';

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
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(err => {
        console.log(err)
    })
}

export function search(query, page, zhida, pagesize) {
    const url = '/api/search';

    const data = {
        w: query,
        p: page,
        catZhida: zhida ? 1 : 0,
        perpage: pagesize,
        n: pagesize,
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: "txt.mqq.all"
    }

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(err => {
        console.log(err)
    })
}