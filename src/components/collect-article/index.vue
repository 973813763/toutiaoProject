<template>
  <van-button
    :icon="value ? 'star':'star-o'"
    :class="{collected:value}"
    :loading='loading'
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/API/article'
export default {
  name: 'CollectArticle',
  //   model: {
  // props:"collect-",
  // event:'change'
  //   },

  props: {
    // model默认值是 value
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  created () {

  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        // 自定义事件修改数据不是立即的
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('收藏失败')
      }
      this.loading = false
    }
  }

}
</script>

<style lang="scss" scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
.van-button {
  border: unset;
  margin-left: 10px;
}
</style>
