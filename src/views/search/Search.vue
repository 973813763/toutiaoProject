<template>
  <div class="search_container">
    <!-- 搜索框 -->
    <form
      class="search-from"
      action="/"
    >
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296FA"
        @search="onSearch"
        @cancel="onCancel"
        @focus='isResultShow=false'
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text='searchText'
    />

    <!-- 连想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text='searchText'
      @search="onSearch"
    />
    <!-- 搜索历史 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @clear-search-history='searchHistories=[]'
      @search='onSearch'
    />
  </div>
</template>

<script>
import SearchHistory from './search-history'
import SearchSuggestion from './search-suggestion'
import SearchResult from './search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'Search',
  props: {},
  computed: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的显示
      searchHistories: getItem('toutiao_search_history') || []
    }
  },
  watch: {
    searchHistories (val) {
      setItem('toutiao_search_history', val)
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  created () {

  },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    // 取消 回到首页
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.search_container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
