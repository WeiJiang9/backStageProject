<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/goods' }"
        >首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <!-- 进度条区域 -->
      <el-steps :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 纵向标签页 -->
      <el-form :model="addForm" :rules="addFormRlues" ref="addFormRef">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in paramsData.many"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                  size="medium "
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in paramsData.only"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片组件 -->
            <!-- action指定图片上传地址 -->
            <!-- on-preview 点击图片名称触发-->
            <!-- on-remove 点击删除触发-->
            <!-- list-type 指定预览图片的展示方式 -->
            <!-- 图片上传成功就会调用 on-uccess -->
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button class="btn-add" type="primary" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的对话框 -->
    <el-dialog :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 保存所有分类数据
      cateList: [],
      // 指定级联选择器配置规则
      cateProps: {
        // 指定hover触发子菜单
        expandTrigger: 'hover',
        // 指定选中的值
        value: 'cat_id',
        // 指定展示的值
        label: 'cat_name',
        // 指定父子嵌套
        children: 'children'
      },
      // 激活列对应的索引
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品所属分类的id数组
        goods_cat: [],
        // 图片保存的数组
        pics: [],
        // 富文本绑定的数组
        goods_introduce: '',
        attrs: []
      },
      // 指定form表单的匹配规则
      addFormRlues: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      // 保存商品参数列表
      paramsData: {
        many: [],
        only: []
      },
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 保存图片的路径
      previewPath: '',
      // 预览图片对话框的显示与隐藏
      previewVisible: false
    }
  },
  computed: {
    // 判断并获取三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    }
  },
  created() {
    // 请求商品分类数据
    this.getCateList()
  },
  methods: {
    // 定义获取商品分类数据的方法
    getCateList() {
      this.$http.get('categories').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.data.meta.msg)
        this.cateList = res.data.data
      })
    },
    // 级联选择器选中项改变触发
    handleChange() {
      // 判断是否选中的三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error('必须选择三级分类')
        this.addForm.goods_cat = []
      }
    },
    // 页签切换的钩子函数 // 接受两个参数, 要进入页签的name / 离开页签的name
    beforeTabLeave(activeName, oldActiveName) {
      let flag = false
      if (oldActiveName === '0') {
        // 表单校验
        this.$refs.addFormRef.validate((vaild) => {
          flag = vaild
          !vaild && this.$message.error('请先完善商品基本信息')
        })
        return flag
      }
    },
    // 监听页签的点击
    tabClick() {
      // 动态参数面板
      if (this.activeIndex === '1') {
        this.getParams('many')
      }
      if (this.activeIndex === '2') {
        this.getParams('only')
      }
    },
    // 定义请求商品参数的API
    getParams(sel) {
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: sel }
        })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.dada.meta.msg)
          if (sel === 'many') {
            res.data.data.map((item) => {
              if (item.attr_vals.length !== 0) {
                item.attr_vals = item.attr_vals.split(',')
              } else {
                item.attr_vals = []
              }
            })
          }
          this.paramsData[sel] = res.data.data
        })
    },
    // 监听图片名称点击
    handlePreview(file) {
      // 保存当前图片url
      this.previewPath = file.response.data.url
      // 显示图片预览对话框
      this.previewVisible = true
    },
    // 监听图片的删除
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      let index = this.addForm.pics.findIndex((item) => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    // 监听图片上传成功的时间
    // 图片上传成功 会拿到 服务器返回的 response 数据对象
    handleSuccess(response) {
      // 拼接的到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 将图片信息对象 push 到 pics中
      this.addForm.pics.push(picInfo)
    },
    // 监听添加商按钮的点击
    addGoods() {
      // 遍历取出对应的属性并处理
      Object.keys(this.paramsData).forEach((key) => {
        this.paramsData[key].forEach((item) => {
          if (item.attr_vals instanceof Array) {
            item.attr_vals = item.attr_vals.join(' ')
          }
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
      })
      // 对对象深拷贝
      let newForm = JSON.parse(JSON.stringify(this.addForm))
      // 格式化保存商品的数组为字符串
      newForm.goods_cat = newForm.goods_cat.join(',')

      // 发送网络请求添加商品
      this.$http.post('goods', newForm).then((res) => {
        if (res.data.meta.status !== 201)
          return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.$router.push('goods')
      })
    }
  }
}
</script>

<style scoped>
.el-tabs {
  margin-top: 15px;
}
.el-input {
  width: 70%;
  float: right;
  margin-right: 30px;
}
.el-cascader {
  margin-left: 10px;
}
.el-cascader {
  margin-left: 70px;
}
.el-dialog img {
  width: 100%;
}
.btn-add {
  margin-top: 15px;
}
</style>