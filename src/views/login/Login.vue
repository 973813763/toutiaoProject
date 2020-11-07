<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>

    <!-- 登录表单  -->
    <van-form
      @submit="onSubmit"
      ref="loginFormRef"
    >
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i
          slot="left-icon"
          class="iconfont icon-shouji"
        ></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i
          slot="left-icon"
          class="iconfont icon-yanzhengma"
        ></i>
        <template #button>
          <van-count-down
            v-if='isCountDownShow'
            @finish='isCountDownShow=false'
            :time="1000 * 60"
            format="ss s"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
          >获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/API/user'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '',
        code: '246810'
      },
      // 表单验证规则
      userFormRules: {
        mobile: [{ required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机格式错误' }],
        code: [{ required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }]
      },
      // 控制是否展示倒时间
      isCountDownShow: false
    }
  },
  created () {

  },
  methods: {
    async onSubmit () {
      // 1、获取表单数据
      const user = this.user
      // 2、表单数据

      // 在组件中必须通过this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0，则持续展示
      })
      // 3、提交表单请求登录
      try {
        const { data: res } = await login(user)
        this.$store.commit('setUser', res.data)

        // 清除 layout 的缓存，让其重新渲染
        this.$store.commit('removeCachePage', 'layoutIndex')

        this.$toast.success('登录成功')
        // 登录成功，跳转回原来的页面
        // this.$router.back() // back 是不够严谨的 ，不符合
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4、根据请求响应结果，处理后续操作
    },
    // 验证码请求
    async onSendSms () {
      // console.log('onSendSms')
      // 1. 校验手机号
      try {
        await this.$refs.loginFormRef.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 156px;
    height: 46px;
    line-height: 46px;
    font-size: 20px;
    color: #666;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 53px 28px;
    .login-btn {
      border: none;
      background-color: #6db4fb;
    }
  }
}
</style>
