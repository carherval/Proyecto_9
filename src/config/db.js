const connectToDataBase = async () => {
  // Se suprimen "logs" innecesarios
  require('dotenv').config({ quiet: true })
  const dbUrl = process.env.DB_URL
  const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1, dbUrl.indexOf('?'))

  try {
    console.log(`Conectándose con la Base de Datos "${dbName}"...`)

    await require('mongoose').connect(dbUrl)

    // // Se recrean los índices de los productos
    // const { Product } = require('../api/models/product')

    // for (const index of await Product.collection.indexes()) {
    //   // El índice "_id_" es obligatorio
    //   if (index.name !== '_id_') {
    //     await Product.collection.dropIndex(index.name)
    //   }
    // }

    // await Product.syncIndexes()

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
