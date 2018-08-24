import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    estaLoggeado: false,
    usuario: '',
    codigo: '',
	  escuela: '',
	  id: '',
    codigos: [],
    codigoEscuela: ''
  },
  mutations,
  actions,
  getters
})
