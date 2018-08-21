export default {
  setUsuario (state, { codigo, escuela, id, nombre }) {
    state.usuario = nombre
    state.codigo = codigo
    state.escuela = escuela
    state.id = id
  },
  setLoggeado (state) {
    state.estaLoggeado = true
  }
}
