import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { random } from 'common/js/util'


export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    activated() { //keep-alive 组件激活时调用。
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList() { //组件中要定义此方法来覆盖它，否则调用他
            throw new Error('component must implement handlePlaylist method')
        }
    }
}


//player和play-list的共享逻辑
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? "icon-sequence" : this.mode === playMode.loop ? "icon-loop" : "icon-random"
        },
        ...mapGetters([
            'playList',
            'sequenceList',
            'currentSong',
            'mode',
            'favoriteList'
        ])
    },
    methods: {
        changeMode() { //切换播放模式
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = random(this.sequenceList)
            } else {
                list = this.sequenceList;
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list);
        },
        resetCurrentIndex(list) { //重新打乱播放列表时，选中歌曲的下标不变时当前播放歌曲一定不一样了
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            })
            this.setCurrentIndex(index);
        },
        toggleFavorite(song) {
            if (this.isFavorite(song)) {
                this.deleteFavoriteList(song)
            } else {
                this.saveFavoriteList(song)
            }
        },
        getFavoriteIcon(song) {
            if (this.isFavorite(song)) {
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        isFavorite(song) {
            let index = this.favoriteList.findIndex((item) => {
                return item.id === song.id;
            })
            return index > -1
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
}


//add-song和search
export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        blurInput() {
            this.$refs.searchBox.blur();
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        onQueryChange(query) {
            this.query = query;
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])
    }
}