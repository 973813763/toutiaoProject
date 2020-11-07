<template>
  <div class="uphoto-photo">
    <img
      :src="img"
      class="img"
      ref="img"
    >

    <div class="toolbar">
      <div
        class="cancel"
        @click="$emit('colse')"
      >取消</div>
      <div
        class="confirm"
        @click="onConfirm"
      >确定</div>
    </div>

  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/API/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  components: {

  },
  data () {
    return {
      cropper: null
    }
  },
  created () {

  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 查看模式: 1：限制裁切框不要超过画布的大小。 0： 没有限制
      dragMode: 'move', // 拖到模式：移动画布
      aspectRatio: 1, // 纵横比例： 头像缩放比例1：1
      autoCropArea: 1, // 自动裁剪区： 定义自动裁剪区域的大小
      cropBoxMovable: false, // 固定裁剪区图框
      cropBoxResizable: false, // 可调整裁剪框大小
      background: false // 背景禁用
      // movable: true // 启用移动图像。 默认是true
      // 图片配置地址
      // https://github.com/fengyuanchen/cropperjs#getcroppedcanvasoptions
    })
    // console.log('cropper', cropper)
  },
  methods: {
    onConfirm () {
      // console.log(this.cropper.getData())
      // 基于服务端的裁切，则使用：getData 方法
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        duration: 0,
        forbidClick: true

      })
      try {
        // 如果 Content-Type 要求是 application/json，则 data 传普通对象 {}
        // 如果 Content-Type 要求是 multipart/form-data，则 data 传 FormData 对象
        // 一般只有涉及到文件上传的数据接口才要求Content-Type 要求是multipart/form-data
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        console.log('onConfirm -> data', data)
        // 关闭弹层
        this.$emit('colse')
        // 更新视图
        this.$emit('uphoto-photo', data.data.photo)
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err.response.status === 507)
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uphoto-photo {
  height: 100%;
  background-color: #000;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      align-items: center;
      justify-content: center;
      display: flex;
      color: #fff;
    }
  }
}

.img {
  display: block;
  max-width: 100%;
}
</style>
