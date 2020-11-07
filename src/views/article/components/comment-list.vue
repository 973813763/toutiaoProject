<template>

  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error='error'
    error-text='加载失败，请点击重试'
    :immediate-check='false'
    @load="onLoad"
  >
    <comment-item
      v-for="(item,index) in list"
      :key="index"
      :comment='item'
      @reply-click="$emit('reply-click',$event)"
    />
  </van-list>

</template>

<script>
import { getComments } from '@/API/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 简写
      // default: function () {
      //   return []
      // }
    },
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始不会触发loading状态，要手动触发
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      try {
        const { data: res } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          // 如果接收的 id 获取不到东西，就要看是否是id 没有转换成数字 要加toString()
          source: this.source.toString(), // 源id，文章id或评论id ,  得出来的 id 可能 要转换
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 每页大小
        })
        // 如果接收的 id 获取不到东西，就要看是否是id 没有转换成数字 要加toString()
        // console.log('onLoad -> res', res)

        const { results } = res.data
        this.list.push(...results)

        // 把文章评论总数量传递出去
        this.$emit('onload-success', res.data)

        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          // 更新获取下一页数据的页码
          this.offset = res.data.last_id
        } else {
          // 没有数据了，关闭加载更多
          this.finished = true
        }
      } catch (err) {
        // console.log('onLoad -> err', err.response)
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
