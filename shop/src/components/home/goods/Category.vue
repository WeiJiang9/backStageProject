<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- selection-type -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text=""
        border
      >
        <!-- 是否有效的模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="color: #67c23a"
          ></i>
          <i v-else class="el-icon-error" style="color: #f56c6c"></i>
        </template>
        <!-- 展示几级的模板 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级
          </el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="qyerInfo.pagenum"
        :page-size="qyerInfo.pagesize"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        label-width="100px"
        ref="addCateFormRef"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input
            autocomplete="off"
            v-model="addCateForm.cat_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- prpos指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询条件
      qyerInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 保存总数据条数
      total: 0,
      // 指定table的列 lable指定标题, prop 指定绑定的数据属性
      // type=template 指定当前为模板渲染, template="名字" 指定对应模板
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'level' },
        { label: '排序', type: 'template', template: 'opt' }
      ],
      // 控制添加分类对话框显示与影藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 分类名
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 指定验证规则addCateFormRules
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置
      cascaderProps: {
        // value 指定选中的值
        // lable 指定展示的值
        // children 指定父子嵌套的关系
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.qyerInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      // 把数据列表保存在cateList中
      this.cateList = res.data.result
      // 把总数据条数保存在total中
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.qyerInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听pagenum 改变
    handleCurrentChange(num) {
      this.qyerInfo.pagenum = num
      this.getCateList()
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.$http
        .get('categories', {
          params: { type: 2 }
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error('获取父级菜单失败')
          this.parentCateList = res.data.data
        })
    },
    // 选择项发生变化触发
    parentCateChange() {
      let length = this.selectedKeys.length
      // 判断拿到的id数组长度
      if (length > 0) {
        // 将最后一个父级分类的id赋值给cat_pid
        this.addCateForm.cat_pid = this.selectedKeys[length - 1]
        this.addCateForm.cat_level = length
      }
    },
    // 监听对话框关闭并清空数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 监听确定按钮, 添加分类
    addCate() {
      // 表单校验
      this.$refs.addCateFormRef.validate((vaild) => {
        if (!vaild) return
        // 发送添加请求
        this.$http.post('categories', this.addCateForm).then((res) => {
          // 判断添加请求的返回数据
          if (res.data.meta.status !== 201)
            return this.$message.error(res.data.meta.msg)
          // 重新获取商品列表
          this.getCateList()
          // 关闭对话框
          this.addCateDialogVisible = false
          // 弹窗添加成功消息
          this.$message.success(res.data.meta.msg)
        })
      })
    }
  }
}
</script>

<style scoped>

.tree-table {
  margin-top: 15px;
}
</style>