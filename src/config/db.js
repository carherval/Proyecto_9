/* Funcionalidades para la configuración de la Base de Datos */

// Realiza la conexión con la Base de Datos "video-store"
const connectToDataBase = async () => {
  // Permite cargar variables de entorno desde un archivo ".env"
  require('dotenv').config()
  const dbUrl = process.env.DB_URL
  const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1, dbUrl.indexOf('?'))

  try {
    console.log(`Conectándose con la Base de Datos "${dbName}"...`)

    await require('mongoose').connect(dbUrl)

    console.log(
      `Conexión con la Base de Datos "${dbName}" realizada correctamente`
    )
  } catch (error) {
    const { validation } = require('../utils/validation')

    console.log(
      `Se ha producido un error al conectar con la Base de Datos "${dbName}":${validation.CONSOLE_LINE_BREAK}${error.message}`
    )
  }
}

module.exports = { connectToDataBase }
