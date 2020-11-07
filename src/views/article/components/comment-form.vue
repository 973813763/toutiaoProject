
<template>
  <div class="comment-form">
    <van-field
      class="popup-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      type="btn"
      class="popup-btn"
      :disabled='!message.length'
      @click="onReleaseComment"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/API/comment'
export default {
  name: 'CommentForm',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  // inject: ['articleId'],
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  components: {},
  computed: {},
  watch: {

  },
  data () {
    return {
      message: ''
    }
  },
  created () {

  },
  methods: {
    async onReleaseComment () {
      // 发布提示
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0，则持续展示
      })

      try {
        const { data: res } = await addComment({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // 关闭发布评论的弹层
        // 将最新发布的评论展示到列表的顶部
        // 更新文章评论的总数量
        // 清空文本框
        this.message = ''
        // 传给父组件操作
        this.$emit('post-success', res.data)
        this.$toast.success('发布成功')
        // console.log('onReleaseComment -> res', res)
      } catch (err) {
        console.log(err.response)
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-form {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .popup-field {
    background-color: rgb(213, 220, 223);
  }
  .popup-btn {
    padding: 0;
    font-size: 10px;
    width: 150px;
    border: none;
    color: #6ba3d8;
    background-color: #fff;
  }
}
</style>
