const URL_TO_SCRAP = 'https://www.pccomponentes.com/juegos-ps5'
const TIMEOUT = 5000
const PRODUCT_JSON_FILE_NAME = 'products.json'
// La ruta del archivo se indica desde el raíz del proyecto
const PRODUCT_JSON_FILE_PATH = `./src/data/${PRODUCT_JSON_FILE_NAME}`

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { validation } = require('../utils/validation')

const products = []

let browser = null

const startBrowser = async () => {
  try {
    console.log('Iniciando el navegador...')

    browser = await puppeteer.launch({
      // Oculta el navegador durante el "scraping"
      headless: false,
      // Evita el bloqueo de "puppeteer" ante errores HTTPS
      ignoreHTTPSErrors: true
    })

    console.log('Navegador iniciado correctamente')
  } catch (error) {
    console.log(
      `Se ha producido un error al iniciar el navegador:${validation.CONSOLE_LINE_BREAK}${error.message}`
    )

    await browser.close()
    browser = null
  }
}

const scrapeData = async () => {
  // Evita que se detecte un comportamiento no humano de "puppeteer"
  puppeteer.use(StealthPlugin())
  await startBrowser()

  if (browser != null) {
    try {
      console.log(`Se van a extraer los datos de "${URL_TO_SCRAP}"`)

      const SELECTOR = 'div[id$="-list-paginator"]'

      const page = await browser.newPage()
      await page.goto(`${URL_TO_SCRAP}`)
      await page.waitForSelector(SELECTOR, { timeout: TIMEOUT })

      const numPags = parseInt(
        await page.$eval(SELECTOR, (numPags) =>
          numPags.textContent.replaceAll('Página 1 de ', '')
        ),
        10
      )

      // Si se cierra la página manualmente, el "scraping" continúa sin abortar
      try {
        await page.close()
      } catch (error) {}

      // Paginación
      for (let numPag = 1; numPag <= numPags; numPag++) {
        const SELECTOR = 'div[id$="-product-grid"]'

        const page = await browser.newPage()
        await page.goto(
          `${URL_TO_SCRAP}${
            !URL_TO_SCRAP.includes('?') ? '?' : '&'
          }page=${numPag}`
        )
        await page.waitForSelector(SELECTOR, { timeout: TIMEOUT })

        try {
          products.push(...(await scrapePage(page, SELECTOR)))
        } catch (error) {
          throw new Error(error.message)
        }

        // Si se cierra la página manualmente, el "scraping" continúa sin abortar
        try {
          await page.close()
        } catch (error) {}
      }

      if (products.length > 0) {
        try {
          createJsonFile()

          console.log(
            `Se ha creado el archivo "${PRODUCT_JSON_FILE_NAME}" correctamente`
          )
          console.log(
            `Se han extraído los datos de "${URL_TO_SCRAP}" correctamente`
          )
        } catch (error) {
          throw new Error(
            `Se ha producido un error al crear el archivo "${PRODUCT_JSON_FILE_NAME}":${validation.CONSOLE_LINE_BREAK}${error.message}`
          )
        }
      } else {
        console.log(
          `No se han encontrado productos en "${URL_TO_SCRAP}" para extraer los datos`
        )
      }
    } catch (error) {
      console.log(
        `Se ha producido un error durante la extracción de los datos de "${URL_TO_SCRAP}":${validation.CONSOLE_LINE_BREAK}${error.message}`
      )
    } finally {
      // await page.close()
      await browser.close()
    }
  }
}

// Realiza el "scraping" de cada página
const scrapePage = async (page, selector) => {
  const products = []

  const productLinkList = await page.$$eval(`${selector} > a`, (products) =>
    products.map((product) => product.href)
  )

  for (productLink in productLinkList) {
    try {
      products.push(await scrapeProduct(productLinkList[productLink]))
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return products
}

// Realiza el "scraping" de cada producto
const scrapeProduct = (productLink) =>
  new Promise(async (resolve, reject) => {
    const page = await browser.newPage()
    await page.goto(productLink)
    await page.waitForSelector('#root', { timeout: TIMEOUT })

    const product = {}

    // Nombre del producto
    product['name'] = await page.$eval('h1', (name) =>
      name.textContent.replace(/ps5/gi, '').trim()
    )

    // Imagen del producto
    product['img'] = await page.$eval(
      '#pdp-section-images ul > li > img',
      (img) => img.src
    )

    // Precio del producto
    product['price'] = await page.$eval('#pdp-price-current-integer', (price) =>
      parseFloat(
        price.textContent
          .replaceAll('€', '')
          .replaceAll('.', '')
          .replaceAll(',', '.')
          .trim()
      )
    )

    // Vendedor del producto
    try {
      // PcComponentes
      product['seller'] = await page.$eval(
        '#pdp-section-offered-by > div > span > span',
        (seller) => seller.textContent.trim()
      )
    } catch (error) {
      // Otro vendedor
      product['seller'] = await page.$eval(
        '#pdp-section-offered-by > div > div > span > a',
        (seller) => seller.textContent.trim()
      )
    }

    // Valoración del producto
    // Puede haber productos sin valoración
    try {
      product['rating'] = await page.$eval(
        '#pdp-section-opinion-info > div > div > span',
        (rating) =>
          parseFloat(
            rating.textContent.split('/')[0].replaceAll(',', '.').trim()
          )
      )
    } catch (error) {
      product['rating'] = null
    }

    resolve(product)

    // Si se cierra la página manualmente, el "scraping" continúa sin abortar
    try {
      await page.close()
    } catch (error) {}
  })

const createJsonFile = () => {
  const fs = require('fs')

  // Los parámetros que se pasan a "JSON.stringfy" permiten dar formato al archivo JSON
  fs.writeFileSync(PRODUCT_JSON_FILE_PATH, JSON.stringify(products, null, 2))
}

module.exports = { PRODUCT_JSON_FILE_NAME, PRODUCT_JSON_FILE_PATH, scrapeData }

// No se ejecuta cuando se importa desde "seed.js"
if (require.main === module) {
  scrapeData()
}
