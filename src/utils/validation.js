/* Funcionalidades para validación */

const MOVIE_COLLECTION_NAME = 'movie'
const DIRECTOR_COLLECTION_NAME = 'director'
const USER_COLLECTION_NAME = 'user'

const MIN_YEAR = 1900
const MAX_NUM_COPIES = 5
const PASSWORD_MIN_LENGTH = 8

const ADMIN_USER_NAME = 'admin'
const MANDATORY_MSG = 'El campo es obligatorio y no puede estar vacío'
const UNIQUE_MSG = 'El campo no puede estar repetido'
const ALLOWED_VALUES_MSG = 'Valores válidos'
const INVALID_NUMBER_MSG = 'Número no válido'
const YEAR_FORMAT_MSG = 'Formato correcto: yyyy'
const INVALID_YEAR_MSG = `El año debe ser a partir de ${MIN_YEAR}`
const INVALID_NUM_COPIES_MSG = `El número de copias no debe ser superior a ${MAX_NUM_COPIES}`
const INVALID_PASSWORD_MSG = `La contraseña tiene que estar formada por letras y números y tener una longitud mínima de ${PASSWORD_MIN_LENGTH}`
const INVALID_EMAIL_MSG = 'Correo electrónico no válido'
const INVALID_ID_MSG = 'Identificador no válido'
const LINE_BREAK = '<br /><br />'
const CONSOLE_LINE_BREAK = '\n'

const getLoginMsg = (role = '') => {
  return `Se debe iniciar sesión${
    role !== '' ? ` como "${role}"` : ''
  } para poder acceder al "endpoint"`
}

const getMovieDoesNotExistMsg = (collectionName) => {
  return `Alguna de las películas no existe en la colección "${collectionName}"`
}

const getMovieWithDirectorMsg = (collectionName, lineBreak) => {
  return `Alguna de las películas ya tiene relacionado un director en la colección "${collectionName}"${lineBreak}Una película sólo puede pertenecer a un director`
}

const getCopiesLessThanBorrowingsMsg = (collectionName1, collectionName2) => {
  return `El número de copias de la película en la colección "${collectionName1}" no puede ser inferior al número de copias actualmente prestadas a los usuarios en la colección "${collectionName2}"`
}

const getAllCopiesBorrowedMsg = (collectionName) => {
  return `Alguna de las películas no se puede prestar porque no tiene copias o todas sus copias se encuentran actualmente prestadas a los usuarios en la colección "${collectionName}"`
}

// Devuelve si un array existe y no está vacío
const isNotEmptyArray = (array) => {
  return array != null && array.length > 0
}

// Devuelve si un valor es numérico
const isNumber = (value) => {
  return /^\d{1,}$/.test(value)
}

// Devuelve si un año tiene el formato correcto
const isYear = (year) => {
  return /^\d{4}$/.test(year)
}

// Devuelve si un año es válido
const isValidYear = (year) => {
  return parseInt(year, 10) >= MIN_YEAR
}

// Devuelve si es un número de copias válido
const isValidNumCopies = (numCopies) => {
  return numCopies <= MAX_NUM_COPIES
}

// Devuelve si una contraseña es válida
const isPassword = (password) => {
  return new RegExp(`^[a-zñA-ZÑ\\d]{${PASSWORD_MIN_LENGTH},}$`).test(password)
}

// Devuelve si un correo electrónico es válido
const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Devuelve los valores de un objeto en forma de cadena separados por un separador
const getObjectValues = (object, separator = ' - ') => {
  return Object.values(object).join(separator)
}

// Devuelve las películas ordenadas alfabéticamente por título ignorando tildes, minúsculas y mayúsculas
const sortMovies = (movie1, movie2) => {
  return movie1.title.localeCompare(movie2.title, 'en', {
    sensitivity: 'base'
  })
}

// Devuelve los directores ordenados alfabéticamente por apellidos y nombre ignorando tildes, minúsculas y mayúsculas
const sortDirectors = (director1, director2) => {
  return `${director1.surnames}, ${director1.name}`.localeCompare(
    `${director2.surnames}, ${director2.name}`,
    'en',
    { sensitivity: 'base' }
  )
}

// Devuelve los usuarios ordenados alfabéticamente por nombre de usuario ignorando tildes, minúsculas y mayúsculas
const sortUsers = (user1, user2) => {
  return user1.userName.localeCompare(user2.userName, 'en', {
    sensitivity: 'base'
  })
}

