<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width=500px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      dataList: {},
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'))

    let result = Object.assign(this.option,this.dataList)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.dataList)
  },
  methods: {
    getData() {
      this.$http.get('reports/type/1').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error('请求数据错误')
        this.dataList = res.data.data
        console.log(this.dataList);
        console.log(this.option);
      })
    }
  }
}
</script>

<style>
</style>