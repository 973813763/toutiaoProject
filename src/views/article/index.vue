<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back(-1)"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div
        v-if="loading"
        class="loading-wrap"
      >
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        v-else-if="article.title"
        class="article-detail"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{article.aut_name}}</div>
          <div
            slot="label"
            class="publish-date"
          >{{article.pubdate | relativeTime}}</div>

          <!-- 模板中的 $event 是事件参数
          当我们传递给子组件的数据既要使用和修改。
          传递：props
          :is-followed='article.is_followed'
          修改:自定义事件
           @unpate-is_followed="article.is_followed=$event"
           简写方式：在组件上使用 v-model
           value = "article.is_followed"
           @input ="article.is_followed=$event"
           如果修改 v-model 的规则名称，可以通过子组件的model属性来配置修改
          -->
          <follow-user
            :is-followed='article.is_followed'
            class="follow-btn"
            :user-id='article.aut_id'
            @unpate-is_followed="article.is_followed=$event"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading='followLoading'
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading='followLoading'
            @click="onFollow"
          >关注</van-button> -->

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref='article-content'
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <comment-list
          :source='article.art_id'
          @onload-success='totalCommentCount=$event.total_count'
          :list='commentList'
          @reply-click='onReplyClick'
        />
        <!-- 文章评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPopupShow=true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :badge="totalCommentCount"
            color="#777"
          />

          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id=article.art_id
          />
          <!-- <van-icon
           color="#777"
            name="star-o"
            /> -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id=article.art_id
          />

          <van-icon
            name="share"
            color="#777777"
          ></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup
          v-model="isPopupShow"
          position="bottom"
        >
          <comment-form
            :target='article.art_id'
            @post-success='onPostSuccess'
          />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div
        v-else-if="errStatus===404"
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div
        v-else
        class="error-wrap"
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close='isReplyShow=false'
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/API/article'
import { ImagePreview } from 'vant'
import followUser from '@/components/follow_user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentForm from './components/comment-form'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentForm,
    CommentReply
  },
  // 给所有的后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据列表详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败的状态
      followLoading: false,
      totalCommentCount: 0, // 评论总数
      isPopupShow: false,
      commentList: [], // 评论数据
      isReplyShow: false, // 评论回复弹框控制
      currentComment: [] // 点击评论回复的那个评论对象
    }
  },
  computed: {

  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 展示loading 加载
      this.loading = true
      try {
        const { data: res } = await getArticleById(this.articleId)
        // console.log('loadArticle -> res', res)
        this.article = res.data

        // 初始化图片预览
        // console.log(this.$refs['article-content'])
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImg()
        }, 0)
        // 请求成功，关闭loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.errStatus === 404) {
          this.errStatus = 404
        }
        this.$toast('获取数据失败，请稍后重试')
      }
      // 无论成功还是失败，都需要关闭loading
      this.loading = false
    },
    // 预览图片
    previewImg () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览图片地址
            images,
            // 预览图片的起始位置，从0 开始
            startPosition: index
          })
        }
      })
    },
    // 子组件传数据过来修改
    onPostSuccess (data) {
      // 关闭发布评论的弹层
      this.isPopupShow = false
      // 将最新发布的评论展示到列表的顶部
      // data.new_obj放到数组里的新对象里（输出面板查看）
      this.commentList.unshift(data.new_obj)
      // 更新文章评论的总数量
    },
    // 回复评论事件
    onReplyClick (comment) {
      // 展示回复评论弹层
      this.isReplyShow = true
      this.currentComment = comment
    }
    // // 关注按纽
    // async onFollow () {
    //   // 开启按钮的 loading 状态
    //   this.followLoading = true
    //   try {
    //     if (this.article.is_followed) {
    //       // 如果已关注，则取消关注
    //       await deleteFollow(this.article.aut_id)
    //       // this.article.is_followed = false
    //     } else {
    //       // 否则添加关注
    //       await addFollow(this.article.aut_id)
    //       // this.article.is_followed = true
    //     }
    //     // 更新视图状态
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败，请重试！'
    //     if (err.response && err.response.status === 400) {
    //       message = '不能关注自己'
    //     }
    //     this.$toast(message)
    //   }
    //   // 关闭按钮的 loading 状态
    //   this.followLoading = false
    // },

  }
}
</script>

<style scoped lang="scss">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
