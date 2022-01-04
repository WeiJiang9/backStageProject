<template>
  <div class="login-container">
    <div class="login-box">
      <div class="head">
        <img src="~@/assets/img/head.jpg" alt="" />
      </div>

      <!-- from表单 -->
      <el-form
        ref="loginFormRef"
        class="login-form"
        :rules="loginFormRules"
        :model="loginForm"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      // :rules="loginFormRules"
      loginFormRules: {
        // 指定账号验证规则
        // prop="验证规则"
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 指定密码验证规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 监听登录的点击
    login() {
      // 判断登陆信息是否合法
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 判断账号密码是否正确
        const { data } = await this.$http.post('login', this.loginForm)
        if (data.meta.status !== 200) return this.$message.error('账户不存在')
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        window.sessionStorage.setItem('token', data.data.token)
        // 登录成功跳转到首页
        this.$router.push('/home')
      })
    },
    // 监听重置的点击
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 20px;
}
.head {
  width: 130px;
  margin: -70px auto;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
}
.head img {
  width: 100%;
  border-radius: 50%;
}
.login-form {
  margin: 100px;
}
.btns {
  display: flex;
  justify-content: space-around;
}

.el-form-item {
  position: relative;
}
</style>