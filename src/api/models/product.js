const PRODUCT_COLLECTION_NAME = 'product'

const mongoose = require('mongoose')
const { validation } = require('../../utils/validation')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      unique: [true, `name: ${validation.UNIQUE_MSG}`]
    },
    img: {
      type: String,
      trim: true,
      default: null
    },
    price: {
      type: Number,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: {
        validator: validation.isNumber,
        message: validation.INVALID_NUMBER_MSG
      }
    },
    seller: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG]
    },
    rating: {
      type: Number,
      trim: true,
      validate: [
        {
          validator: (value) => value == null || validation.isNumber(value),
          message: validation.INVALID_NUMBER_MSG
        },
        {
          validator: (value) =>
            value == null || validation.isValidRating(value),
          message: validation.INVALID_RATING_MSG
        }
      ],
      default: null
    }
  },
  {
    timestamps: true
  }
)

productSchema.index(
  { img: 1 },
  {
    unique: true,
    partialFilterExpression: {
      // La restricción sólo salta cuando el campo no está vacío y está repetido
      $and: [{ img: { $type: 'string' } }, { img: { $gt: '' } }]
    }
  }
)

module.exports = { productSchema }

const {
  preValidateProduct,
  preSaveProduct
} = require('../../middlewares/product')
preValidateProduct
preSaveProduct

// Modelo, esquema y colección de los productos
// Si no se especifica, por defecto, la colección es el plural del modelo
const Product = mongoose.model(
  PRODUCT_COLLECTION_NAME,
  productSchema,
  PRODUCT_COLLECTION_NAME
)

module.exports = { Product }
