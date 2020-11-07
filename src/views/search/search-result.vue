<template>
  <div class="search-result">
    <van-list
      title="搜索结果"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync='error'
      error-text='加载失败，请点击重试 '
      @load="onLoad"
    >
      <van-cell
        v-for="(article,index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>

  </div>
</template>

<script>
import { getCearchResult } from '@/API/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      requeired: true
    }
  },
  components: { },
  computed: { },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perpage: 20
    }
  },
  created () {

  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data: res } = await getCearchResult(
          {
            page: this.page,
            per_page: this.perpage,
            q: this.searchText // 查询关键字
          })

        // if (Math.random() > 0.5) {
        //   JSON.parse('fdbaa') // 测试代码
        // }

        // 2. 将数据添加到列表中
        const { results } = res.data
        this.list.push(...results)
        // 3. 设置加载状态结束
        this.loading = false
        // 4. 判断数据是否加载完毕
        if (results.length) {
          // 更新获取下一页数据的页码
          this.page++
        } else {
          // 没有数据了，将加载状态设置结束，不再 onLoad
          this.finished = true
        }
        // console.log('onLoad -> res', res)
      } catch (err) {
        // 展示加载失败提示状态
        this.error = true
        // 加载失败了，loading 关闭
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
