//入口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//开发环境下使用检测是不是mutations修改的
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    //严格模式，开发环境下使用检测是不是mutations修改的
    strict: debug,
    plugins: debug ? [createLogger()] : []
})