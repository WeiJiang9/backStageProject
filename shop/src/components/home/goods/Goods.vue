<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @change="inputChange"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px">
        </el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存商品列表数据
      goodsList: [],
      // 保存商品总条数
      total: 0,
      // 查询参数对象
      queryInfo: {
        // 指定查询名称
        query: '',
        // 指定查询页码
        pagenum: 1,
        // 指定每页数据条数
        pagesize: 10
      }
    }
  },
  // 过滤器
  filters: {
    // 时间格式化
    formatDate(date) {
      let oDate = new Date(date)
      let oYear = oDate.getFullYear()
      let oMonth = (oDate.getMonth() + 1 + '').padStart(2, '0')
      let oDay = (oDate.getDate() + '').padStart(2, '0')
      let oHour = (oDate.getHours() + '').padStart(2, '0')
      let oMin = (oDate.getMinutes() + '').padStart(2, '0')
      let oSec = (oDate.getSeconds() + '').padStart(2, '0')
      return `${oYear}-${oMonth}-${oDay} ${oHour}:${oMin}:${oSec}`
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 定义请求商品数据的方法
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页区域的分页切换
    // 每页显示的条数改变时调用
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //  页码改变时调用
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getGoodsList()
    },
    // 当搜索框清空, 重新发送网略请求
    inputChange() {
      if (this.queryInfo.query == '') this.getGoodsList()
    },
    // 监听删除按钮的点击
    removeById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`goods/${id}`).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error(res.data.meta.msg)
            this.getGoodsList()
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
    // 监听添加商品的点击
    goAddpage() {
      this.$router.push('addgoods')
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>