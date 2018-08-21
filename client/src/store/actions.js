import Vue from 'vue'
export default {
  Login ({commit, dispatch}, { usuario, clave }) {
    return new Promise((resolve, reject) => {
      Vue.http.post(`/api/login`, { usuario, clave })
        .then((response) => {
          if (response.body.estado) {
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
      console.log(datos)
      resolve(true)
    })
  }
}
