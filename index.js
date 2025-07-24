const PORT = 3000

const express = require('express')
const products = express()
const { productRouter } = require('./src/api/routes/product')
const { validation } = require('./src/utils/validation')
const { connectToDataBase } = require('./src/config/db')
const { connectToCloudinary } = require('./src/config/cloudinary')

products.use(express.json())
// Interpreta las solicitudes HTTP a través del "req.body" de las rutas
products.use(express.urlencoded({ extended: false }))

products.use('/product', productRouter)

// Gestión de ruta no encontrada
products.use((req, res, next) => {
  const error = new Error(
    `Ruta no encontrada${validation.LINE_BREAK}Comprueba la URL y sus parámetros`
  )

  error.status = 404

  next(error)
})

// Gestión de errores
products.use((error, req, res, next) => {
  console.log(
    `Error ${error.status}: ${error.message.replaceAll(
      validation.LINE_BREAK,
      validation.CONSOLE_LINE_BREAK
    )}`
  )

  return res.status(error.status).send(error.message)
})

products.listen(PORT, async () => {
  console.log(`Servidor express ejecutándose en "http://localhost:${PORT}"`)

  await connectToDataBase()
  connectToCloudinary()
})
