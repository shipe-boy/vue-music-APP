//给某个元素添加class
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }

    let newClass = el.className.split(' ');
    newClass.push(className)
    el.className = newClass.join(' ');
}

//判断元素是否有class
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}

//元素上设置或获取属性
export function getData(el, name, val) {
    const prefix = 'data-';
    if (val) {
        return el.setAttribute(prefix + name, val)
    } else {
        return el.getAttribute(prefix + name);
    }
}

let elementStyle = document.createElement('div').style;
//查看浏览器是什么
let vender = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        standard: 'transform'
    }

    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    }

    return false;
})();

export function prefixStyle(style) {
    if (vender === false) {
        return false;
    }

    if (vender === 'standard') {
        return style;
    }
    // console.log(vender + style.charAt(0).toUpperCase() + style.substr(1))
    //加上前缀并且驼峰命名
    return vender + style.charAt(0).toUpperCase() + style.substr(1);
}