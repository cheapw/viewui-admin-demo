<style>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>
<template><div></div>
</template>
<script>
import Oidc from 'oidc-client'
import { mapActions, mapMutations } from 'vuex'
import config from '@/config'

export default {
  methods: {
    ...mapActions(['getUser', 'getUserInfo']),
    ...mapMutations(['setToken']),
    showLoadingRing (isSuccess) {
      this.$Spin.show({
        render: h => {
          return h('div', [
            h('Icon', {
              class: 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 45
              }
            }),
            h('h1', isSuccess ? '登录成功，正在跳转....' : '验证失败，正在跳向登录页面....')
          ])
        }
      })
    }
  },
  mounted: function () {
    console.log('redirect页面初始化')
    let isSuccess = false
    new Oidc.UserManager({ response_mode: 'query' })
      .signinRedirectCallback()
      .then(() => {
        // 判断用户是否已经登录
        // 由于该页面为 IdentityServer 登录成功后 重定向回来的，所以一般情况下不会 401
        // 但用户若通过某种途径得知了此页面，可能会主动访问，此时用户若处于未登录状态，跳向登录页面
        // 若已登录，则导航到主页，并在全局更改登录状态，
        // 直接从 UserManager 中获取登录的用户信息，所有登录细节交由 UserManager 处理
        let user = this.getUser()
        console.log(user)
        if (user) {
          isSuccess = true
          config.isLoginSuccess = isSuccess
          console.log(isSuccess)
          // console.log('id_token:' + user.values[id_token])
          // this.setToken(user[id_token])
          user.then((res) => {
            // console.log(res)
            // console.log('id_token:' + res.id_token)
            // this.setToken(res.id_token)
            this.getUserInfo()
          })
        }
        this.showLoadingRing(isSuccess)
      })
      .catch((e) => {
        console.error(e)
        this.showLoadingRing(isSuccess)
      })
    console.log(isSuccess)
    setTimeout(() => {
      let path = '/'
      if (!isSuccess) {
        path += 'login'
      }
      this.$router.push({ path: path })
      this.$Spin.hide()
    }, 1200)
  }
}
</script>
