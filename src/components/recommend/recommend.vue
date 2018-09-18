<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data="songList" ref="scroll">
      <!--注意当数据未渲染,元素高度为0,无法滚动, 所以需要监听data(songList)的变化-->
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <!--注意此处添加v-if判断recommends是否已经赋值成功,以保证slot有内容,为后续的添加className,和计算宽度等做处理-->
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单</h1>
          <ul>
            <li v-for="item in songList" class="item" :key="item.id">
              <div class="icon">
                <img v-lazy="item.picUrl" width="60" height="60" @load="loadImage">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.songListDesc"></h2>
                <p class="desc" v-html="item.songListAuthor"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length"></div>
      <loading></loading> <!--loading等待-->
    </Scroll>
  </div>
</template>

<script>
  import {getRecommend} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import Slider from '../../base/slider/slider.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        songList: []
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    },
    created() { // 数据获取一般在created 时获取
      this._getRecommend()
    },
    methods: {
      handlePlaylist(playlist) { // 当页面的播放组件调用后 就要重新设置底部宽度,以及重新刷新scroll
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
//            console.log(res)
            this.recommends = res.data.slider
            this.songList = res.data.songList
//            console.log(this.recommends)
          }
        })
      },
      loadImage() {
        if (!this.checkloaded) { // 判断第一张图片已加载完成
          this.$refs.scroll.refresh()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
