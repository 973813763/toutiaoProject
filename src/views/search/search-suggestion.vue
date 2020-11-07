<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item,index) in suggestions"
      :key="'search'+index"
      @click="$emit('search',item)"
    >
      <div
        slot="title"
        v-html="highlight(item)"
      ></div>
    </van-cell>

  </div>
</template>

<script>
import { getCearchSuggestions } from '@/API/search'
import { debounce } from 'lodash' // 按需加载 ，有利于打包结果优化
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      requeired: true
    }
  },
  components: {

  },
  computed: { },
  data () {
    return {
      // 数据列表
      suggestions: [],
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  watch: {
    searchText: {
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val)
      }, 200),
      // handler (val) {
      //   this.loadSearchSuggestion(val)
      // },
      immediate: true
    }
  },
  created () {

  },
  methods: {
    async loadSearchSuggestion (p) {
      try {
        const { data: res } = await getCearchSuggestions(p)
        this.suggestions = res.data.options
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    },
    // 高亮
    highlight (item) {
      const highlightStr = `<span class="acticle">${this.searchText}</span>`
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      const reg = new RegExp(this.searchText, 'gi')
      return item.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-suggestion {
  /deep/ .acticle {
    color: #3296fa;
  }
}
</style>
