import router from './router'
import { store } from '@/store'
router.beforeEach((to, from, next) => {
  let path = to['path']
  let esUsuario = store.getters['esAdmin']
  if (path === '/usuarios' && esUsuario !== undefined && !esUsuario) {
    next('/subir')
  } else if (path === '/') {
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
