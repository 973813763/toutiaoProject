<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading='loading'
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading='loading'
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/API/user'
export default {
  name: 'followUser',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, Object, String],
      required: true
    }
  },
  components: { },
  data () {
    return {
      loading: false
    }
  },
  watch: {},
  created () {},
  methods: {
    // 关注按纽
    async onFollow () {
      // 开启按钮的 loading 状态
      this.loading = true
      try {
        if (this.isFollowed) {
          // 如果已关注，则取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 否则添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('unpate-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '不能关注自己'
        }
        this.$toast(message)
      }
      // 关闭按钮的 loading 状态
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
