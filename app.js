process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

// 
const URL = 'http://localhost:14122/ServicioAPCI.svc?wsdl'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const server = require('http').Server(app)
const path = require('path')
const cors = require('cors')
const PORT = 8000
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const soap = require('soap')

// SelectEscuelas ()
// SelectAniosLectivos()
// SelectPerfiles ()

function obtenerEscuelas () {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      resolve([{ id: 1, tipo: 'FEDUCATE' },{ id: 2, tipo: 'GyeIn' }])
    } else {
      let args = {}
      soap.createClient(URL, function(err, client) {
        client.SelectEscuelas(args, function(err, result) {
          let resp = result['SelectEscuelasResult']
          if (resp && resp['CodigoRetorno'].trim() !== '999') {
            // TODO: logica en result
            /*
escuelas:  {"SelectEscuelasResult":{"CodigoRetorno":"000","Escuelas":{"Escuela":
[{"Nombre":"FUNDACION EDUCATE","cod_escuela":"FEDUCATE","id":"253"},{"Nombre":"G
uayaquilIN","cod_escuela":"GyeIn","id":"254"}]},"MensajeRetorno":"OK"}}
            */
            let escuelas = resp['Escuelas']['Escuela']
            let escuelasCodigos = [] 
            for (let codigo in escuelas) {
              escuelasCodigos.push({ id: codigo['id'], tipo: codigo['cod_escuela'] })
            }
            console.log(escuelasCodigos)
            resolve(escuelasCodigos)
          } else {
            resolve([{ id: 1, tipo: 'FEDUCATE' },{ id: 2, tipo: 'GyeIn' }])
          }          
        })
      })
    }
  })
}

function obtenerAnios () {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      resolve('COS2009,COS2010,COS2011,COS2018')
    } else {
      let args = {}
      soap.createClient(URL, function(err, client) {
        client.SelectAniosLectivos(args, function(err, result) {
          let resp = result['SelectAniosLectivosResult']
          if (resp && resp['CodigoRetorno'].trim() !== '999') {
            // TODO: logica en result
            /*
anios: {"SelectAniosLectivosResult":{"AniosLectivos":{"AnioLectivo":[{"cod_anio"
:"COS2009","id":"16","nombre":"COSTA 2009"},{"cod_anio":"COS2010","id":"17","nom
bre":"COSTA 2010"},{"cod_anio":"COS2011","id":"18","nombre":"COSTA 2011"},{"cod_
anio":"COS2018","id":"19","nombre":"COSTA 2018"}]},"CodigoRetorno":"000","Mensaj
eRetorno":"OK"}}

            */
            let anios = resp['AniosLectivos']['AnioLectivo']
            let codigos = [] 
            for (let codigo in anios) {
              codigos.push(codigo['cod_anio'])
            }
            console.log(codigos)
            resolve(codigos.join(","))
          } else {
            resolve('COS2009,COS2010,COS2011,COS2018')
          }
        })
      })
    }
  })
}

function obtenerPerfiles () {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
       resolve([{ id: 2, tipo: 'Administrador de escuela'},{ id: 3, tipo: 'USUARIO ESCUELA'},{ id: 4, tipo: 'PROFESOR'},{ id: 5, tipo: 'DIRECTOR'},{ id: 6, tipo: 'TUTOR'},{ id: 7, tipo: 'VISTAS'}])
    } else {
      let args = {}
      soap.createClient(URL, function(err, client) {
        client.SelectPerfiles(args, function(err, result) {
          let resp = result['SelectPerfilesResult']
          // console.log('perfiles:'  + JSON.stringify(result))
          if (resp && resp['CodigoRetorno'].trim() !== '999') {
            // TODO: logica en result
            /*
perfiles:{"SelectPerfilesResult":{"CodigoRetorno":"000","MensajeRetorno":"OK","Perfiles":{"Perfil":[{"id":"1","nombre":"Superusuario","relacionado_escuela":"fal
se","superusuario":"true"},{"id":"3","nombre":"Administrador de escuela","relaci
onado_escuela":"false","superusuario":"false"},{"id":"4","nombre":"USUARIO ESCUE
LA","relacionado_escuela":"false","superusuario":"false"},{"id":"5","nombre":"PR
OFESOR","relacionado_escuela":"false","superusuario":"false"},{"id":"6","nombre"
:"DIRECTOR","relacionado_escuela":"false","superusuario":"false"},{"id":"7","nom
bre":"TUTOR","relacionado_escuela":"false","superusuario":"false"},{"id":"8","no
mbre":"VISTAS","relacionado_escuela":"false","superusuario":"false"}]}}}

}
            */
            let perfiles = resp['Perfiles']['Perfil']
            let codigos = [] 
            for (let codigo in perfiles) {
              codigos.push({ id: codigo['id'], tipo: codigo['nombre'] })
            }
            console.log(codigos)
            resolve(codigos)
          } else {
            resolve([{ id: 2, tipo: 'Administrador de escuela'},{ id: 3, tipo: 'USUARIO ESCUELA'},{ id: 4, tipo: 'PROFESOR'},{ id: 5, tipo: 'DIRECTOR'},{ id: 6, tipo: 'TUTOR'},{ id: 7, tipo: 'VISTAS'}])
          }
        })
      })
    }
  })
}

