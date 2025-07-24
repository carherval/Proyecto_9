const productRouter = require('express').Router()
const { productController } = require('../controllers/product')
const { isValidSize } = require('../../middlewares/file')
const { uploadProduct } = require('../../middlewares/product')

productRouter.get('/get/all/', productController.getAllProducts)
productRouter.get('/get/id/:id', productController.getProductById)
productRouter.get('/get/name/:name', productController.getProductsByName)
productRouter.get('/get/price/:price', productController.getProductsByPrice)
productRouter.get('/get/seller/:seller', productController.getProductsBySeller)
productRouter.get('/get/rating/:rating', productController.getProductsByRating)
productRouter.post(
  '/create/',
  isValidSize,
  uploadProduct,
  productController.createProduct
)
productRouter.put(
  '/update/id/:id',
  isValidSize,
  uploadProduct,
  productController.updateProductById
)
productRouter.delete('/delete/id/:id', productController.deleteProductById)

module.exports = { productRouter }
