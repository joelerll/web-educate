import { store } from '../store'

export default (to, from, next) => {
  console.log(store)
  store._actions.EstaLogeado().then((resp) => {
    if (resp) {
      next()
    } else {
      next('/')
    }
  })
}
