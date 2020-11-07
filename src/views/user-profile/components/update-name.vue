<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right='onComfirm'
    />
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>``

<script>
import { updateUserProfile } from '@/API/user'
export default {
  name: 'UpdateName',
  props: {
    user: {
      type: [String, Number],
      required: true
    }
  },
  components: {},
  data () {
    return {
      localName: this.user
    }
  },
  created () {},
  methods: {
    async onComfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 设置为背景不可点击
        duration: 0 // 持续展示时间
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({ name: localName })
        //  更新视图
        this.$emit('editUserName', localName)
        // 关闭弹层
        // this.$emit('close')
        // 提示信息
        this.$toast.success('更新成功')
      } catch (err) {
        if (err.response.status === 409) {
          this.$toast('用户名已存在，请更换')
          return
        }
        this.$toast('更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.field-wrap {
  padding: 20px;
}
</style>
