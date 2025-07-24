const MAX_RATING = 5

const MANDATORY_MSG = 'El campo es obligatorio y no puede estar vacío'
const UNIQUE_MSG = 'El campo no puede estar repetido'
const INVALID_NUMBER_MSG =
  'Número no válido. Tiene que ser no negativo (punto decimal opcional seguido de 2 decimales como máximo)'
const INVALID_RATING_MSG = `La valoración no debe ser superior a ${MAX_RATING}`
const INVALID_ID_MSG = 'Identificador no válido'
const LINE_BREAK = '<br /><br />'
const CONSOLE_LINE_BREAK = '\n'

const isNumber = (value) => {
  return /^\d+(\.\d{1,2})?$/.test(value)
}

const isValidRating = (rating) => {
  return rating <= MAX_RATING
}

// Ordena los productos alfabéticamente por nombre ignorando tildes, minúsculas y mayúsculas
const sortProducts = (product1, product2) => {
  return product1.name.localeCompare(product2.name, 'en', {
    sensitivity: 'base'
  })
}

// Elimina espacios innecesarios y normaliza signos de puntuación
const normalizeString = (string) => {
  return string
    .replace(/[.,:-]/g, '$& ')
    .replace(/\s+/g, ' ')
    .replace(/\s[.,:-]/g, (match) => match.trim())
    .trim()
}

// Elimina el formato de la expresión regular "/[cadenaBusqueda]/i" (al llamar a "getIgnoreAccentCaseText") y lo pasa a minúsculas
const normalizeSearchString = (searchString) => {
  return searchString.toString().slice(1).slice(0, -2).toLowerCase()
}

// Devuelve una expresión regular ignorando tildes, minúsculas y mayúsculas
const getIgnoreAccentCaseText = (string) => {
  return new RegExp(string.normalize('NFD').replace(/\p{Diacritic}/gu, ''), 'i')
}

const formatErrorMsg = (msg) => {
  return msg.replaceAll("', '", "','").replaceAll(', ', LINE_BREAK)
}

const validation = {
  MAX_RATING,
  MANDATORY_MSG,
  UNIQUE_MSG,
  INVALID_NUMBER_MSG,
  INVALID_RATING_MSG,
  INVALID_ID_MSG,
  LINE_BREAK,
  CONSOLE_LINE_BREAK,
  isNumber,
  isValidRating,
  sortProducts,
  normalizeString,
  normalizeSearchString,
  getIgnoreAccentCaseText,
  formatErrorMsg
}

module.exports = { validation }
