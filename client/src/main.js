// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import { store } from '@/store'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

import './permission'

Vue.use(Buefy)
import 'vuetify/dist/vuetify.min.css'
Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    primary: '#F28223',
    // secondary: '#b0bec5',
    // accent: '#8c9eff',
    // error: '#b71c1c'
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
