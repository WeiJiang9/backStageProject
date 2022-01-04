<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/goods' }"
        >首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>

        <!-- 订单编号 -->
        <el-table-column label="订单编号" prop="order_number" width="300">
        </el-table-column>

        <!-- 订单价格 -->
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="90"
        ></el-table-column>

        <!-- 是否付款 -->
        <el-table-column label="是否付款" width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>

        <!-- 是否发货 -->
        <el-table-column label="是否发货" prop="is_send" width="90">
        </el-table-column>

        <!-- 下单时间 -->
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | formatDate }}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
      <el-form
        :model="addressForm"
        :rules="addressRules"
        ref="addressRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <span slot="footer" class="dialog-footer">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.ftimme"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
        <el-button @click="progressVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存数据
      orderList: [],
      // 保存数据总数,
      total: 0,
      // 控制对话框的显示与隐藏
      addressVisible: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      // 指定验证规则
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      progressVisible: false,
      progressInfo: [
        {
          time: '2021-12-19 22:05:59',
          ftimme: '2021-12-19 22:05:59',
          context: '感谢使用逆风快递',
          location: ''
        },
        {
          time: '2021-12-18 22:05:23',
          ftimme: '2021-12-18 22:05:23',
          context: '你的快件已做废弃处理',
          location: ''
        },
        {
          time: '2021-12-18 21:44:45',
          ftimme: '2021-12-18 21:44:45',
          context: '快递小哥不幸掉到沟里了',
          location: ''
        },
        {
          time: '2021-12-18 19:02:15',
          ftimme: '2021-12-18 19:02:15',
          context: '快递小哥正在为您配件',
          location: ''
        }
      ]
    }
  },
  // 过滤器
  filters: {
    // 时间格式化
    formatDate(date) {
      let oldDate = new Date(date)
      let Y = oldDate.getFullYear()

      let M = oldDate.getMonth() + 1
      M = M >= 10 ? M : '0' + M

      let D = oldDate.getDate()
      D = D >= 10 ? D : '0' + D

      let h = oldDate.getHours()
      h = h >= 10 ? h : '0' + h

      let m = oldDate.getMinutes()
      m = m >= 10 ? m : '0' + m

      let s = oldDate.getSeconds()
      s = s >= 10 ? s : '0' + s

      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
  },
  created() {
    this.getOlderList()
  },
  methods: {
    // 请求数据
    async getOlderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.console.error(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleCurrentChange(i) {
      this.queryInfo.pagenum = i
      this.getOlderList()
    },
    // 监听修改的点击
    showBox() {
      this.addressVisible = true
    },
    showProgressBox() {
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}
.el-input {
  width: 400px;
}
</style>