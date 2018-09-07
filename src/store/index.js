import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
import createLogger from 'vuex/dist/logger' // 可在控制台查看state修改历程

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 线下调试时(开发时),检测是否直接修改state  耗性能,上线不建议使用

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
