<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="item in dots" :key="item" :class="{active: currentPageIndex === (item-1) }"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    props: {
      loop: { // 是否轮播
        type: Boolean,
        default: true
      },
      autoPlay: { // 是否自动轮播
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000 // 轮播间隔
      }
    },
    data() {
      return {
        dots: 0,
        currentPageIndex: 0,
        slide: null
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots() // 初始化dots必须在初始化轮播前,因为轮播初始化后将添加前后两个元素
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 20) // 延迟20ms 以保证页面渲染完成,也可以用this.$next

      window.addEventListener('resize', () => { // window是否调用resize
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true) // 第二次调用_setSliderWidth不需要重新拷贝前后两元素
        this.slider.refresh() // 刷新轮播
      })
    },
    activated() { // keep-alive组件激活时调用。该钩子在服务器端渲染期间不被调用
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() { // keep-alive组件停用时调用。该钩子在服务端渲染期间不被调用
      clearTimeout(this.timer)
    },
    beforeDestroy() { // 实例销毁之间调用。在这一步，实例仍然完全可用。该钩子在服务端渲染期间不被调用。
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(flag) { // 设置轮播的宽度
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i] // 给每张轮播图片添加class,统一样式
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !flag) { // 前后各加一张图片的宽度
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px' // 给sliderGroup强行添加宽度,以保证better-scroll的使用
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true, // 横向滚动
          scrollY: false, // 不允许纵向滚动
          momentum: false, // 当快速滑动时是否开启滑动惯性
          snap: { // 该属性是给 slider 组件使用的，普通的列表滚动不需要配置 (新版写法) better-scroll可自动添加前后连张图片
            loop: this.loop, // 是否可以无缝循环轮播
            threshold: 0.3, // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的
            speed: 400 // 轮播图切换的动画时间
          },
          click: true
        })

        this.slider.on('scrollEnd', () => { // scrollEnd是better-scroll的事件
          let pageIndex = this.slider.getCurrentPage().pageX // 返回当前滚动的下标
//          if (this.loop) { // 因为是循化无缝轮播,当前真正的下标,应该是,减一后的结果,,当前是新版不需要减一
//            pageIndex -= 1
//          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            this._play()
          }
        })

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _initDots() {
        this.dots = this.children.length // 初始化滚动前的元素还未拷贝,当前长度为期待长度
      },
      _play() {
//        let pageIndex = this.currentPageIndex + 1
//        this.timer = setTimeout(() => {
//          this.slider.goToPage(pageIndex, 0, 400) // better-scroll提供的goToPage  老版本
//        }, this.interval)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
