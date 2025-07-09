const PORT = 3000

const express = require('express')
const videoStore = express()
const { movieRouter } = require('./src/api/routes/movie')
const { directorRouter } = require('./src/api/routes/director')
const { userRouter } = require('./src/api/routes/user')
const { validation } = require('./src/utils/validation')
const { connectToDataBase } = require('./src/config/db')
const { connectToCloudinary } = require('./src/config/cloudinary')

// Permite interpretar las solicitudes HTTP en formato JSON
videoStore.use(express.json())
// Permite interpretar las solicitudes HTTP a través del "req.body" de las rutas
videoStore.use(express.urlencoded({ extended: false }))

// Se definen las rutas de las colecciones
videoStore.use('/movie', movieRouter)
videoStore.use('/director', directorRouter)
videoStore.use('/user', userRouter)

// Gestión de ruta no encontrada
videoStore.use((req, res, next) => {
  const error = new Error(
    `Ruta no encontrada${validation.LINE_BREAK}Comprueba la URL y sus parámetros`
  )

  error.status = 404

  next(error)
})

// Gestión de errores
videoStore.use((error, req, res, next) => {
  console.log(
    `Error ${error.status}: ${error.message.replaceAll(
      validation.LINE_BREAK,
      validation.CONSOLE_LINE_BREAK
    )}`
  )

  return res.status(error.status).send(error.message)
})

videoStore.listen(PORT, async () => {
  console.log(`Servidor express ejecutándose en "http://localhost:${PORT}"`)

  await connectToDataBase()
  connectToCloudinary()
})
