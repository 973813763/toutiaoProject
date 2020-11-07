import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const tokenKey = 'TOUTIAO__USER'
export default new Vuex.Store({
  state: {
    // 对象，存储当前登录的用户信息 （token等数据）
    // user: JSON.parse(window.localStorage.getItem(tokenKey))
    user: getItem(tokenKey),
    cachePages: ['layoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止数据丢失，我们需要把数据备份到本地存储
      // window.localStorage.setItem(tokenKey, JSON.stringify(state.user))
      setItem(tokenKey, state.user)
    },
    // 添加缓存页面
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