function login ({ usuario, clave }, req) {
  return new Promise((resolve, reject) => {
    soap.createClient(URL, function(err, client) {
      client.Login({ Usuario: usuario, Password: clave }, function(err, result) {
        let { Logged } = result['LoginResult']
        if (Logged.trim().toLowerCase() === 'true') {
          req.session.loggeado = true
          req.session.usuario = result['LoginResult']
          let { Codigo, Escuela, IdUsuario, NombreUsuario, Cod_escuela, IdPerfil, Perfil } = result['LoginResult']
          resolve({ estado: true, datos: { codigo: Codigo, escuela: Escuela, id: IdUsuario, nombre: NombreUsuario, codigoEscuela: Cod_escuela, perfilId: IdPerfil, perfil: Perfil }})
        } else {
          resolve({ estado: false, datos: 'El usuario no existe'})
        }
      })
    })
  })
}

function loginDev ({ usuario, clave }, req) {
  return new Promise((resolve, reject) => {
    let perfilId = '1'
    let perfil = 'Superusuario'
    let nombre = 'Admin'
    if (usuario !== 'admin') {
      perfilId = '4'
      perfil = 'PROFESOR'
      nombre = 'Profesor Usuario'
    }
    let result = {}
    req.session.loggeado = true
    result['LoginResult'] = {
      Codigo: 'cod_escuelaTmp',
      NombreUsuario: nombre,
      Codigos: 'COS2009,COS2010,COS2011',
      Cod_escuela: '4',
      Escuela: 'ESPOL',
      IdUsuario: '1',
      IdPerfil: perfilId,
      Perfil: perfil
    }
    req.session.usuario = result['LoginResult']
    let { Codigo, Escuela, IdUsuario, NombreUsuario, Codigos, Cod_escuela, IdPerfil, Perfil } = result['LoginResult']
    resolve({ estado: true, datos: { codigo: Codigo, escuela: Escuela, id: IdUsuario, nombre: NombreUsuario, codigos: Codigos, codigoEscuela: Cod_escuela, perfilId: IdPerfil, perfil: Perfil }})
  })
}

