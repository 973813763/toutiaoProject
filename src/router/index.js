import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/Login.vue'
import Layout from '@/views/layout/index.vue'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
    // meta: { requiresAuth: false } // 添加额外的自定义数据
  },
  { // 以及路由渲染到根组件中的 router-view
    path: '/',
    // name: 'layout',  //如果父路由有默认的子路由，那他就没有意义
    component: Layout,
    children: [
      {
        path: '/', // 默认子路由，只能有一个
        name: 'home',
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      }, {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: { requiresAuth: true }
      }, {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: { requiresAuth: false }
      }, {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: { requiresAuth: false }
      }
    ]
  }, {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/Search'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: false }
  }
]

const router = new VueRouter({
  routes
})

// to:要访问的页面路由信息
// from ：来自哪个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  // 判断页面是否需要登录才能访问
  if (to.meta.requiresAuth) {
    // 如果已登录，直接通过
    if (store.state.user) {
      return next()
    }

    // 没有登录 ,提示用户
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登陆吗'
    }).then(() => { // 确认执行这里
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      next()
    }).catch(() => { // 取消执行这里
      // 取消了，中断路由导航
      next(false)
    })
  } else {
    // 不需要登录状态的页面，直接跳过去
    next()
  }
  // console.log(from)
})

export default router
