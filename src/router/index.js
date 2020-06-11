import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import ViewUI from 'view-design'
import { canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const SIGNIN_REDIRECT_PAGE = 'signin_redirect'
const REGISTER_PAGE = 'register'
// const SILENT_SIGNIN = 'silent_signin'

const turnTo = (to, access, next) => {
  console.log('执行了 turnTo 方法')
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  if (to.name === REGISTER_PAGE) {
    next()
    return
  }

  if (to.name === SIGNIN_REDIRECT_PAGE) {
    console.log('是否是重定向页面：' + to.name)
    next()
    return
  }
  store.dispatch('getUser').then((res) => {
    console.log('user profile: ')
    // console.log(res.profile)
    if (!res) {
      // store.dispatch('handleLogin')
      if (to.name !== LOGIN_PAGE_NAME) {
        next({ name: LOGIN_PAGE_NAME })
      } else {
        next()
      }
    } else {
      if (to.name === LOGIN_PAGE_NAME) {
        console.log('已登录且要跳转的页面是登录页')
        next({
          name: homeName // 跳转到homeName页
        })
      } else {
        if (store.state.user.hasGetInfo) {
          turnTo(to, store.state.user.access, next)
        } else {
          store.dispatch('getUserInfo').then(user => {
            // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
            turnTo(to, user.access, next)
          }).catch(() => {
            // setToken('')
            next({
              name: 'login'
            })
          })
        }
      }
    }
  })

  // const token = getToken()
  // console.log('to.name:' + to.name)
  // console.log('token' + token)
  // if (!token && to.name !== LOGIN_PAGE_NAME &&
  //   to.name !== SIGNIN_REDIRECT_PAGE &&
  //   to.name !== SILENT_SIGNIN) {
  //   // 未登录且要跳转的页面不是登录页
  //   console.log('未登录且要跳转的页面不是登录页')
  //   console.log(to.name)
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   })
  //   // next()
  // } else if (!token && (to.name === LOGIN_PAGE_NAME ||
  //   to.name === SIGNIN_REDIRECT_PAGE ||
  //   to.name === SILENT_SIGNIN)) {
  //   // 未登陆且要跳转的页面是登录页
  //   console.log('未登陆且要跳转的页面是登录页')
  //   next() // 跳转
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   console.log('已登录且要跳转的页面是登录页')
  //   next({
  //     name: homeName // 跳转到homeName页
  //   })
  // } else {
  //   console.log('else')
  //   if (store.state.user.hasGetInfo) {
  //     turnTo(to, store.state.user.access, next)
  //   } else {
  //     store.dispatch('getUserInfo').then(user => {
  //       // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
  //       turnTo(to, user.access, next)
  //     }).catch(() => {
  //       setToken('')
  //       next({
  //         name: 'login'
  //       })
  //     })
  //   }
  // }
})

router.afterEach(to => {
  setTitle(to, router.app)
  ViewUI.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
