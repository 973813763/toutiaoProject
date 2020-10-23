<template>
  <div>
  <!-- 路由出口 -->
    <router-view/>
    <h1>头条11</h1>
    <div>
      <i class="iconfont icon-dianzan"></i>
    </div>
    <van-button type="primary">主要按钮</van-button>
      <van-button type="info">信息按钮</van-button>
      <van-button type="default">默认按钮</van-button>
      <van-button type="warning">警告按钮</van-button>
      <van-button type="danger">危险按钮</van-button>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>

</style>
