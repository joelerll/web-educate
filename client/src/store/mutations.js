export default {
  setUsuario (state, { codigo, escuela, id, nombre, codigos, codigoEscuela, perfilId, perfil, perfiles, escuelas }) {
    state.usuario = nombre
    state.codigo = codigo
    state.escuela = escuela
    state.id = id
    state.codigos = codigos
    state.codigoEscuela = codigoEscuela
    state.perfilId = perfilId
    state.perfil = perfil
    state.perfiles = perfiles
    state.escuelas = escuelas
  },
  setLoggeado (state) {
    state.estaLoggeado = true
  }
}
