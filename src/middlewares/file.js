/* Middlewares de archivos */

// Permite gestionar archivos en "cloudinary" mediante su API
const cloudinary = require('cloudinary').v2
// Permite a "multer" almacenar archivos en "cloudinary"
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Devuelve si un archivo tiene un tamaño válido
const isValidSize = (req, res, next) => {
  // MB
  const MAX_SIZE = 5

  // Longitud (tamaño) de un archivo enviado a través de una solicitud HTTP (formulario HTML)
  const contentLength = req.headers['content-length']

  if (
    contentLength != null &&
    parseInt(contentLength) > MAX_SIZE * 1024 * 1204
  ) {
    const { validation } = require('../utils/validation')

    return res
      .status(413)
      .send(
        `Se ha producido un error al subir el archivo a "Cloudinary":${validation.LINE_BREAK}El tamaño no debe ser superior a ${MAX_SIZE} MB`
      )
  }

  next()
}

// Configuración del almacenamiento
const storageConfig = (folderName) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    }
  })

module.exports = { isValidSize, storageConfig }
