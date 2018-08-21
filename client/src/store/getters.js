export default {
  estaLoggeado (state) {
    return state.estaLoggeado
  },
  obtenerUsuario (state) {
  	return {
  	  usuario: state.usuario,
      codigo: state.codigo,
	    escuela: state.escuela,
	    id: state.id
  	}
  }
}
