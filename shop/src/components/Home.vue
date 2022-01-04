<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~@/assets/img/logo.jpeg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="asideWidth">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <home-submenu :menulist="menulist" :isFold="isFold"></home-submenu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeSubmenu from './home/HomeSubmenu'
export default {
  data() {
    return {
      menulist: [],
      isFold: false
    }
  },
  components: {
    HomeSubmenu,
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取子菜单
    getMenuList() {
      this.$http.get('menus').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.meta.msg)
        this.menulist = res.data.data
      })
    },
    toggleClick() {
      this.isFold = !this.isFold
    }
  },
  computed: {
    asideWidth() {
      return this.isFold ? '64px' : '200px'
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373b41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
  padding-left: 0;
}
.el-header img {
  width: 70px;
  vertical-align: middle;
  margin-right: 10px;
}
.el-aside {
  background-color: #313743;
}
.toggle-button {
  text-align: center;
  line-height: 24px;
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-main {
  background-color: #e9edf0;
}
</style>