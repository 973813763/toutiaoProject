<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      fixed
    >
      <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 频道导航栏 -->
    <van-tabs
      class="channel-tabs"
      v-model="active"
      animated
      swipeable
    >
      <van-tab
        v-for="item in channels"
        :key="item.id"
        :title="item.name"
      >
        <!-- 文章列表 -->
        <article-list :channel='item' />
      </van-tab>
      <!-- 占位符 -->
      <div
        slot="nav-right"
        class="placeholder"
      ></div>
      <div
        slot="nav-right"
        class="hamburgerBtn"
        @click="isChannelEditShow=true"
      >
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹框层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels='channels'
        :active="active"
        @undate-active='onUndateActive'
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelList } from '@/API/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/chanel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'homeIndex',
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadChannelList()
  },
  methods: {
    async loadChannelList () {
      try {
        // const { data: res } = await getUserChannelList()
        // this.channels = res.data.channels
        let channels = []
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data: res } = await getUserChannelList()
          channels = res.data.channels
        } else {
          // 未登录 判断是否有本地存储数据列表
          const loadChannels = getItem('toutiao_channels')
          if (loadChannels) {
            // 有就直接赋值用
            channels = loadChannels
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data: res } = await getUserChannelList()
            channels = res.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        console.log('获取频道数据失败')
      }
    },
    onUndateActive (index, isChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  ::v-deep.van-nav-bar__title {
    max-width: unset !important;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    font-size: 27px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 32px;
    }
  }
  ::v-deep .channel-tabs {
    // padding-bottom: 174px;
    .van-tabs__wrap {
      position: fixed;
      z-index: 1;
      top: 92px;
      right: 0;
      left: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background: #3296fa;
      border-radius: 3px;
      bottom: 8px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburgerBtn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background: #ffffff;
      opacity: 0.9;
      i.iconfont {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  // .page-nav-bar {
  //   margin: 0 0px;
  // }
}
</style>
