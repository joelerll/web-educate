import Vue from 'vue'
export default {
  Login ({commit, dispatch}, { usuario, clave }) {
    return new Promise((resolve, reject) => {
      Vue.http.post(`/api/login`, { usuario, clave })
        .then((response) => {
          if (response.body.estado) {
            console.log(response.body.datos)
            commit('setUsuario', response.body.datos)
            commit('setLoggeado')
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  Enviar ({commit, dispatch}, datos) {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  },
  EstaLogeado ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      Vue.http.get(`/api/estaLogueado`)
        .then((response) => {
          if (response.body.estado) {
            commit('setLoggeado')
            resolve(response.body.datos)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  Logout ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      Vue.http.get(`/api/logout`)
        .then((response) => {
          if (response.body.estado) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  UsuarioCrear ({commit, dispatch}, datos) {
    return new Promise((resolve, reject) => {
      Vue.http.post(`/api/usuarios`, datos)
        .then((response) => {
          if (response.body.estado) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
