import originJsonp from 'jsonp'

/**
 * url 初始地址
 * data 数据，拼接到url上
 * option 
 */
export default function jsonp(url, data, option) {
    // 判断url是否有？号
    url += ((url.indexOf('?') < 0) ? '?' : "&") + param(data);

    return new Promise((resolve, reject) => {
        originJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

/**
 * 往url上拼接数据
 */
function param(data) {
    let url = "";
    for (var key in data) {
        let value = (data[key] !== undefined) ? data[key] : "";
        url += `&${key}=${encodeURIComponent(value)}`
    }
    // url有值时删除第一个&符号
    return url ? url.substring(1) : "";
}