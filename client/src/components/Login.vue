<template>
  <div id="login" style="padding-top: 10%;">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title >Fundación Edúcate</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-media height="100px">
            <img src="@/assets/logoe.png">
          </v-card-media>
          <v-card-text>
            <v-form v-model="valid">
            <v-text-field
              prepend-icon="person"
              name="Usuario"
              label="Usuario"
              v-model="usuario"
              :rules="usuarioRules"
              v-on:keyup.13="submit"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              name="Clave"
              label="Clave"
              type="password"
              v-model="clave"
              :rules="claveRules"
              v-on:keyup.13="submit"
            ></v-text-field>
          </v-form>
          <v-btn @click="submit" block :disabled="!valid" color="primary" large>
                Entrar
          </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar
        v-model="snackbar"
        color="red"
      >
        El usuario no esta autorizado
      <v-btn
        color="white"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import router from '../router'
export default {
  data: () => ({
    valid: false,
    snackbar: false,
    usuario: '',
    usuarioRules: [
      v => !!v || 'Usuario es requerido'
    ],
    clave: '',
    claveRules: [
      v => !!v || 'Clave es requerida'
    ],
  }),
  methods: {
    submit () {
      let usuario = this.usuario
      let clave = this.clave
      this.$store.dispatch('Login', { usuario, clave }).then((resp) => {
        let esAdmin = this.$store.getters['esAdmin']
        if (resp) {
          if (esAdmin) {
            router.push('usuarios')
          } else {
            router.push('subir')
          }
        } else {
          this.snackbar = true
        }
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
