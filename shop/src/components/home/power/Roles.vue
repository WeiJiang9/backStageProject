<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row class="addUser">
        <el-col>
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <!-- 角色列表数据 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope" class="ads1">
            <el-row
              class="centerCol borderBottom"
              v-for="item1 in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="centerCol borderBottom"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="10">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="14">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      :disable-transitions="false"
                      @close="removeRightById(scope.row.id, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @clise="setRightDialogClosed"
    >
      <!-- 树形控件展示权限信息 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :defdult-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 保存分配权限的显示与隐藏
      setRightDialogVisible: false,
      // 保存权限的数据
      rightsList: [],
      // 树形控件的属性
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id值
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.$http.get('roles').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.console.error('请求角色列表失败')
        this.roleList = res.data.data
      })
    },
    // 根据id删除权限
    removeRightById(roleId, rightId) {
      // 弹窗输出
      this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`roles/${roleId}/rights/${rightId}`).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error('删除失败')
            this.$message.success(res.data.meta.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听分配权限点击显示对应对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      // 请求权限的数据
      this.$http.get('rights/tree').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取权限信息失败')
        this.rightsList = res.data.data
      })
      // 打开权限控制框
      this.setRightDialogVisible = true
      this.getLeafKeys(role, this.defKeys)
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
       
    },
    // 监听权限对话框的关闭
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 分配权限的
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr}).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error("更新权限失败")
        this.getRoleList()
        this.setRightDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.addUser {
  margin-bottom: 15px;
}
.centerCol {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.borderBottom {
  border-bottom: 1px solid #ddd;
}
.borderBottom:last-child {
  border-bottom: none;
}
.el-tag {
  margin: 10px;
}
</style>