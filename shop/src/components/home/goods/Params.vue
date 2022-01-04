<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许修改三级分类的参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span style="margin-right: 15px">选择商品分类:</span>
          <!-- 级联选择框 -->
          <!-- optionss指定数据源, props配置对应属性 -->
          <!-- selectedCateKeys选择框选中后会将对应id保存到数组中 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cataProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            style="margin-bottom: 15px"
            @click="addDialogVisible = true"
            >添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  >{{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" width="70"> </el-table-column>
            <el-table-column prop="attr_name" label="姓名"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            style="margin-bottom: 15px"
            @click="addDialogVisible = true"
            >添加属性
          </el-button>
          <!-- 参静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  >{{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" width="70"> </el-table-column>
            <el-table-column prop="attr_name" label="属性"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input autocomplete="off" v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 编辑参数表单 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input autocomplete="off" v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存所有商品数据
      cateList: [],
      // 指定级联选择器的配置
      cataProps: {
        // value 指定选中的值
        // lable 指定展示的值
        // children 指定父子嵌套的关系
        // checkStrictly 父子节点不互相关联
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数据
      selectedCateKeys: [],
      // 指定页签选中的内容
      activeName: 'many',
      // 获取参数列表
      manyTableData: [],
      onlyTableData: [],
      // 想控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数表单验证
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      //  编辑的相关内容
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑的表单数据对象
      editForm: {
        attr_name: ''
      },
      // 编辑的表单验证
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isBtnDisabled() {
      return !(this.selectedCateKeys.length === 3)
    },
    getID() {
      return this.selectedCateKeys[this.selectedCateKeys.length - 1]
    },
    getKeysLength() {
      let flag = this.selectedCateKeys.length === 3
      return flag
    },
    titleText() {
      return this.activeName === 'many' ? '动态属性' : '静态参数'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('请求商品失败')
      this.cateList = res.data
    },
    // 级联选择框选中项变化, 会触发这个函数
    handleChange() {
      // 判断是否选择的三级分类
      if (!this.getKeysLength) return (this.selectedCateKeys = [])
      this.getParamsData()
    },
    // 监听 tab 页签 点击事件
    handleTabClick() {
      if (!this.getKeysLength) return
      this.getParamsData()
    },
    // 定义获取商品参数的网络请求
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.getID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.data.meta.msg)
      res.data.map((item) => {
        item.inputValue = ''
        item.inputVisible = false
        if (item.attr_vals == '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(',')
        }
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加属性对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加参数
    addAttr() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .post(`categories/${this.getID}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then((res) => {
            if (res.data.meta.status !== 201)
              return this.$message.error(res.data.meta.msg)
            this.getParamsData()
            this.addDialogVisible = false
            this.$message.success(res.data.meta.msg)
          })
      })
    },
    // 监听编辑按钮的点击
    showEditDialog(id) {
      this.editDialogVisible = true
      this.$http
        .get(`categories/${this.getID}/attributes/${id}`, {
          params: { attr_sel: this.activeName }
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg)
          this.editForm = res.data.data
        })
    },
    // 清空表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮确认修改
    editParams() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .put(`categories/${this.getID}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg)
            this.getParamsData()
            this.$message.success(res.data.meta.msg)
            this.editDialogVisible = false
          })
      })
    },
    // 监听删除按钮的点击, 并传入对应id
    removeParams(id) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.getID}/attributes/${id}`)
            .then((res) => {
              if (res.data.meta.status !== 200)
                return this.$message.error(res.data.meta.msg)
              this.$message.success(res.data.meta.msg)
              this.getParamsData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加属性文本框失去焦点触发
    handleInputConfirm(row) {
      // 判断输入的字符是否合法  并将添加的属性保存在本地数据
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue)
      }
      // 清空数据并关闭文本框
      row.inputValue = ''
      row.inputVisible = false
      // 发送网络请求把数据保存到后端
      this.$http
        .put(`categories/${this.getID}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
        })
    },
    // 添加属性文本框显示
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听删除属性节点
    handleClose(row, index) {
      // 从本地删除对应属性节点
      row.attr_vals.splice(index, 1)
      // 发送网络请求删除对应属性节点
      this.$http
        .delete(`categories/${this.getID}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
        })
    }
  }
}
</script>

<style>
.cat-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 20px;
}
.input-new-tag,
.button-new-tag {
  width: 90px;
  margin: 20px;
}
</style>