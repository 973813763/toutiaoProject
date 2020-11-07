<template>
  <div class="layout-container">
    <!-- 子路由 -->
    <router-view />

    <!-- 标签导航栏 -->
    <!-- router 开启路由模式 -->
    <van-tabbar
      class="layout-tabbar"
      route
    >
      <van-tabbar-item to='/'>
        <i
          slot="icon"
          class="iconfont icon-shouye"
        ></i>
        <span class='text'>首页</span>
      </van-tabbar-item>
      <van-tabbar-item to='/qa'>
        <i
          slot="icon"
          class="iconfont icon-wenda"
        ></i>
        <span class='txet'>问答</span>
      </van-tabbar-item>
      <van-tabbar-item to='/video'>
        <i
          slot="icon"
          class="iconfont icon-shipin"
        ></i>
        <span class='txet'>视频</span>
      </van-tabbar-item>
      <van-tabbar-item to='/my'>
        <i
          slot="icon"
          class="iconfont icon-wode"
        ></i>
        <span class='txet'>{{$store.state.user ? '我的' : '未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  data () {
    return {
    }
  },
  mounted () {
    this.$store.commit('addCachePage', 'layoutIndex')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  .layout-tabbar {
    i.iconfont {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
