import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import TreeTable from 'vue-table-with-tree-grid'

import './assets/css/global.css'

Vue.use(ElementUI);
Vue.component('tree-table', TreeTable)

axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/"

// 设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
