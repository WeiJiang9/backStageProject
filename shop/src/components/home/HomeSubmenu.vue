<template>
  <!-- 整体菜单栏 -->
  <el-menu
    background-color="#313743"
    text-color="#fff"
    active-text-color="#409fff"
    unique-opened
    :collapse="isFold"
    :collapse-transition="false"
    router
  >
    <!-- 1级菜单 -->
    <el-submenu
      v-for="(menu, index) in menulist"
      :key="menu.id"
      :index="menu.id + ''"
    >
      <!-- 1级菜单的模板 -->
      <template slot="title">
        <!-- 图标 -->
        <i :class="icons[index]"></i>
        <!-- 文本 -->
        <span>{{ menu.authName }}</span>
      </template>
      <!-- 2级菜单 -->
      <el-menu-item
        v-for="item in menu.children"
        :key="item.id"
        :index="item.path"
      >
        <!-- 2级菜单的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{ item.authName }}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        'el-icon-user-solid',
        'el-icon-s-tools',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-data'
      ]
    }
  },
  props: {
    menulist: {
      type: Array,
      defalut() {
        return []
      }
    },
    isFold: {
      type: Boolean,
      defalut: false
    }
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>