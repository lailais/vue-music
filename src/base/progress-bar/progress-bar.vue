<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      > <!--prevent阻止事件捕获-->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16 // 小球直径
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        touch: {}
      }
    },
    methods: {
      progressTouchStart(e) {
//        console.log(e)
//        console.log(e.touches)
//        console.log(e.touches[0].pageX)
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX // 当前点击事件对象的距离页面左边距离
        this.touch.left = this.$refs.progress.clientWidth // 小球移动之前的已播放进度长度
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) { // 确保点击开始
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 开始点击位置到当前拖动位置距离
        // e.touches[0]表示一根手指
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)) // 根据小球移动距离设置已播放进度的长度,及限制最大长度为(进度条总长-小球直径),,同时也要设置小球本身的偏移
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent() // 小球拖动结束后 处理父组件的音乐播放进度
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
//         this._offset(e.offsetX)
        this._triggerPercent()
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth // 当前播放进度长度/播放进度总长
        this.$emit('percentChange', percent)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px` // 已播放进度长度
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)` // 小球偏移
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 获取进度条总长
          const offsetWidth = newPercent * barWidth // 获取当前进度
          this._offset(offsetWidth) // 设置进度条和小球的位置
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
