<template>
  <div>
    <!-- keep-alive 是路由缓存的意思 https://cn.vuejs.org/v2/guide/components-dynamic-async.html -->
    <keep-alive :include="cachePages">
      <!-- 路由出口 -->
      <router-view />
    </keep-alive>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="scss" scoped>
</style>
