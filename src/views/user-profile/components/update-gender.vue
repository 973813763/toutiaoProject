<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :default-index="UserGender"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerGender"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/API/user'
export default {
  name: 'UptateGender',
  props: {
    UserGender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.UserGender
    }
  },
  created () {

  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        duration: 0, // 持续展示时间
        forbidClick: true // 禁止背景点击
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({ gender: localGender })
        this.$emit('editUserGender', localGender)
        // this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
    },
    onPickerGender (picker, value, index) {
      this.localGender = index
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
