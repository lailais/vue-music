<template>
  <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSingerDetail} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import {mapGetters} from 'vuex'
  //
  export default {
    computed: {
            title() {
              return this.singer.singer_name
            },
            bgImage() {
              return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singer.singer_mid}.jpg?max_age=2592000`
            },
      ...mapGetters([
        'singer' // 获取当前歌手
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
//      console.log(this.singer)
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.singer_id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.singer_id).then((res) => { // 通过当前歌手的singer_id请求
          if (res.code === ERR_OK) {
//            console.log(res.data)
            this.songs = this._normalizeSongs(res.data.list) // 获取经过处理的该歌手的所有歌曲详情
//            console.log(this.songs)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      _normalizeSongs(list) { // 处理歌曲列表
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData)) // 调用createSong,实例化歌曲对象(工厂模式)
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
