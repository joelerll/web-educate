export default {
  estaLoggeado (state) {
    return state.estaLoggeado
  },
  obtenerUsuario (state) {
  	return {
  	  usuario: state.usuario,
      codigo: state.codigo,
	    escuela: state.escuela,
	    id: state.id,
      codigos: state.codigos,
      codigoEscuela: state.codigoEscuela
  	}
  },
  esAdmin (state) {
    return state.perfilId == 1
  },
  ObtenerEscuelas (state) {
    return state.escuelas
  },
  ObtenerPerfiles (state) {
    return state.perfiles
  }
}
