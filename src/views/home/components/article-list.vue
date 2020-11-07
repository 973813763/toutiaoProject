<template>
  <div
    class="article-list"
    ref="article-list"
  >
    <!-- 刷新 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-duration='1500'
      :success-text="isRefreshSuccesstext"
      @refresh="onRefresh"
    >
      <!-- 文章列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article,index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article,index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/API/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    // 注册组件，再去使用
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 是否加载失败
      isRefreshLoading: false, // 刷新数据状态
      isRefreshSuccesstext: '', // 刷新数据提示
      scrollTop: 0 // 列表滚动到顶部的距离

    }
  },
  created () {

  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    // 把记录到顶部的距离重新设置回去
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    // 请求获取数据
    async onLoad () {
      // 请求数据
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // ... 数组的展开操作符，它会把元素一个一个拿出来
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
          this.finished = true
        }
      } catch (err) {
        // 请求失败，loading关闭
        this.loading = false
        // 展示错误提示状态
        this.err = true
      }
    },
    // 刷新数据
    async onRefresh () {
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        const { results } = res.data
        this.list.unshift(...results)
        this.isRefreshLoading = false
        this.isRefreshSuccesstext = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        console.log('刷新失败', err)
        this.isRefreshLoading = false
        this.isRefreshSuccesstext = '刷新失败'
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
