import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Subir from '@/components/Subir'
import AuthGuard from './auth'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/subir',
      name: 'Subir',
      component: Subir
    }
  ]
})
