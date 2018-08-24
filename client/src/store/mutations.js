export default {
  setUsuario (state, { codigo, escuela, id, nombre, codigos, codigoEscuela }) {
    state.usuario = nombre
    state.codigo = codigo
    state.escuela = escuela
    state.id = id
    state.codigos = codigos
    state.codigoEscuela = codigoEscuela
  },
  setLoggeado (state) {
    state.estaLoggeado = true
  }
}
