/* Controladores de películas */

const mongoose = require('mongoose')
const { Movie } = require('../models/movie')
const movieCollectionName = Movie.collection.name
const { Director } = require('../models/director')
const { validation } = require('../../utils/validation')
const moment = require('moment')
const { deleteFile } = require('../../utils/file')

const getMovieNotFoundByIdMsg = (id) => {
  return `No se ha encontrado ningún película en la colección "${movieCollectionName}" con el identificador "${id}"`
}

// Devuelve una película añadiendo a su información el nombre de su director (apellidos y nombre) y las fechas formateadas
const getMovieWithDirector = async (movie) => {
  if (movie != null) {
    const director = await Director.findOne({
      movies: { $in: movie._id }
    })

    movie = movie.toObject()
    movie.director =
      director != null ? `${director.surnames}, ${director.name}` : ''

    movie.createdAt = moment(movie.createdAt).format('DD/MM/YYYY HH:mm:ss')
    movie.updatedAt = moment(movie.updatedAt).format('DD/MM/YYYY HH:mm:ss')
  }

  return movie
}

// Devuelve las películas añadiendo a su información el nombre de su director (apellidos y nombre) y las fechas formateadas
const getMoviesWithDirector = async (movies) => {
  return await Promise.all(movies.map((movie) => getMovieWithDirector(movie)))
}

