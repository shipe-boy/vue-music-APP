import Vue from 'vue'
import Router from 'vue-router'

/* import Recommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Search from '../components/search/search'
import Rank from '../components/rank/rank'
import SingerDetial from '../components/singer-detial/singer-detial'
import Disc from '../components/disc/disc'
import RankSong from '../components/rank-song/rank-song'
import UserCenter from '../components/user-center/user-center' */

Vue.use(Router)

//Webpack实现路由懒加载
const Recommend = (reslove) => {
    import ('../components/recommend/recommend').then(module => {
        reslove(module)
    })
}
const Singer = (reslove) => {
    import ('../components/singer/singer').then(module => {
        reslove(module)
    })
}
const Search = (reslove) => {
    import ('../components/search/search').then(module => {
        reslove(module)
    })
}
const Rank = (reslove) => {
    import ('../components/rank/rank').then(module => {
        reslove(module)
    })
}
const SingerDetial = (reslove) => {
    import ('../components/singer-detial/singer-detial').then(module => {
        reslove(module)
    })
}
const Disc = (reslove) => {
    import ('../components/disc/disc').then(module => {
        reslove(module)
    })
}
const RankSong = (reslove) => {
    import ('../components/rank-song/rank-song').then(module => {
        reslove(module)
    })
}
const UserCenter = (reslove) => {
    import ('../components/user-center/user-center').then(module => {
        reslove(module)
    })
}




export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            name: 'recommend',
            component: Recommend,
            children: [{
                path: ':id',
                component: Disc
            }]
        },
        {
            path: '/singer',
            name: 'singer',
            component: Singer,
            children: [{
                path: ':id',
                component: SingerDetial
            }]
        },
        {
            path: '/rank',
            name: 'rank',
            component: Rank,
            children: [{
                path: ":id",
                component: RankSong
            }]
        },
        {
            path: '/search',
            name: 'search',
            component: Search,
            children: [{
                path: ':id',
                component: SingerDetial
            }]
        }, {
            path: '/user',
            component: UserCenter
        }
    ]
})