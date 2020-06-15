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
          <Button type="dashed" size="large" style="width:150px;" ghost @click="register">
            <Icon type="ios-paw-outline" size="20" style="padding-right:2px;"/>
            注册
          </Button>
        </Col>
      </Row>
      <br/><br/>
      <Row type="flex" justify="start">
        <Col offset="12">
          <Button type="dashed" size="large" style="width:150px;" ghost @click="resetPassword">
            <Icon type="ios-key-outline" size="20" style="padding-right:2px;" />
            重置密码
          </Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    login () {
      this.handleLogin().then((res) => {
        // console.log(res.data)
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
    },
    resetPassword () {
      this.$router.push({ name: 'reset_password' })
    }
  }
}
</script>

<style>

</style>
