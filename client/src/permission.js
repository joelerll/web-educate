import router from './router'
import { store } from '@/store'
router.beforeEach((to, from, next) => {
  let path = to['path']
  if (path === '/') {
    next()
  } else {
    store.dispatch('EstaLogeado').then((resp) => {
      if (resp) {
        store.commit('setUsuario', resp)
        next()
      } else {
        next('/')
      }
    })
  }
})
