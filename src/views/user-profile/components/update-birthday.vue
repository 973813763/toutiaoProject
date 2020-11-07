<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/API/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    UserBirthday: {
      type: String,
      required: true
    }
  },
  components: {},
  data () {
    return {
      minDate: new Date(1970, 12, 31),
      maxDate: new Date(2070, 12, 31),
      currentDate: new Date()
    }
  },
  created () {

  },
  methods: {
    async onConfirm (value) {
      this.$toast.loading({
        message: '保存中...',
        duration: 0,
        forbidClick: true
      })
      try {
        const currentDate = dayjs(value).format('YYYY-MM-DD')
        console.log('onConfirm -> currentDate', currentDate)

        await updateUserProfile({ birthday: currentDate })
        this.$emit('UserBirthday', currentDate)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err.response)
        this.$toast.fail('更新失败')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
