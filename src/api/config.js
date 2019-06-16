//配置请求地址的公共参数
export const commonParams = {
    // g_tk: 5381,
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
}

//配置jsonp的回调函数名
export const options = {
    param: 'jsonpCallback'
}

//返回的状态吗
export const ERR_OK = 0;