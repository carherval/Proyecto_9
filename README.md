# Products

**_Products_** es una Base de Datos sencilla que implementa un **CRUD** completo sobre una colección de datos, la de productos (**_product_**).

Para el almacenamiento de las imágenes de los productos se usa el servicio de [Cloudinary].

Se recomienda el uso de alguna aplicación que permita probar la **API** de la aplicación mediante el envío de peticiones **HTTP** y la recepción de sus correspondientes respuestas, como puede ser [Insomnia].

## Colección _product_

A continuación se detallan los datos que almacena un producto de la colección **_product_**:

| CAMPO        | DESCRIPCIÓN                | TIPO        | OBLIGATORIO | ÚNICO | VALOR                                                         |
| ------------ | -------------------------- | ----------- | ----------- | ----- | ------------------------------------------------------------- |
| **\__id_**   | Identificador del producto | Hexadecimal | Sí          | Sí    | **Automático**                                                |
| **_name_**   | Nombre del producto        | Texto       | Sí          | Sí    | Texto libre                                                   |
| **_img_**    | Imagen del producto        | Texto       | No          | Sí    | Ruta del archivo subido a **Cloudinary**                      |
| **_price_**  | Precio del producto        | Número      | Sí          | No    | Número válido (no negativo, entero ó 2 decimales como máximo) |
| **_seller_** | Vendedor del producto      | Texto       | Sí          | No    | Texto libre                                                   |
| **_rating_** | Valoración del producto    | Número      | No          | No    | Entre 0 y 5                                                   |

## Instalación y ejecución de la aplicación

Una vez descargada la aplicación del repositorio de [GitHub] se debe ir al directorio raíz (**_Proyecto_9_**) y ejecutar el siguiente comando de **Node.js**:

```sh
npm run dev
```

Se debe crear primero el archivo **_products.json_** utilizando la técnica de **_scraping_** a una página de [PcComponentes] mediante el siguiente comando de **Node.js**:

```sh
npm run scrapeData
```

Si se desea, se puede ejecutar **a continuación** una carga inicial de datos en la colección **_product_** (así como una subida de las imágenes de los productos a **Cloudinary**) mediante el siguiente comando de **Node.js**:

```sh
npm run createData
```

**`IMPORTANTE:`** `la carga inicial elimina todos los datos almacenados previamente en la colección` **_`product`_** `y elimina los archivos de las imágenes de los productos subidos a ` **`Cloudinary`**

**`IMPORTANTE:`** **_`createData`_** `ejecuta` **_`scrapeData`_** `si el archivo` **_`products.json`_** `no está creado`

## Endpoints de la colección _product_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_product_** y sus posibles respuestas:

| MÉTODO | URL                                       | DESCRIPCIÓN                     | PARÁMETROS                 | CUERPO DE LA PETICIÓN                                           | CÓDIGO DE RESPUESTA | RESPUESTA                                                          |
| ------ | ----------------------------------------- | ------------------------------- | -------------------------- | --------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------ |
| GET    | http://localhost:3000/product/get/all/    | Búsqueda de todos los productos |                            |                                                                 | 200                 | Lista de todos los productos ordenados por nombre                  |
| GET    | http://localhost:3000/product/get/id/     | Búsqueda de un producto         | Identificador del producto |                                                                 | 200                 | Producto                                                           |
| GET    | http://localhost:3000/product/get/name/   | Búsqueda filtrada               | Nombre del producto        |                                                                 | 200                 | Lista de productos filtrados por nombre y ordenados por nombre     |
| GET    | http://localhost:3000/product/get/price/  | Búsqueda filtrada               | Precio del producto        |                                                                 | 200                 | Lista de productos filtrados por precio y ordenados por nombre     |
| GET    | http://localhost:3000/product/get/seller/ | Búsqueda filtrada               | Vendedor del producto      |                                                                 | 200                 | Lista de productos filtrados por vendedor y ordenados por nombre   |
| GET    | http://localhost:3000/product/get/rating/ | Búsqueda filtrada               | Valoración del producto    |                                                                 | 200                 | Lista de productos filtrados por valoración y ordenados por nombre |
| POST   | http://localhost:3000/product/create/     | Creación de un producto         |                            | **Multipart Form Data** con los campos del producto a crear     | 201                 | Producto creado                                                    |
| PUT    | http://localhost:3000/product/update/id/  | Modificación de un producto     | Identificador del producto | **Multipart Form Data** con los campos a modificar del producto | 201                 | Producto modificado                                                |
| DEL    | http://localhost:3000/product/delete/id/  | Eliminación de un producto      | Identificador del producto |                                                                 | 200                 | Mensaje de confirmación de eliminación del producto                |

- El código de respuesta también puede ser **400** cuando falla la subida de la imagen del producto a **Cloudinary**
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **413** cuando falla la subida de la imagen del producto a **Cloudinary** por no tener un tamaño válido
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **Multipart Form Data** en los métodos **POST** y **PUT**)

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **Multipart Form Data** con la información necesaria de los campos

> El campo para la imagen del producto puede ser de tipo texto o de tipo **file** mediante la selección de un archivo válido del disco (restricción en cuanto a tamaño y extensión del archivo)

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando los campos` **_`price`_** `o` **_`rating`_** `no son numéricos`

**`IMPORTANTE:`** `la imagen de un producto será eliminada de` **`Cloudinary`** `si se produce alguna de las siguientes situaciones:`

- `Se ha producido un error al crear el producto`
- `Se actualiza la imagen del producto por una nueva`
- `Se ha producido un error al actualizar el producto`
- `Se elimina el producto`

[//]: # 'Lista de enlaces:'
[Cloudinary]: https://cloudinary.com/
[Insomnia]: https://insomnia.rest/
[GitHub]: https://github.com/carherval/Proyecto_9
[PcComponentes]: https://www.pccomponentes.com/juegos-ps5
