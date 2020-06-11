<style lang="less">
  @import './register.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card class="registerCard" icon="ios-person-add" title="用户注册" :bordered="false" style="background:transparent">
        <div class="form-con">
          <register-form @on-success-valid="handleSubmit"></register-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
      <Row type="flex" justify="center" align="middle">
        <Col offset="0">
          <span style="color:lightgreen">已有账号？</span>
        </Col>
        <Col span="4" offset="0">
          <Button @click="redirectToLoginPage" type="text" size="small" ghost>登录</Button>
        </Col>
        <Col offset="2">
          <span style="color:lightcoral">忘记密码？</span>
        </Col>
        <Col span="4" offset="0">
          <Button type="text" size="small" ghost>重置</Button>
        </Col>
    </Row>
    </div>
  </div>
</template>

<script>
import RegisterForm from '_c/register-form'
import { mapActions } from 'vuex'
import { register } from '@/api/user'
import { v4 as uuidv4 } from 'uuid'
import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

export default {
  components: {
    RegisterForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, email, verifyCode }) {
      let userId = uuidv4()
      // let claimsId = uuidv4()
      console.log('userId: ' + userId)
      // console.log('claimsId: ' + claimsId)
      // let temp = sha256(password)
      // console.log('password: ' + temp)
      // let temp1 = Base64.stringify(temp)
      // console.log('temp1: ' + temp1)
      let data = {
        'Id': userId,
        'SubjectId': userId,
        'Username': userName,
        'password': Base64.stringify(sha256(password)),
        'IsActive': true,
        'Claims': [
          {
            'Id': uuidv4(),
            'UserId': userId,
            'Type': 'email',
            'Value': email
          },
          {
            'Id': uuidv4(),
            'UserId': userId,
            'Type': 'picture',
            'Value': 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
          },
          {
            'Id': uuidv4(),
            'UserId': userId,
            'Type': 'given_name',
            'Value': userName
          },
          {
            'Id': uuidv4(),
            'UserId': userId,
            'Type': 'power',
            'Value': '["super_admin","admin"]'
          },
          {
            'Id': uuidv4(),
            'UserId': userId,
            'Type': 'verifyCode',
            'Value': verifyCode
          }
        ]
      }
      console.log(data)
      // register(data)
      register(data).then((res) => {
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
              h('h1', '注册成功，正在打开登录页面....')
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
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //     this.$router.push({
      //       name: this.$config.homeName
      //     })
      //   })
      // })
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
    resetPassword () {

    }
  }
}
</script>
<style>
.registerCard .ivu-card-head{
  padding: 14px 0px 0px 16px;
  border-bottom: 1.5px solid white;
}
.registerCard .ivu-card-head p{
  height: 36px;
}
.registerCard .ivu-card-head p span,i{
  color: white;
  font-size: 30px;
  height: auto;
  padding: 0px 3px;
}
.registerCard .ivu-card-body{
  padding: 16px 16px 0px 16px;
}
</style>
