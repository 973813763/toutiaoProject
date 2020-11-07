<template>
  <div class="my-container">

    <!-- 已登录头部 -->
    <div
      v-if="user"
      class="header user-info"
    >
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button
            size="mini"
            round
            to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录头部 -->
    <div
      v-else
      class="header not-login"
    >
      <div
        class="login-btn"
        @click="$router.push({
          name:'login',
          query:{
            redirect:'/my'
          }
        })"
      >
        <img
          class="mobile-img"
          src="~@/assets/mobile.png"
          alt=""
        >
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航  -->
    <van-grid
      class="grid-nav mb-9"
      :column-num="2"
      clickable
      :border='false'
    >
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="iconfont icon-shoucang"
        ></i>
        <span
          slot="text"
          class="text"
        >收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i
          slot="icon"
          class="iconfont icon-lishi"
        ></i>
        <span
          slot="text"
          class="text"
        >历史</span>
      </van-grid-item>

    </van-grid>

    <van-cell
      is-link
      title="消息通知"
    />
    <van-cell
      is-link
      class="mb-9"
      title="小智同学"
    />
    <van-cell
      v-if="user"
      title="退出登录"
      class="loginout-cell"
      clickable
      @click="onLoginout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/API/user'
export default {
  name: 'myIndex',
  data () {
    return {
      // 初始化用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 获取用户信息
    if (this.$store.state.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    // 退出登录
    onLoginout () {
      // 1、退出提示
      this.$dialog.confirm({
        title: '确认退出'
      })
        .then(() => {
          // on confirm
          // 确认退出，清除登录状态(容器的 token值 和本地的 设为空)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('已取消')
        })
    },
    // 获取用户所有信息
    async loadUserInfo () {
      try {
        const { data: res } = await getUserInfo()

        this.userInfo = res.data
        // console.log('loadUserInfo -> userInfo', this.userInfo)
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
.my-container {
  .header {
    height: 366px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      span.text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      // background-color: skyblue;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          height: 132px;
          width: 132px;
          border: 4px solid #fff;
          margin-right: 22px;
        }
        .name {
          font-size: 29px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav,
  mb-9 {
    .grid-item {
      padding-bottom: 9px;
      height: 141px;
      position: relative;
      //  .grid-item :first-children:after {
      //     position: absolute;
      //     right: 0;
      //     top: 19px;
      //     content: " ";
      //     background: red;
      //     width: 19px;
      //     height: 300px;
      //     display: block;
      //   }
      i.iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 27px;
      }
    }
  }
  .loginout-cell {
    text-align: center;
    font-size: 29px;
    color: #d86262;
    margin-top: 9px;
  }
}
</style>
