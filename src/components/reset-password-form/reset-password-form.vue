<template>
  <Form ref="resetPasswordForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名" class="resetPassword">
        <span slot="prepend">
          <Icon type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
        <FormItem prop="email">
      <Input type="email" v-model="form.email" placeholder="请输入邮箱获取验证码" class="resetPassword">
        <span slot="prepend">
          <Icon type="ios-mail"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="verificationCode">
      <Row>
        <Col span="15">
          <Input v-model="form.verificationCode" placeholder="请输入验证码" class="resetPassword"></Input>
        </Col>
        <Col span="8" offset="1">
          <Button :title="sendbtnTitle" :loading="showLoaingRing" :disabled="disableSendbtn" type="success" ghost long size="large" @click="sendVerificationCode">{{ btnSendEmailText }}</Button>
        </Col>
      </Row>
    </FormItem>
    <FormItem prop="password" v-show="showPasswordInput">
      <Input type="password" v-model="form.password" placeholder="请输入密码" class="resetPassword">
        <span slot="prepend">
          <Icon type="ios-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="comfirm" v-show="showPasswordInput">
      <Input type="password" v-model="form.comfirm" placeholder="请再次输入密码" class="resetPassword">
        <span slot="prepend">
          <Icon type="ios-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem id="resetBtn">
      <Button @click="handleSubmit" type="primary" long ghost size="large" style="margin-bottom:6px;">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { sendMail } from '@/api/user'
import Countdown from 'countdown-lft'

export default {
  name: 'ResetPasswordForm',
  data () {
    const comfirmPassword = (rule, value, callback) => {
      // console.log(value)
      // console.log(this.form.comfirm)
      if (value === '') {
        callback(new Error('第二次输入的密码不能为空'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 发送验证码按钮的显示文字
      btnSendEmailText: '获取验证码',
      // 是否启用发送按钮
      disableSendbtn: false,
      // 发送时显示加载的 ring
      showLoaingRing: false,
      // 发送按钮倒计时显示的提示文字
      sendbtnTitle: '',
      // 是否显示密码填写框
      showPasswordInput: false,
      form: {
        userName: 'super_admin',
        password: '123',
        comfirm: '123',
        email: 'cheapw@outlook.com',
        verificationCode: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        comfirm: [
          // { required: true, message: '第二次输入密码不能为空', trigger: 'blur' },
          { validator: comfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不合法', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // computed: {
  //   rules () {
  //     return {
  //       userName: this.userNameRules,
  //       password: this.passwordRules,
  //       comfirm: this.comfirmRules,
  //       email: this.emailRules,
  //       verificationCode: temp
  //     }
  //   }
  // },
  methods: {
    handleSubmit () {
      this.$refs.resetPasswordForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            email: this.form.email,
            verifyCode: this.form.verificationCode
          })
        }
      })
    },
    sendVerificationCode () {
      // this.disableSendbtn = true
      // 发送验证码之前首先确保邮箱格式正确
      this.$refs.resetPasswordForm.validateField('email', (result) => {
        console.log('result: ' + result)
        // 若返回字符串为空则代码该字段验证通过
        if (result === '') {
          console.log('开始请求发送邮件api')
          this.btnSendEmailText = '发送中...'
          this.showLoaingRing = true
          sendMail(this.form.email, '密码重置', 'resetpassword', this.form.userName).then((res) => {
            // console.log('返回结果：' + Object.keys(res.data))
            // console.log('status: ' + res.status)
            console.log('res.data: ' + res.data)
            if (res.status === 200) {
              if (res.data === 'success') {
                this.$Message['success']({
                  background: true,
                  content: '获取成功！'
                })
                setTimeout(() => {
                  this.$Notice.info({
                    title: '提示信息',
                    desc: '请填写验证码并输入两次新密码！',
                    duration: 0,
                    name: 'tip2'
                  })
                  // 显示密码输入框
                  this.showPasswordInput = true
                }, 1600)
              }
              if (res.data === 'refused') {
                this.$Message['warning']({
                  background: true,
                  content: '请不要重复获取！'
                })
              }
              this.sendbtnTitle = '倒计时结束后才能再次获取'
              // console.log('邮件发送成功！')
              this.showLoaingRing = false
              this.disableSendbtn = true
              const countdown = new Countdown()
              // 验证码两次发送的间隔需大于1分钟
              let totalTime = 60
              this.btnSendEmailText = totalTime
              countdown.start({
                // 总时间（毫秒）
                totalTime: totalTime * 1000,
                // 时间间隔
                interval: 1000,
                // 到达时间间隔后回调
                onTime: value => {
                  // count 第几次执行
                  // second 以秒为单位的倒计时
                  // duration 从开始执行计算过去的毫秒数
                  console.log('value', value.second)
                  this.btnSendEmailText = value.second
                },
                // 完成回调
                onComplete: duration => {
                  console.log('duration', duration)
                  this.btnSendEmailText = '重新发送'
                  this.sendbtnTitle = ''
                  this.disableSendbtn = false
                }
              })
            }
          }, (err) => {
            console.log(err)
            this.showLoaingRing = false
            this.btnSendEmailText = '重新发送'
            this.$Message['warning']({
              background: true,
              content: err.response.data
            })
          })
        } else {
          this.$Message['warning']({
            background: true,
            content: result
          })
        }
      })
    }
    // validatePassword (rule, value, callback) {
    //   if (value === '') {
    //     callback(new Error('Please enter your password again'))
    //   } else if (value !== this.formCustom.passwd) {
    //     callback(new Error('The two input passwords do not match!'))
    //   } else {
    //     callback()
    //   }
    // }
  }
}
</script>
<style>
.resetPassword .ivu-input-default{
    background:transparent;
    color: #fff;
    font-size: 16px;
    height: 38px;
}
.resetPassword .ivu-input-group-prepend{
    background:transparent;
    color: #fff;
 }
.resetPassword .ivu-input-group-prepend span i{
    font-size: 20px;
 }
 /* .resetPassword{
    height: 10px;
 } */

.ivu-btn-ghost.ivu-btn-success[disabled]{
    background: transparent;
    color: lightslategray;
    border-color: lightslategray;
}
.ivu-btn>.ivu-icon{
    /* line-height: 1.0; */
    font-size: 24px;
    vertical-align: middle;
    padding: 0px;
}
.ivu-btn>.ivu-icon+span{
    /* margin-left: 4px; */
    /* line-height: 1.5; */
    padding: 0px 0px 3px 0px;
}
#resetBtn{
  margin-bottom: 0px;
}
</style>
