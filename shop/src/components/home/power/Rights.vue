<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <!-- 权限列表数据 -->
      <template>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="authName" label="权限名称"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column label="权限等级">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'"
                >二级权限</el-tag
              >
              <el-tag type="warning" v-else>三级权限</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  methods: {
    getRightList() {
      this.$http.get('rights/list').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取权限列表失败')
        this.rightsList = res.data.data
      })
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>