// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'

//引入vuex
import store from './store'

Vue.config.productionTip = false

import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload';

fastClick.attach(document.body)
Vue.use(VueLazyload, {
    loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})