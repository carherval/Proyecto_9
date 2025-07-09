/* Funcionalidades para archivos */

// Permite gestionar archivos en "cloudinary" mediante su API
const cloudinary = require('cloudinary').v2

// Devuelve el "public ID" de un archivo de "cloudinary"
const getPublicIdCloudinary = (pathFile) => {
  return `${pathFile.split('/').at(-2)}/${
    pathFile.split('/').at(-1).split('.')[0]
  }`
}

// Devuelve si un archivo existe en "cloudinary"
const fileExistsInCloudinary = async (publicId) => {
  try {
    await cloudinary.api.resource(publicId)

    return true
  } catch (error) {
    return false
  }
}

// Elimina un archivo de "cloudinary"
const deleteFile = (pathFile, reasonMsg) => {
  const publicId = getPublicIdCloudinary(pathFile)

  // Sólo se elimina si el archivo existe en "cloudinary"
  fileExistsInCloudinary(publicId).then((exists) => {
    if (exists) {
      cloudinary.uploader.destroy(publicId, () => {
        console.log(
          `Archivo "${publicId}" de "Cloudinary" eliminado debido a: ${reasonMsg}`
        )
      })
    }
  })
}

module.exports = { getPublicIdCloudinary, fileExistsInCloudinary, deleteFile }
