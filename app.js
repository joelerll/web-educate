process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

const URL_LOGIN = 'http://example.com/wsdl?wsdl'
const URL_ARCHIVO = 'http://example.com/wsdl?wsdl'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const server = require('http').Server(app)
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || '8000'
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const soap = require('soap')

app.post('/api/archivo', upload.single('archivo'), (req, res, next) => {
	if (!req.file || req.file.mimetype != 'text/xml') {
	  res.send({ estado: false, mensaje: 'El archivo no fue enviado'})
	} else {
	  console.log(req.file.buffer.toString())
	  // codigo del webService
 //  	soap.createClient(URL_ARCHIVO, function(err, client) {
	//   client.MyFunction(args, function(err, result) {
	//       console.log(result)
	//   })
	// })
	// codigo del webService
	  res.send(true)
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
  const args = { usuario, clave }
  if (usuario === 'admin' && clave === 'admin') {
  	req.session.loggeado = true
  	req.session.usuario = usuario

  	// codigo del webService
 //  	soap.createClient(URL_LOGIN, function(err, client) {
	//   client.MyFunction(args, function(err, result) {
	//       console.log(result)
	//   })
	// })
	// codigo del webService

  	res.send(true)
  } else {
  	res.send(false)
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
  const port = process.env.PORT
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
