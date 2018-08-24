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
          <v-select
            :items="codigos"
            box
            label="Escoger código escuela"
            v-model="codigo"
          ></v-select>
          </v-flex>
        </v-layout>
      <v-layout align-center justify-center>

        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12" v-show="codigo != ''">
            <v-toolbar dark color="primary">
              <v-toolbar-title >Subir Archivo</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text >
              <input type="file" class="filepond archivo" name="archivo">
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
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
    snackbar: false,
    codigo: ''
  }),
  computed: {
    usuario () {
      return this.$store.getters['obtenerUsuario']
    },
    codigos () {
      let codigos = this.$store.getters['obtenerUsuario']['codigos'].split(',')
      return codigos
    }
  },
  mounted () {

  },
  watch: {
    codigo () {
      let usuario = this.$store.getters['obtenerUsuario']['codigoEscuela']
      FilePondO.registerPlugin(FilepondPluginFileValidateType)
      FilePondO.setOptions({
        server: {
          url: './api/archivo',
          timeout: 40000,
          process: {
            headers: {
                'cod_escuela': usuario,
                'cod_anio': this.codigo
            }
          }
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
        })
        pond.addEventListener('FilePond:processfile', (e) => {
          this.snackbar = true
        })
      }
    }
  },
  methods: {
    loadTextFromFile(ev) {
      reader.onload = e => {
        this.$store.dispatch('Enviar', x).then(() => {
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
