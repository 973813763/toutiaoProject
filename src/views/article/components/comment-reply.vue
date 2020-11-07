<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count >0 ? `${comment.reply_count}条评论`:'暂无评论' ">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('close')"
      />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论 -->
      <comment-item :comment='comment' />
      <!-- 当前评论 -->

      <!--评论回复列表  -->
      <van-cell title="全部回复" />
      <comment-list
        :list="commentList"
        :source='comment.com_id'
        type='c'
      />
    </div>

    <!-- 底部区域 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        round
        size="small"
        @click='isPopupShow=true'
      >写评论</van-button>
    </div>

    <!-- 发布评论 -->
    <van-popup
      v-model='isPopupShow'
      position="bottom"
    >
      <comment-form
        :target="comment.com_id"
        @post-success="onPostSuccuss"
      />
    </van-popup>
    <!-- 发布评论 -->

  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentForm from './comment-form'
export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    CommentForm
  },
  computed: {},
  data () {
    return {
      isPopupShow: false,
      commentList: []

    }
  },
  created () {},
  methods: {
    onPostSuccuss (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPopupShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
