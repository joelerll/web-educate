<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Fundación Edúcate</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="salir"><v-icon left >logout</v-icon>Salir</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div style="padding-top: 10%;">
      <!-- codigoEscuela, nombre, usuario, perfil -->
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <form @submit.prevent>
            <v-text-field
              label="Nombre"
              v-model="nombre"
              required
              :rules="nombreRules"
            ></v-text-field>
            <v-text-field
              label="Usuario"
              required
              v-model="usuario"
              :rules="usuarioRules"
            ></v-text-field>
            <v-text-field
              label="Clave"
              v-model="clave"
              :rules="claveRules"
              required
            ></v-text-field>
            <v-select
              :items="escuelas"
              item-text="tipo"
              item-value="tipo"
              box
              label="Escoger la escuela"
              v-model="codigoEscuela"
              required
            ></v-select>
            <v-select
              :items="perfiles"
              item-text="tipo"
              item-value="id"
              box
              label="Escoger tipo usuario"
              v-model="perfil"
              required
            ></v-select>
            <v-btn @click="crear" color="success" :disabled="nombre == '' || usuario == '' || codigoEscuela == '' || perfil == '' || clave.length < 5">Crear</v-btn>
          </form>
        </v-flex>
      </v-layout>
    </div>
    <v-snackbar
          v-model="snackbar"
        >
          Creado Correctamente
        <v-btn
          color="green"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    <v-snackbar
        v-model="snackbarError"
        :timeout="timeout"
      >
        {{mensajeError}}
      <v-btn
        color="red"
        flat
        @click="snackbarError = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    clave: '',
    codigoEscuela: '',
    usuario: '',
    snackbar: '',
    nombre: '',
    mensajeError: '',
    snackbarError: false,
    timeout: 10000,
    perfil: '',
    usuarioRules: [
      v => !!v || 'Usuario es requerido'
    ],
    nombreRules: [
      v => !!v || 'Nombre es requerido'
    ],
    claveRules: [val => (val || '').length > 5 || 'Clave debe ser de tamaño mayor o igual a 5']
  }),
  computed: {
    codigos () {
      let codigos = this.$store.getters['obtenerUsuario']['codigos'].split(',')
      return codigos
    },
    escuelas () {
      return this.$store.getters['ObtenerEscuelas']
    },
    perfiles () {
      return this.$store.getters['ObtenerPerfiles']
    }
  },
  methods: {
    salir () {
      this.$store.dispatch('Logout').then((resp) => {
        this.$router.push('/')
      })
    },
    crear () {
      let usuario = { codigoEscuela: this.codigoEscuela, nombre: this.nombre, usuario: this.usuario, perfil: this.perfil, clave: this.clave }
      this.$store.dispatch('UsuarioCrear', usuario).then((resp) => {
        if (resp) {
          this.snackbar = true
          this.codigoEscuela = ''
          this.nombre = ''
          this.usuario = ''
          this.perfil = ''
          this.clave = ''
        } else {
          this.snackbarError = true
          this.mensajeError = 'Persona con ese usuario ya existe'
        }
      })
      .catch((err) => {
        this.snackbarError = true
        this.mensajeError = 'Persona con ese usuario ya existe'
      })
    }
  }
}
</script>

<style>
</style>
