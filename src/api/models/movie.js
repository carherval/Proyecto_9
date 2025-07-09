/* Modelo de datos de películas */

const mongoose = require('mongoose')
const {
  MOVIE_COLLECTION_NAME: movieCollectionName,
  USER_COLLECTION_NAME: userCollectionName,
  validation
} = require('../../utils/validation')

// Géneros
const GENRES = {
  action: 'Acción',
  adventure: 'Aventura',
  war: 'Bélica',
  disaster: 'Catástrofe',
  sciFi: 'Ciencia ficción',
  comedy: 'Comedia',
  documentary: 'Documental',
  drama: 'Drama',
  fantasy: 'Fantasía',
  historical: 'Histórica',
  music: 'Musical',
  crime: 'Policiaca',
  thriller: 'Suspense',
  fear: 'Terror',
  western: 'Western'
}

// Clasificación por edad
const AGE_RATING = {
  0: 0,
  7: 7,
  12: 12,
  16: 16,
  18: 18
}

// Esquema
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      unique: [true, `title: ${validation.UNIQUE_MSG}`]
    },
    poster: {
      type: String,
      trim: true,
      unique: [true, `poster: ${validation.UNIQUE_MSG}`]
    },
    genre: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      enum: {
        values: Object.values(GENRES),
        message: `${
          validation.ALLOWED_VALUES_MSG
        }: ${validation.getObjectValues(GENRES)}`
      }
    },
    ageRating: {
      type: Number,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: {
        validator: validation.isNumber,
        message: validation.INVALID_NUMBER_MSG
      },
      enum: {
        values: Object.values(AGE_RATING),
        message: `${
          validation.ALLOWED_VALUES_MSG
        }: ${validation.getObjectValues(AGE_RATING)}`
      }
    },
    releaseYear: {
      type: String,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: [
        {
          validator: validation.isYear,
          message: validation.YEAR_FORMAT_MSG
        },
        {
          validator: validation.isValidYear,
          message: validation.INVALID_YEAR_MSG
        }
      ]
    },
    minDuration: {
      type: String,
      trim: true,
      validate: {
        validator: validation.isNumber,
        message: validation.INVALID_NUMBER_MSG
      }
    },
    numCopies: {
      type: Number,
      trim: true,
      required: [true, validation.MANDATORY_MSG],
      validate: [
        {
          validator: validation.isNumber,
          message: validation.INVALID_NUMBER_MSG
        },
        {
          validator: validation.isValidNumCopies,
          message: validation.INVALID_NUM_COPIES_MSG
        },
        // Valida si las copias de la película no son inferiores a las copias actualmente prestadas a los usuarios
        {
          validator: async function (numCopies) {
            const { User } = require('./user')

            return (
              numCopies >=
              (await User.find({ movies: { $in: this._id } })).length
            )
          },
          message: validation.getCopiesLessThanBorrowingsMsg(
            movieCollectionName,
            userCollectionName
          )
        }
      ]
    },
    synopsis: { type: String, trim: true }
  },
  {
    timestamps: true
  }
)

module.exports = { movieSchema }

// Middlewares
const { preValidateMovie } = require('../../middlewares/movie')
preValidateMovie

// Modelo, esquema y colección de las películas
// Si no se especifica, por defecto, la colección es el plural del modelo
const Movie = mongoose.model(
  movieCollectionName,
  movieSchema,
  movieCollectionName
)

module.exports = { GENRES, AGE_RATING, Movie }