// Devuelve si las películas del array existen en la colección
const moviesExistInCollection = async (movies) => {
  const { Movie } = require('../api/models/movie')

  for (const id of movies) {
    if ((await Movie.findById(id)) == null) {
      return false
    }
  }

  return true
}

// Devuelve un documento con su lista de películas ordenadas alfabéticamente por título y las fechas formateadas
const getDocumentWithSortedMovies = (document) => {
  if (document != null) {
    const moment = require('moment')

    document.movies.sort(sortMovies)
    document = document.toObject()
    document.createdAt = moment(document.createdAt).format(
      'DD/MM/YYYY HH:mm:ss'
    )
    document.updatedAt = moment(document.updatedAt).format(
      'DD/MM/YYYY HH:mm:ss'
    )
  }

  return document
}

// Devuelve los documentos con su lista de películas ordenadas alfabéticamente por título y las fechas formateadas
const getDocumentsWithSortedMovies = (documents) => {
  return documents.map((document) => getDocumentWithSortedMovies(document))
}

// Devuelve una cadena normalizada
// Elimina espacios innecesarios y normaliza signos de puntuación
const normalizeString = (string) => {
  return string
    .replace(/[.,:-]/g, '$& ')
    .replace(/\s+/g, ' ')
    .replace(/\s[.,:-]/g, (match) => match.trim())
    .trim()
}

// Devuelve una cadena de búsqueda normalizada
// Elimina el formato de la expresión regular "/[cadenaBusqueda]/i" (al llamar a "getIgnoreAccentCaseText") y lo pasa a minúsculas
const normalizeSearchString = (searchString) => {
  return searchString.toString().slice(1).slice(0, -2).toLowerCase()
}

// Devuelve un nombre de usuario normalizado
// Elimina espacios, tildes y lo pasa a minúsculas
const normalizeUserName = (userName) => {
  return userName
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

// Devuelve un array normalizado
// Permite la entrada de datos en un modelo para un campo de tipo array mediante una cadena separada por comas
const normalizeArray = (array) => {
  return array
    .toString()
    .split(',')
    .map((elem) => elem.trim())
}

// Devuelve un array eliminando los elementos duplicados
// Se pasan los elementos a cadena porque en un array de "ObjectId" se comparan sus referencias en memoria y no sus valores (las referencias en memoria son siempre diferentes aunque tengan el mismo valor)
const removeDuplicates = (array) => {
  return Array.from(new Set(array.map((elem) => elem.toString())))
}

// Devuelve una expresión regular ignorando tildes, minúsculas y mayúsculas
const getIgnoreAccentCaseText = (string) => {
  return new RegExp(string.normalize('NFD').replace(/\p{Diacritic}/gu, ''), 'i')
}

// Devuelve un mensaje de error formateado
const formatErrorMsg = (msg) => {
  return msg.replaceAll("', '", "','").replaceAll(', ', LINE_BREAK)
}

const validation = {
  MIN_YEAR,
  MAX_NUM_COPIES,
  PASSWORD_MIN_LENGTH,
  ADMIN_USER_NAME,
  MANDATORY_MSG,
  UNIQUE_MSG,
  ALLOWED_VALUES_MSG,
  INVALID_NUMBER_MSG,
  YEAR_FORMAT_MSG,
  INVALID_YEAR_MSG,
  INVALID_NUM_COPIES_MSG,
  INVALID_PASSWORD_MSG,
  INVALID_EMAIL_MSG,
  INVALID_ID_MSG,
  LINE_BREAK,
  CONSOLE_LINE_BREAK,
  getLoginMsg,
  getMovieDoesNotExistMsg,
  getMovieWithDirectorMsg,
  getCopiesLessThanBorrowingsMsg,
  getAllCopiesBorrowedMsg,
  isNotEmptyArray,
  isNumber,
  isYear,
  isValidYear,
  isValidNumCopies,
  isPassword,
  isEmail,
  getObjectValues,
  sortMovies,
  sortDirectors,
  sortUsers,
  moviesExistInCollection,
  getDocumentWithSortedMovies,
  getDocumentsWithSortedMovies,
  normalizeString,
  normalizeSearchString,
  normalizeUserName,
  normalizeArray,
  removeDuplicates,
  getIgnoreAccentCaseText,
  formatErrorMsg
}

module.exports = {
  MOVIE_COLLECTION_NAME,
  DIRECTOR_COLLECTION_NAME,
  USER_COLLECTION_NAME,
  validation
}
