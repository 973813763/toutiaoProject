<template>
  <div class="ChannelEdit">
    <!-- 频道编辑 -->
    <van-cell :border='false'>
      <div
        slot="title"
        class='title-text'
      >我的频道</div>
      <van-button
        type="danger"
        size="mini"
        plain
        round
        class="edit-btn"
        @click="isEdit=!isEdit"
      >{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid
      :gutter="10"
      class="my-grid"
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel,index)"
      >
        <van-icon
          v-show="isEdit && !fiexdChannenls.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span
          class="text"
          slot="text"
          :class="{active:index===active}"
        >{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <!--频道推荐  -->
    <van-cell :border='false'>
      <div
        slot="title"
        class='title-text'
      >频道推荐</div>
    </van-cell>
    <van-grid
      :gutter="10"
      class="recommend-grid"
    >
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="addChannel(channel)"
      />
    </van-grid>

  </div>
</template>
 v-show="isEdit"
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/API/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  components: {

  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fiexdChannenls: [0] // 固定数组，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),

    recommendChannels () {
      // filter 数组遍历方法，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // find 也是遍历方法，把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数据，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 获取所有所有数据列表
    async loadAllChannels () {
      try {
        const { data: res } = await getAllChannels()
        this.allChannels = res.data.channels
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    // 从推荐频道添加到我的频道
    async addChannel (channel) {
      this.myChannels.push(channel)

      if (this.user) {
        // 已登录，把数据存储到线上
        try {
          // 处理数据持久化
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('数据存储失败，请稍后重试')
        }
      } else {
        // 未登录，数据存储到本地
        setItem('toutiao_channels', this.myChannels)
      }
    },
    // 从我的频道移除到推荐频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1.如果是固定频道，就不删除
        if (this.fiexdChannenls.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 3.如果是编辑状态，则执行删除频道操作
        if (index <= this.active) {
          this.$emit('undate-active', this.active - 1, true)
        }
        // 4.处理持久化删除
        this.deleteChannel(channel)
      } else {
        // 如果是非编辑状态，则执行切换频道操作
        this.$emit('undate-active', index, false)
      }
    },
    // 删除数据
    async deleteChannel (channel) {
      try {
        if (this.user) {
        // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
        // 未登录，将数据存储到本地
          setItem('toutiao_channels', this.myChannels)
        }
      } catch (err) {
        this.$slots('删除频道数据失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ChannelEdit {
  padding: 87px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background: #f4f5f6;
      .van-grid-item__text,
      .text {
        color: #222222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 24px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
