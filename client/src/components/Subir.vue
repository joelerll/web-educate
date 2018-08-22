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
      <h2 class="title">Usuario: </h2>
      <h1 class="title">{{usuario.usuario}}</h1>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title >Subir Archivo</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <input type="file" class="filepond archivo" name="archivo">
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- <h1></h1>
      <label class="text-reader">
         Subir Archivo
        <input type="file" @change="loadTextFromFile">
        <input type="file" class="filepond archivo" name="archivo">
      </label> -->

      <v-snackbar
          v-model="snackbar"
        >
          Enviado Correctamente
        <v-btn
          color="green"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </div>

</template>

<script>
import * as FilePondO from 'filepond'
import 'filepond/dist/filepond.css'
import FilepondPluginFileValidateType from 'filepond-plugin-file-validate-type';
export default {
  data: () => ({
    files: [],
    snackbar: false
  }),
  computed: {
    usuario () {
      return this.$store.getters['obtenerUsuario']
    }
  },
  mounted () {
    FilePondO.registerPlugin(FilepondPluginFileValidateType)
    FilePondO.setOptions({
      server: {
        url: './api/archivo',
        timeout: 40000
      }
    })
    for (let pond of document.querySelectorAll('.archivo')) {
      FilePondO.create(pond, {
        labelIdle: `Subir archivo... <span class="filepond--label-action">Buscar</span>`,
        labelFileLoading: 'Subiendo',
        labelFileProcessing: 'Subiendo',
        labelFileTypeNotAllowed: 'El tipo de archivo no es válido',
        fileValidateTypeLabelExpectedTypes: 'Se espera xml',
        labelFileProcessingComplete: 'Completada',
        labelTapToCancel: 'Toque para cancelar',
        labelTapToUndo: 'Toque para eliminar',
        acceptedFileTypes: ['text/xml']
      })
    }
    for (let pond of document.querySelectorAll('.archivo')) {
      pond.addEventListener('FilePond:addfile', (e) => {
      })
      pond.addEventListener('FilePond:addfilestart', (e) => {
        console.log('aa')
      })
      pond.addEventListener('FilePond:processfile', (e) => {
        this.snackbar = true
      })
    }
  },
  methods: {
    loadTextFromFile(ev) {
      console.log('aa')
      let self = this
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file)
      reader.onload = e => {
        this.$store.dispatch('Enviar', e.target.result).then(() => {
          this.snackbar = true
        })
      }
    },
    salir () {
      this.$store.dispatch('Logout').then((resp) => {
        this.$router.push('/')
      })
    }
  }
};
</script>

<style>
.filepond--root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
}

</style>
