const mongoose = require('mongoose')
const { Product } = require('../models/product')
const productCollectionName = Product.collection.name
const { validation } = require('../../utils/validation')
const moment = require('moment')
const { deleteFile } = require('../../utils/file')

const getProductNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún producto en la colección "${productCollectionName}" con el identificador "${id}"`
}

const getProductWithFormattedDates = async (product) => {
  if (product != null) {
    product = product.toObject()
    product.createdAt = moment(product.createdAt).format('DD/MM/YYYY HH:mm:ss')
    product.updatedAt = moment(product.updatedAt).format('DD/MM/YYYY HH:mm:ss')
  }

  return product
}

const getProductsWithFormattedDates = async (products) => {
  return await Promise.all(
    products.map((product) => getProductWithFormattedDates(product))
  )
}

const getAllProducts = async (req, res, next) => {
  try {
    const products = (
      await getProductsWithFormattedDates(await Product.find())
    ).sort(validation.sortProducts)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado productos en la colección "${productCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar los productos en la colección "${productCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const product = await getProductWithFormattedDates(
      await Product.findById(id)
    )

    if (product != null) {
      return res.status(200).send(product)
    } else {
      return res.status(404).send(getProductNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${productCollectionName}" el producto con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const getProductsByName = async (req, res, next) => {
  const name = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.name)
  )

  try {
    const products = (
      await getProductsWithFormattedDates(await Product.find({ name }))
    ).sort(validation.sortProducts)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado productos en la colección "${productCollectionName}" cuyo nombre contenga "${validation.normalizeSearchString(
            name
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${productCollectionName}" los productos cuyo nombre contenga "${validation.normalizeSearchString(
      name
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const getProductsByPrice = async (req, res, next) => {
  const { price } = req.params

  try {
    if (!validation.isNumber(price)) {
      throw new Error(`${validation.INVALID_NUMBER_MSG}: "${price}"`)
    }

    const products = (
      await getProductsWithFormattedDates(
        await Product.find({ price: { $lte: price } })
      )
    ).sort(validation.sortProducts)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado productos en la colección "${productCollectionName}" con un precio igual o inferior a "${price}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${productCollectionName}" los productos con un precio igual o inferior a "${price}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const getProductsBySeller = async (req, res, next) => {
  const seller = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.seller)
  )

  try {
    const products = (
      await getProductsWithFormattedDates(await Product.find({ seller }))
    ).sort(validation.sortProducts)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado productos en la colección "${productCollectionName}" cuyo vendedor contenga "${validation.normalizeSearchString(
            seller
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${productCollectionName}" los productos cuyo vendedor contenga "${validation.normalizeSearchString(
      seller
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const getProductsByRating = async (req, res, next) => {
  const { rating } = req.params

  try {
    if (!validation.isNumber(rating)) {
      throw new Error(`${validation.INVALID_NUMBER_MSG}: "${rating}"`)
    }

    const products = (
      await getProductsWithFormattedDates(
        await Product.find({ rating: { $gte: rating } })
      )
    ).sort(validation.sortProducts)

    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado productos en la colección "${productCollectionName}" con una valoración igual o superior a "${rating}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${productCollectionName}" los productos con una valoración igual o superior a "${rating}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

const createProduct = async (req, res, next) => {
  const isUploadedFile = req.file != null && req.file.path != null

  try {
    // Se trata el nulo aquí y no en el "middleware" "pre save" porque una cadena de espacios en blanco lo toma por 0 al hacer el "cast"
    if (req.body.rating == null || req.body.rating.trim().length === 0) {
      req.body.rating = null
    }

    const newProduct = new Product(req.body)

    if (isUploadedFile) {
      newProduct.img = req.file.path
    }

    return res
      .status(201)
      .send(await getProductWithFormattedDates(await newProduct.save()))
  } catch (error) {
    const msg = `Se ha producido un error al crear el producto en la colección "${productCollectionName}"`

    if (isUploadedFile) {
      deleteFile(req.file.path, msg)
    }

    error.message = `${msg}:${validation.LINE_BREAK}${validation.formatErrorMsg(
      error.message
    )}`
    error.status = 500
    next(error)
  }
}

const updateProductById = async (req, res, next) => {
  const { id } = req.params
  const isUploadedFile = req.file != null && req.file.path != null

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const product = await Product.findById(id)

    if (product == null) {
      throw new Error(getProductNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0 && req.file == null) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar el producto con el identificador "${id}"`
      )
    }

    let updatedProduct = new Product(product)

    // Siempre que se actualiza la imagen del producto, se elimina la que esté subida a "cloudinary"
    if (isUploadedFile || req.body.img != null) {
      const { getPublicIdCloudinary } = require('../../utils/file')

      deleteFile(
        updatedProduct.img,
        `Actualización en la colección "${productCollectionName}" de la imagen "${
          isUploadedFile ? getPublicIdCloudinary(req.file.path) : req.body.img
        }" del producto con el identificador "${id}"`
      )
    }

    // Se sustituye la información del producto a actualizar por la introducida por el usuario
    const { name, img, price, seller, rating } = req.body

    updatedProduct.name = name ?? updatedProduct.name
    updatedProduct.img = isUploadedFile
      ? req.file.path
      : img ?? updatedProduct.img
    updatedProduct.price = price ?? updatedProduct.price
    updatedProduct.seller = seller ?? updatedProduct.seller
    // Se trata el nulo aquí y no en el "middleware" "pre save" porque una cadena de espacios en blanco lo toma por 0 al hacer el "cast"
    updatedProduct.rating =
      rating == null || rating.trim().length === 0
        ? null
        : updatedProduct.rating

    return res
      .status(201)
      .send(await getProductWithFormattedDates(await updatedProduct.save()))
  } catch (error) {
    const msg = `Se ha producido un error al actualizar en la colección "${productCollectionName}" el producto con el identificador "${id}"`

    if (isUploadedFile) {
      deleteFile(req.file.path, msg)
    }

    error.message = `${msg}:${validation.LINE_BREAK}${validation.formatErrorMsg(
      error.message
    )}`
    error.status = 500
    next(error)
  }
}

const deleteProductById = async (req, res, next) => {
  const { id } = req.params
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const product = await Product.findById(id)

    if (product == null) {
      throw new Error(getProductNotFoundByIdMsg(id))
    }

    await Product.deleteOne(product, { session })

    const msg = `Se ha eliminado en la colección "${productCollectionName}" el producto con el identificador "${id}"`

    deleteFile(product.img, msg)

    await session.commitTransaction()

    return res.status(200).send(msg)
  } catch (error) {
    await session.abortTransaction()

    error.message = `Se ha producido un error al eliminar en la colección "${productCollectionName}" el producto con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  } finally {
    session.endSession()
  }
}

const productController = {
  getAllProducts,
  getProductById,
  getProductsByName,
  getProductsByPrice,
  getProductsBySeller,
  getProductsByRating,
  createProduct,
  updateProductById,
  deleteProductById
}

module.exports = { productController }
