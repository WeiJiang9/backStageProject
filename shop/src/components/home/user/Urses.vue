<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="quertInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-dark">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="quertInfo.pagenum"
        :page-size="quertInfo.pagesize"
        layout="prev, pager, next,total"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
        ref="addFormRef"
      >
        <!-- 账号 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="addForm.password"
            autocomplete="off"
            show-password
          >
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"> </el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="setDialogClosed"
    >
      <el-form
        label-width="70px"
        :model="setForm"
        :rules="addFormRules"
        ref="setFormRef"
      >
        <!-- 账号 -->
        <el-form-item label="用户名">
          <el-input
            autocomplete="off"
            disabled
            v-model="setForm.username"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="setForm.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input autocomplete="off" v-model="setForm.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDiaoVisible" width="50%">
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="seleteRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDiaoVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    return {
      //
      quertInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 保存用户列表
      userList: [],
      // 保存用户列表 页数
      total: 0,

      // 控制对话框的显示和影藏
      addDialogVisible: false,
      // 保存新增用户的信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 指定验证规则
      addFormRules: {
        // 用户名验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10', trigger: 'blur' }
        ],
        // 密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在6-10', trigger: 'blur' }
        ],
        // 邮箱验证
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 8, message: '邮箱长度不小于8', trigger: 'blur' },
          // 自定义表单校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        // 手机验证
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { min: 11, max: 11, message: '手机长度应在11位', trigger: 'blur' }
        ]
      },
      // 保存卡片的显示与隐藏
      setDialogVisible: false,
      // 获取当前用户信息病保存修改后的用户信息
      setForm: {},
      setRoleDiaoVisible: false,
      userInfo: {},
      rolesList: [],
      seleteRoleId: ''
    }
  },
  // 在生命周期里获取用户列表
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList() {
      this.$http.get('users', { params: this.quertInfo }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取用户失败')
        this.userList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 跳转到对应页码后重新获取用户信息
    handleCurrentChange(newPage) {
      this.quertInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听状态修改事件
    userStateChanged(userinfo) {
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.data.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('修改状态失败')
          }
          this.$message.success('更新用户状态成功')
        })
    },
    // 卡片关闭后重置输入框内容和验证信息
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加用户事件
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        this.$http.post('users', this.addForm).then((res) => {
          if (res.data.meta.status !== 201)
            return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          this.addDialogClosed
          this.getUserList()
        })
      })
    },
    // 监听修改用户事件弹出对应的卡片
    showEditDialog(id) {
      this.$http.get('users/' + id).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('获取用户信息失败')
        this.setDialogVisible = true
        this.setForm = res.data.data
      })
    },
    // 卡片关闭后重置输入框内容和验证信息
    setDialogClosed() {
      this.$refs.setFormRef.resetFields()
    },
    // 监听用户的修改
    setUser() {
      this.$refs.setFormRef.validate((valid) => {
        if (!valid) return
        this.$http.put('users/' + this.setForm.id, this.setForm).then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error('修改用户信息失败')
          this.getUserList()
          this.setDialogVisible = false
          this.$message.success('修改用户信息成功')
        })
      })
    },
    // 监听删除实事件
    deleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // 监听确认删除
        .then(() => {
          this.$http.delete('users/' + id).then((res) => {
            // 判断服务器返回的删除结果
            // 删除失败
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg)
            // 删除成功
            // 重新获取用户列表
            this.getUserList()
            // 弹出删除成功的信息
            this.$message.success(`删除用户成功`)
          })
        })
        // 监听取消删除
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    setRole(userInfo) {
      this.userInfo = userInfo
      this.$http.get('roles').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('请求角色列表失败')
        this.rolesList = res.data.data
      })
      this.setRoleDiaoVisible = true
    },
    saveRoleInfo() {
      if(!this.seleteRoleId) return this.$message.error("请选择分配的角色")
      this.$http.put(`users/${this.userInfo.id}/role`,{rid: this.seleteRoleId}).then(res => {
        console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.getUserList()
        this.setRoleDiaoVisible = false
      })
    }
  }
}
</script>
<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 13px;
}
</style>