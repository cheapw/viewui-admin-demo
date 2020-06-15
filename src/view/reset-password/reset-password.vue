<style lang="less">
  @import './reset-password.less';
</style>

<template>
  <div class="reset-password">
    <div class="reset-password-con">
      <Card class="resetPasswordCard" icon="ios-person-add" title="密码重置" :bordered="false" style="background:transparent">
        <div class="form-con">
          <reset-password-form @on-success-valid="handleSubmit"></reset-password-form>
        </div>
      </Card>
      <Row type="flex" justify="center" align="middle" style="margin-top:6px;">
        <Col offset="0">
          <span style="color:lightgreen">记起了密码？</span>
        </Col>
        <Col span="4" offset="0">
          <Button @click="redirectToLoginPage" type="text" size="small" ghost>登录</Button>
        </Col>
        <Col offset="2">
          <span style="color:lightcoral">还没有账号？</span>
        </Col>
        <Col span="4" offset="0">
          <Button type="text" size="small" ghost @click="register">注册</Button>
        </Col>
    </Row>
    </div>
  </div>
</template>

<script>
import ResetPasswordForm from '_c/reset-password-form'
import { mapActions } from 'vuex'
import { resetPassword } from '@/api/user'
// import { v4 as uuidv4 } from 'uuid'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

export default {
  components: {
    ResetPasswordForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password, email, verifyCode }) {
      resetPassword(userName, Base64.stringify(sha256(password)), email, verifyCode).then((res) => {
        // console.log('res: ' + res.data)
        // this.$Message['success']({
        //   background: true,
        //   content: '注册成功'
        // })

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
              h('h1', '密码重置成功，正在打开登录页面....')
            ])
          }
        })
        setTimeout(() => {
          this.handleLogin()
          this.$Spin.hide()
        }, 1200)
      }).catch((err) => {
        console.log(err.response)
        this.$Message['error']({
          background: true,
          duration: 1.8,
          content: err.response.data
        })
      })
    },
    redirectToLoginPage () {
      console.log('开始登录跳转页面请求')
      this.handleLogin().then((res) => {
        console.log(res.data)
      }, (err) => {
        // console.log('哈哈哈' + err)
        // console.log(err)
        this.$Message['error']({
          background: true,
          duration: 1.8,
          content: err
        })
      })
    },
    register () {
      this.$router.push({ name: 'register' })
    }
  },
  mounted: function () {
    this.$Notice.info({
      title: '提示信息',
      desc: '请先填写想要重置密码的账号和绑定的邮箱，并获取验证码！',
      duration: 0,
      name: 'tip1'
    })
  }
}
</script>
<style>
.resetPasswordCard .ivu-card-head{
  padding: 14px 0px 0px 16px;
  border-bottom: 1.5px solid white;
}
.resetPasswordCard .ivu-card-head p{
  height: 36px;
}
.resetPasswordCard .ivu-card-head p span,.resetPasswordCard .ivu-card-head p i{
  color: white;
  font-size: 30px;
  height: auto;
  padding: 0px 3px;
}
.resetPasswordCard .ivu-card-body{
  padding: 16px 16px 2px 16px;
}
</style>
