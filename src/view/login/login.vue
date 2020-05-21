<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <!-- <Card icon="md-log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card> -->
      <Row type="flex" justify="start">
        <Col>
          <Button type="dashed" size="large" style="width:150px;" ghost @click="login">
            <Icon type="ios-log-in" size="20" style="padding-right:2px;"/>
            登录
          </Button>
        </Col>
      </Row>
      <br/><br/>
      <Row type="flex" justify="start">
        <Col offset="6">
          <Button type="dashed" size="large" style="width:150px;" ghost>
            <Icon type="ios-paw-outline" size="20" style="padding-right:2px;"/>
            注册
          </Button>
        </Col>
      </Row>
      <br/><br/>
      <Row type="flex" justify="start">
        <Col offset="12">
          <Button type="dashed" size="large" style="width:150px;" ghost>
            <Icon type="ios-key-outline" size="20" style="padding-right:2px;" />
            找回密码
          </Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
// import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'

export default {
  // components: {
  //   LoginForm
  // },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    // handleSubmit ({ userName, password }) {
    //   this.handleLogin({ userName, password }).then(res => {
    //     this.getUserInfo().then(res => {
    //       this.$router.push({
    //         name: this.$config.homeName
    //       })
    //     })
    //   })
    // },
    login () {
      this.handleLogin()
    }
  }
}
</script>

<style>

</style>
