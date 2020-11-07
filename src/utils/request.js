// 封装 axios 请求模块

import axios from 'axios'
import store from '@/store/index'
import JSONBig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router/'

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn',

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

//
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过拦截器  config：会请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里必须要返回 config 配置对象，否则请求停在这里出不去
  // console.log(config)
  return config
}, function (error) {
  // 如果请求出错了，请求没发出去，会进入这里
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status

  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token 无效
    // 如果没有user 或者 user.token 直接登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页面
      return redirectLogin()
    }
    // 使用 refresh_token ,请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的token 之后 把他更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // 把失败的请求重新发出去
      // err.cogfig 是本次请求的相关配置信息对象
      // 这里用request 发请求，他会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 数据
      // console.log(error.config)
      return request(error.config)
    } catch (err) {
      // 刷新token都失败了，直接跳转登录页
      redirectLogin()
    }

    Toast.fail('token 过期')
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务器异常
    Toast.fail('服务端异常，请稍后重试')
  }

  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递查询参数，查询参数会以 ？作为分隔符放到url 后面
    query: {
      // 数据名可以自己起的   redirect
      // router.currentRouter 和我们的组件中获取的this.$router 是同一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

// 导出
export default request
