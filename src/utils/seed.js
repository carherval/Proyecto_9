const MAX_RESULTS = 500

const fs = require('fs')
const { PRODUCT_JSON_FILE_PATH, scrapeData } = require('./scraper')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const { Product } = require('../api/models/product')
const productCollectionName = Product.collection.name
const { validation } = require('./validation')

// Crea los productos en la colección
const createData = async () => {
  if (!fs.existsSync(PRODUCT_JSON_FILE_PATH)) {
    await scrapeData()
  }

  // Se suprimen "logs" innecesarios
  require('dotenv').config({ quiet: true })
  const dbUrl = process.env.DB_URL
  const dbName = dbUrl.substring(dbUrl.lastIndexOf('/') + 1, dbUrl.indexOf('?'))

  const { PRODUCT_FOLDER_NAME } = require('../middlewares/product')

  try {
    console.log(
      `Se van a generar los datos en la colección "${productCollectionName}"`
    )

    await mongoose.connect(dbUrl)
    console.log(
      `Conexión con la Base de Datos "${dbName}" realizada correctamente`
    )

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log('Conexión con "Cloudinary" realizada correctamente')

    await Product.collection.drop()
    console.log(
      `Se han eliminado los datos antiguos en la colección "${productCollectionName}"`
    )

    // Se eliminan las imágenes de los productos de "cloudinary"
    try {
      await Promise.all(
        (
          await cloudinary.search
            .expression(`folder:${PRODUCT_FOLDER_NAME}`)
            .max_results(MAX_RESULTS)
            .execute()
        ).resources.map((img) => cloudinary.uploader.destroy(img.public_id))
      )

      console.log(
        'Se han eliminado las imágenes de los productos de "Cloudinary"'
      )
    } catch (error) {
      // console.log(error)
      throw new Error(
        `Se ha producido un error durante la eliminación de las imágenes de los productos de "Cloudinary":${validation.CONSOLE_LINE_BREAK}${error.message}`
      )
    }

    try {
      const products = JSON.parse(
        fs.readFileSync(PRODUCT_JSON_FILE_PATH, 'utf8')
      )

      // Se actualizan los productos con la subida de sus imágenes a "cloudinary"
      try {
        await Promise.all(
          products.map(async (product) => {
            product.img = (
              await cloudinary.uploader.upload(product.img, {
                folder: PRODUCT_FOLDER_NAME
              })
            ).secure_url
          })
        )

        console.log(
          'Se han subido las imágenes de los productos a "Cloudinary"'
        )
      } catch (error) {
        // console.log(error)
        throw new Error(
          `Se ha producido un error durante la subida de las imágenes de los productos a "Cloudinary":${validation.CONSOLE_LINE_BREAK}${error.message}`
        )
      }

      await Product.insertMany(products)
      console.log(
        `Se han creado los nuevos datos en la colección "${productCollectionName}"`
      )
    } catch (error) {
      // console.log(error)
      throw new Error(
        `Se ha producido un error durante la carga de los datos en la colección "${productCollectionName}":${validation.CONSOLE_LINE_BREAK}${error.message}`
      )
    }
  } catch (error) {
    console.log(
      `Se ha producido un error durante la carga de los datos:${validation.CONSOLE_LINE_BREAK}${error.message}`
    )
  } finally {
    // No existe la desconexión como tal de "cloudinary"
    await mongoose.disconnect()
    console.log(
      `Se ha realizado la desconexión con la Base de Datos "${dbName}"`
    )
  }
}

createData()
