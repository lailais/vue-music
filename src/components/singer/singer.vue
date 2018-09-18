<template>
  <div class="singer" ref="singer">
    <ListView :data="map" @select="selectSinger" ref="list"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSinger} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import ListView from '../../base/listview/listview.vue'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singerList: [],
        hotSinger: [],
        resSinger: [],
        map: []
      }
    },
    components: {
      ListView
    },
    created() { // 数据获取一般在created 时获取
      this._getSinger()
    },
    methods: {
      handlePlaylist(playlist) { // 当页面的播放组件调用后 就要重新设置底部宽度,以及重新刷新scroll
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getSinger() {
        getSinger().then((res) => {
          let num1 = res.indexOf('(')
          let num2 = res.length - 1
          let resultData = JSON.parse(res.substring(num1 + 1, num2))
          if (resultData.code === ERR_OK) {
            this.singerList = resultData.singerList.data.singerlist
//            console.log(this.singerList)
            this.resultArray()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      resultArray() {
        let arr = []
        for (let i = 0; i < this.singerList.length; i++) {
          if (i < 10) {
            this.hotSinger.push(this.singerList[i])
          }
          arr.push(this.singerList[i].singer_name)
        }
        arr.sort(
          function compareFunction(param1, param2) { // 按拼音排序
            return param1.localeCompare(param2, 'zh')
          }
        )
        for (let i = 0; i < arr.length; i++) {
          var x = this.singerList.find((item) => arr[i] === item.singer_name)
          this.resSinger.push(x)
        }
        this.map = [
          {
            title: '热门歌手',
            group: this.hotSinger
          },
          {
            title: '其他歌手',
            group: this.resSinger
          }
        ]
//        console.log(this.map)
//        console.log(this.resSinger)
//        console.log(this.hotSinger)
      },
      selectSinger(singer) {
//        console.log(singer)
        this.$router.push({
          path: `/singer/${singer.singer_id}`
        })
        this.setSinger(singer) // 传入当前被点击的歌手
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
