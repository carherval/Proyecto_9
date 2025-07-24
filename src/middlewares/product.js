const PRODUCT_FOLDER_NAME = 'Products'

const multer = require('multer')
const { storageConfig } = require('./file')
const { productSchema } = require('../api/models/product')
const { validation } = require('../utils/validation')

const uploadProduct = (req, res, next) => {
  // Se pasa como parámetro el nombre del campo de la solicitud HTTP (formulario HTML) de tipo "file"
  multer({ storage: storageConfig(PRODUCT_FOLDER_NAME) }).single('img')(
    req,
    res,
    (error) => {
      if (error != null || (req.file != null && req.file.path == null)) {
        return res
          .status(400)
          .send(
            `Se ha producido un error al subir la imagen del producto a "Cloudinary"${
              error != null ? ':' + validation.LINE_BREAK + error.message : ''
            }`
          )
      }

      next()
    }
  )
}

const preValidateProduct = productSchema.pre('validate', function (next) {
  if (this.name != null) {
    this.name = validation.normalizeString(this.name)
  }

  next()
})

const preSaveProduct = productSchema.pre('save', function (next) {
  if (this.img === '') {
    this.img = null
  }

  next()
})

module.exports = {
  PRODUCT_FOLDER_NAME,
  uploadProduct,
  preValidateProduct,
  preSaveProduct
}
