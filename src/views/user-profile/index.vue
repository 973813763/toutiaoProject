<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 导航栏 -->

    <!-- 图片上传 -->
    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
    >
    <!-- 个人信息 -->
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow=true"
    />
    <!-- <van-cell
      title="电话"
      :value="user.mobile"
      is-link
    /> -->
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男':'女'"
      is-link
      @click="isUpdateGenderShow=true"
    />
    <van-cell
      title="生日"
      :value="user.birthday=== '' ? '待完善':user.birthday"
      is-link
      @click="isUpdateBirthdayShow=true"
    />
    <!-- 个人信息 -->

    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close='isUpdateNameShow=false'
        @editUserName='editUserName'
        :user="user.name"
      />
    </van-popup>
    <!-- /编辑昵称弹层 -->

    <!-- /编辑性别弹层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isUpdateGenderShow"
        @close='isUpdateGenderShow=false'
        :UserGender="user.gender"
        @editUserGender='localGender'
      />
    </van-popup>
    <!-- /编辑性别弹层 -->

    <!-- /编辑生日弹层 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        :UserBirthday="user.birthday"
        @close='isUpdateBirthdayShow=false'
        @UserBirthday="editUserBirthday"
      />
    </van-popup>
    <!-- /编辑生日弹层 -->

    <!-- 编辑图片弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img='img'
        @colse="isUpdatePhotoShow=false"
        @uphoto-photo='user.photo=$event'
      />
    </van-popup>
    <!-- /编辑图片弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/API/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  props: {},
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 昵称弹层
      isUpdateGenderShow: false, // 性别弹层
      isUpdateBirthdayShow: false, // 生日弹层
      isUpdatePhotoShow: false, // 图片弹层
      img: null // 预览图片
    }
  },
  created () {
    this.loadUserProfile()
  },

  methods: {
    // 更新，获取数据
    async loadUserProfile () {
      try {
        const { data: res } = await getUserProfile()
        this.user = res.data
        // console.log('loadUser -> res', res)
      } catch (err) {
        // console.log(err.response)
        this.$toast('获取信息失败')
      }
    },
    editUserName (newName) {
      this.isUpdateNameShow = false
      this.user.name = newName
    },
    localGender (newGender) {
      this.user.gender = newGender
      this.isUpdateGenderShow = false
    },
    editUserBirthday (newBirthday) {
      this.user.birthday = newBirthday
    },
    // 头像上传
    onFileChange () {
      // 获取文文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发change事件
      // 解决方法： 每次使用完毕，把它的value 清空
      this.$refs.file.value = ''
      // 设置图片的 src
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