// Devuelve todas las películas ordenadas alfabéticamente por título
// Se añade a la información el nombre del director de la película
const getAllMovies = async (req, res, next) => {
  try {
    const movies = (await getMoviesWithDirector(await Movie.find())).sort(
      validation.sortMovies
    )

    if (movies.length > 0) {
      return res.status(200).send(movies)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado películas en la colección "${movieCollectionName}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar las películas en la colección "${movieCollectionName}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve una película mediante su identificador
// Se añade a la información el nombre del director de la película
const getMovieById = async (req, res, next) => {
  const { id } = req.params

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const movie = await getMovieWithDirector(await Movie.findById(id))

    if (movie != null) {
      return res.status(200).send(movie)
    } else {
      return res.status(404).send(getMovieNotFoundByIdMsg(id))
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${movieCollectionName}" la película con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve las películas filtradas por título y ordenadas alfabéticamente por título
// Se añade a la información el nombre del director de la película
const getMoviesByTitle = async (req, res, next) => {
  const title = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.title)
  )

  try {
    const movies = (
      await getMoviesWithDirector(await Movie.find({ title }))
    ).sort(validation.sortMovies)

    if (movies.length > 0) {
      return res.status(200).send(movies)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado películas en la colección "${movieCollectionName}" cuyo título contenga "${validation.normalizeSearchString(
            title
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${movieCollectionName}" las películas cuyo título contenga "${validation.normalizeSearchString(
      title
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve las películas filtradas por género y ordenadas alfabéticamente por título
// Se añade a la información el nombre del director de la película
const getMoviesByGenre = async (req, res, next) => {
  const genre = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.genre)
  )

  try {
    const movies = (
      await getMoviesWithDirector(await Movie.find({ genre: { $in: genre } }))
    ).sort(validation.sortMovies)

    if (movies.length > 0) {
      return res.status(200).send(movies)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado películas en la colección "${movieCollectionName}" cuyo género contenga "${validation.normalizeSearchString(
            genre
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${movieCollectionName}" las películas cuyo género contenga "${validation.normalizeSearchString(
      genre
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve las películas filtradas por clasificación por edad y ordenadas alfabéticamente por título
// Se añade a la información el nombre del director de la película
const getMoviesByAgeRating = async (req, res, next) => {
  const ageRating = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.ageRating)
  )

  try {
    if (!validation.isNumber(ageRating)) {
      throw new Error(`${validation.INVALID_NUMBER_MSG}: "${ageRating}"`)
    }

    const movies = (
      await getMoviesWithDirector(
        await Movie.find({ ageRating: { $gte: ageRating } })
      )
    ).sort(validation.sortMovies)

    if (movies.length > 0) {
      return res.status(200).send(movies)
    } else {
      return res
        .status(404)
        .send(
          `No se han encontrado películas en la colección "${movieCollectionName}" que cumplan con la clasificación por edad "${validation.normalizeSearchString(
            ageRating
          )}"`
        )
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${movieCollectionName}" las películas que cumplan con la clasificación por edad "${validation.normalizeSearchString(
      ageRating
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Devuelve las películas filtradas por apellidos o nombre del director y ordenadas alfabéticamente por título
// Se añade a la información el nombre del director de la película
const getMoviesByDirectorName = async (req, res, next) => {
  const name = validation.getIgnoreAccentCaseText(
    validation.normalizeString(req.params.name)
  )
  const MOVIES_NOT_FOUND_BY_DIRECTOR_NAME_MSG = `No se han encontrado películas en la colección "${movieCollectionName}" cuyo director contenga en los apellidos o en el nombre "${validation.normalizeSearchString(
    name
  )}"`

  try {
    const directors = await Director.find({
      $or: [{ surnames: name }, { name }]
    }).populate('movies')

    if (directors.length > 0) {
      const movies = (
        await getMoviesWithDirector(
          directors.reduce((acc, director) => acc.concat(director.movies), [])
        )
      ).sort(validation.sortMovies)

      if (movies.length > 0) {
        return res.status(200).send(movies)
      } else {
        return res.status(404).send(MOVIES_NOT_FOUND_BY_DIRECTOR_NAME_MSG)
      }
    } else {
      return res.status(404).send(MOVIES_NOT_FOUND_BY_DIRECTOR_NAME_MSG)
    }
  } catch (error) {
    error.message = `Se ha producido un error al consultar en la colección "${movieCollectionName}" las películas cuyo director contenga en los apellidos o en el nombre "${validation.normalizeSearchString(
      name
    )}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  }
}

// Crea una película nueva
const createMovie = async (req, res, next) => {
  const isUploadedFile = req.file != null && req.file.path != null

  try {
    const newMovie = new Movie(req.body)

    if (isUploadedFile) {
      newMovie.poster = req.file.path
    }

    return res
      .status(201)
      .send(await getMovieWithDirector(await newMovie.save()))
  } catch (error) {
    const msg = `Se ha producido un error al crear la película en la colección "${movieCollectionName}"`

    // Si falla el borrado del cartel de la película, ocupará espacio en "cloudinary"
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

// Actualiza una película existente mediante su identificador
const updateMovieById = async (req, res, next) => {
  const { id } = req.params
  const isUploadedFile = req.file != null && req.file.path != null

  try {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const movie = await Movie.findById(id)

    if (movie == null) {
      throw new Error(getMovieNotFoundByIdMsg(id))
    }

    if (Object.keys(req.body).length === 0 && req.file == null) {
      throw new Error(
        `No se ha introducido ningún dato para actualizar la película con el identificador "${id}"`
      )
    }

    // Se obtiene la información de la película a actualizar
    let updatedMovie = new Movie(movie)

    // Siempre que se actualiza el cartel de la película, se elimina el que esté subido a "cloudinary"
    if (isUploadedFile || req.body.poster != null) {
      const { getPublicIdCloudinary } = require('../../utils/file')

      deleteFile(
        updatedMovie.poster,
        `Actualización en la colección "${movieCollectionName}" del cartel "${
          isUploadedFile
            ? getPublicIdCloudinary(req.file.path)
            : req.body.poster
        }" de la película con el identificador "${id}"`
      )
    }

    // Se sustituye la información de la película a actualizar por la introducida por el usuario
    const {
      title,
      poster,
      genre,
      ageRating,
      releaseYear,
      minDuration,
      numCopies,
      synopsis
    } = req.body

    updatedMovie.title = title ?? updatedMovie.title
    updatedMovie.poster = isUploadedFile
      ? req.file.path
      : poster ?? updatedMovie.poster
    updatedMovie.genre = genre ?? updatedMovie.genre
    updatedMovie.ageRating = ageRating ?? updatedMovie.ageRating
    updatedMovie.releaseYear = releaseYear ?? updatedMovie.releaseYear
    updatedMovie.minDuration = minDuration ?? updatedMovie.minDuration
    updatedMovie.numCopies = numCopies ?? updatedMovie.numCopies
    updatedMovie.synopsis = synopsis ?? updatedMovie.synopsis

    return res
      .status(201)
      .send(await getMovieWithDirector(await updatedMovie.save()))
  } catch (error) {
    const msg = `Se ha producido un error al actualizar en la colección "${movieCollectionName}" la película con el identificador "${id}"`

    // Si falla el borrado del cartel de la película, ocupará espacio en "cloudinary"
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

// Elimina una película existente mediante su identificador
// Si un director tiene relacionada la película eliminada, se elimina de la lista de películas de su director
// Se usa una sesión y una transacción para almacenar varias operaciones
const deleteMovieById = async (req, res, next) => {
  const { id } = req.params
  // Inicio de la sesión
  const session = await mongoose.startSession()

  try {
    // Inicio de la transacción de la sesión
    session.startTransaction()

    if (!mongoose.isValidObjectId(id)) {
      throw new Error(validation.INVALID_ID_MSG)
    }

    const movie = await Movie.findById(id)

    if (movie == null) {
      throw new Error(getMovieNotFoundByIdMsg(id))
    }

    const { User } = require('../models/user')

    if ((await User.find({ movies: { $in: id } })).length > 0) {
      throw new Error(
        `La película no se puede eliminar porque está siendo actualmente prestada a los usuarios en la colección "${User.collection.name}"`
      )
    }

    // Primero se elimina la película
    await Movie.deleteOne(movie, { session })

    // Después se elimina la película de la lista de películas de su director
    const directors = await Director.find({ movies: { $in: id } })
    const deletedMovieFromDirectorMsg =
      directors.length > 0
        ? `${validation.LINE_BREAK}Se ha eliminado la película con el identificador "${id}" de la lista de películas de su director`
        : ''

    try {
      for (const director of directors) {
        director.movies = director.movies
          .map((id) => id.toJSON())
          .filter((movieId) => movieId !== id)

        // Se actualiza el director
        await new Director(director).save({ session })
      }
    } catch (error) {
      throw new Error(
        `Se ha producido un error al eliminar la película con el identificador "${id}" de la lista de películas de su director:${validation.LINE_BREAK}${error.message}`
      )
    }

    const msg = `Se ha eliminado en la colección "${movieCollectionName}" la película con el identificador "${id}"`

    // Se elimina el cartel de la película
    deleteFile(movie.poster, msg)

    // Commit de la transacción
    await session.commitTransaction()

    return res.status(200).send(msg + deletedMovieFromDirectorMsg)
  } catch (error) {
    // Rollback de la transacción
    await session.abortTransaction()

    error.message = `Se ha producido un error al eliminar en la colección "${movieCollectionName}" la película con el identificador "${id}":${validation.LINE_BREAK}${error.message}`
    error.status = 500
    next(error)
  } finally {
    // En cualquier caso, se finaliza la sesión
    session.endSession()
  }
}

const movieController = {
  getAllMovies,
  getMovieById,
  getMoviesByTitle,
  getMoviesByGenre,
  getMoviesByAgeRating,
  getMoviesByDirectorName,
  createMovie,
  updateMovieById,
  deleteMovieById
}

module.exports = { movieController }
