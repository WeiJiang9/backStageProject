import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: () => import('@/components/Home'),
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/components/home/Welcome')
      },
      {
        path: 'users',
        component: () => import('@/components/home/user/Urses')
      },
      {
        path: 'rights',
        component: () => import('@/components/home/power/Rights')
      },
      {
        path: 'roles',
        component: () => import('@/components/home/power/Roles')
      },
      {
        path: 'categories',
        component: () => import('@/components/home/goods/Category')
      },
      {
        path: 'params',
        component: () => import('@/components/home/goods/Params')
      },
      {
        path: 'goods',
        component: () => import('@/components/home/goods/Goods')
      },
      {
        path: 'addgoods',
        component: () => import('@/components/home/goods/AddGoods')
      },
      {
        path: 'orders',
        component: () => import('@/components/home/order/Order')
      },
      {
        path: 'reports',
        component: () => import('@/components/home/report/Report')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