app.post('/api/archivo', upload.single('archivo'), (req, res, next) => {
	if (!req.file || req.file.mimetype != 'text/xml') {
	  res.send({ estado: false, mensaje: 'El archivo no fue enviado'})
	} else {
    try {
      // codigo del webService
      let { cod_escuela, cod_anio } = req.headers
      let args = { cod_escuela, cod_anio, Documentos: req.file.buffer.toString() }
      console.log("enviar archivo: " + JSON.stringify({ cod_escuela, cod_anio }))
      soap.createClient(URL, function(err, client) {
        client.ImportarNotas(args, function(err, result) {
          console.log(err)
          console.log(result)
          let resp = result['ImportarNotasResult']
          if (resp && resp['CodigoRetorno'] && resp['CodigoRetorno'].trim() !== '999') {
            res.send(true)
          } else {
            // resp['MensajeRetorno']
            res.status(400)
            res.json({ estado: false, mensaje: 'No se pudo enviar el archivo'})
          }
        })
      })
      // codigo del webService
    } catch (e) {
      console.log('error')
      res.json({ estado: false, mensaje: 'Server error'})
    }
	}
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(session({
	secret: 'la_secreta',
	resave: true,
	saveUninitialized: true
}))
app.use('/', express.static(path.join(__dirname, 'client/dist')))
app.set('port', PORT)

app.route('/api/login').post((req, res) => {
  let { usuario, clave } = req.body
  if (process.env.NODE_ENV === 'development') {
    Promise.all([loginDev({ usuario, clave }, req), obtenerAnios(), obtenerPerfiles(), obtenerEscuelas()])
    .then(values => {
      let [loginResp, anios, perfiles, escuelas ] = values
      req.session.perfiles = perfiles
      req.session.codigos = anios
      req.session.escuelas = escuelas
      if (!loginResp.estado) {
        res.json(loginResp)
      } else {
        loginResp['datos']['codigos'] = anios
        loginResp['datos']['perfiles'] = perfiles
        loginResp['datos']['escuelas'] = escuelas
        res.json(loginResp)
      }
    })
  } else {
    Promise.all([login({ usuario, clave }, req), obtenerAnios(), obtenerPerfiles(), obtenerEscuelas()])
    .then(values => {
      let [loginResp, anios, perfiles, escuelas ] = values
      req.session.perfiles = perfiles
      req.session.codigos = anios
      req.session.escuelas = escuelas
      if (!loginResp.estado) {
        res.json(loginResp)
      } else {
        loginResp['datos']['codigos'] = anios
        loginResp['datos']['perfiles'] = perfiles
        loginResp['datos']['escuelas'] = escuelas
        res.json(loginResp)
      }
    })
  }
})

app.route('/api/usuarios').post((req, res) => {
  let { codigoEscuela, nombre, usuario, perfil } = req.body
  let args = { cod_escuela: codigoEscuela, Usuario: usuario, Nombres: nombre, IdPerfil: perfil }
  console.log("Args usuario" + JSON.stringify(args))
  if (process.env.NODE_ENV === 'development') {
    res.json({ estado: true, datos: 'Creado Correctamente'})
  } else {
    try {
      soap.createClient(URL, function(err, client) {
        client.CrearUsuario(args, function(err, result) {
          let resp = result['CrearUsuarioResult']
          if (resp && resp['Codigo'].trim() !== '999') {
            res.send(true)
          } else {
            console.log(result)
            res.status(400)
            res.json({ estado: false, mensaje: resp['MensajeRetorno']})
          }
        })
      })
    } catch (err) {
      console.log('error')
      res.json({ estado: false, mensaje: 'Server error'})
    }
  }
})

app.route('/api/estaLogueado').get((req, res) => {
  if (req.session && req.session.loggeado) {
    let perfiles = req.session.perfiles
    let codigos = req.session.codigos
    let escuelas = req.session.escuelas
    let { Codigo, Escuela, IdUsuario, NombreUsuario, Codigos, Cod_escuela, IdPerfil, Perfil } = req.session.usuario
    res.send({ estado: true, datos: { codigo: Codigo, escuela: Escuela, id: IdUsuario, nombre: NombreUsuario, codigos, codigoEscuela: Cod_escuela, perfilId: IdPerfil, perfil: Perfil, perfiles, escuelas }})
  } else {
    res.send({ estado: false, datos: 'No Esta logeado'})
  }
})

app.route('/api/logout').get((req, res) => {
  req.session.destroy(function( err ) {
    if ( err ) {
      console.error(err)
      res.status(401).json({ estado: false })
    } else {
      res.status(200).json({ estado: true })
    }
  })
})

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const port = PORT
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.info(`${bind} correr en otro puerto, este puerto requiere permisos de root`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.info(`${bind} el puerto ya esta en uso client`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `Pipe ${addr}`
    : `Port ${addr.port}`
  if (process.env.NODE_ENV !== 'testing') {
    console.info(`server corriendo en  ${bind}`)
  }
}

server.on('error', onError)
server.on('listening', onListening)
server.listen(app.get('port'))
