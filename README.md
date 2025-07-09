# Video store

**_Video store_** es una Base de Datos sencilla que implementa un **CRUD** completo sobre tres colecciones de datos relacionadas, la de películas (**_movie_**), la de directores (**_director_**) y la de usuarios (**_user_**).

Para el almacenamiento de los carteles de las películas y de las fotos de los directores se usa el servicio de [Cloudinary].

Se recomienda el uso de alguna aplicación que permita probar la **API** de la aplicación mediante el envío de peticiones **HTTP** y la recepción de sus correspondientes respuestas, como puede ser [Insomnia].

## Colección _movie_

A continuación se detallan los datos que almacena una película de la colección **_movie_**:

| CAMPO             | DESCRIPCIÓN                           | TIPO        | OBLIGATORIO | ÚNICO | VALOR                                                                                                                                                  |
| ----------------- | ------------------------------------- | ----------- | ----------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **\__id_**        | Identificador de la película          | Hexadecimal | Sí          | Sí    | **Automático**                                                                                                                                         |
| **_title_**       | Título de la película                 | Texto       | Sí          | Sí    | Texto libre                                                                                                                                            |
| **_poster_**      | Cartel de la película                 | Texto       | No          | Sí    | Ruta del archivo subido a **Cloudinary**                                                                                                               |
| **_genre_**       | Género de la película                 | Texto       | Sí          | No    | _Acción, Aventura Bélica, Catástrofe, Ciencia ficción, Comedia, Documental, Drama, Fantasía, Histórica, Musical, Policiaca, Suspense, Terror, Western_ |
| **_ageRating_**   | Clasificación por edad de la película | Número      | Sí          | No    | _0, 7, 12, 16, 18_                                                                                                                                     |
| **_releaseYear_** | Año de estreno de la película         | Texto       | Sí          | No    | Año válido (a partir de 1900) en formato _AAAA_                                                                                                        |
| **_minDuration_** | Duración en minutos de la película    | Texto       | No          | No    | Texto libre                                                                                                                                            |
| **_numCopies_**   | Número de copias de la película       | Número      | Sí          | No    | Entre 0 y 5                                                                                                                                            |
| **_synopsis_**    | Sinopsis de la película               | Texto       | No          | No    | Texto libre                                                                                                                                            |
| **_director_**    | Director de la película               | Texto       | No          | No    | **Automático**                                                                                                                                         |
| **_\_\_v_**       | Versión de la película                | Número      | No          | No    | **Automático** (se incrementa con cada modificación de la película)                                                                                    |
| **_createdAt_**   | Fecha de creación de la película      | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                                                                                                |
| **_updatedAt_**   | Fecha de modificación de la película  | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                                                                                                |

## Colección _director_

A continuación se detallan los datos que almacena un director de la colección **_director_**:

| CAMPO           | DESCRIPCIÓN                        | TIPO        | OBLIGATORIO | ÚNICO                         | VALOR                                                                            |
| --------------- | ---------------------------------- | ----------- | ----------- | ----------------------------- | -------------------------------------------------------------------------------- |
| **\__id_**      | Identificador del director         | Hexadecimal | Sí          | Sí                            | **Automático**                                                                   |
| **_surnames_**  | Apellidos del director             | Texto       | Sí          | Sí (junto con **_name_**)     | Texto libre                                                                      |
| **_name_**      | Nombre del director                | Texto       | Sí          | Sí (junto con **_surnames_**) | Texto libre                                                                      |
| **_photo_**     | Foto del director                  | Texto       | No          | Sí                            | Ruta del archivo subido a **Cloudinary**                                         |
| **_birthYear_** | Año de nacimiento del director     | Texto       | Sí          | No                            | Año válido (a partir de 1900) en formato _AAAA_                                  |
| **_movies_**    | Películas del director             | Lista       | No          | Sí                            | Identificadores válidos de películas (colección **_movie_**) separados por comas |
| **_\_\_v_**     | Versión del director               | Número      | No          | No                            | **Automático** (se incrementa con cada modificación del director)                |
| **_createdAt_** | Fecha de creación del director     | Fecha       | No          | No                            | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                          |
| **_updatedAt_** | Fecha de modificación del director | Fecha       | No          | No                            | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                          |

## Colección _user_

A continuación se detallan los datos que almacena un usuario de la colección **_user_**:

| CAMPO           | DESCRIPCIÓN                               | TIPO        | OBLIGATORIO | ÚNICO | VALOR                                                                            |
| --------------- | ----------------------------------------- | ----------- | ----------- | ----- | -------------------------------------------------------------------------------- |
| **\__id_**      | Identificador del usuario                 | Hexadecimal | Sí          | Sí    | **Automático**                                                                   |
| **_userName_**  | Nombre de usuario del usuario             | Texto       | Sí          | Sí    | Texto libre                                                                      |
| **_password_**  | Contraseña del usuario (**campo oculto**) | Texto       | Sí          | No    | Contraseña válida                                                                |
| **_email_**     | Correo electrónico del usuario            | Texto       | Sí          | Sí    | Correo electrónico válido                                                        |
| **_role_**      | Rol del usuario                           | Texto       | Sí          | No    | _user, admin_                                                                    |
| **_movies_**    | Películas prestadas al usuario            | Lista       | No          | No    | Identificadores válidos de películas (colección **_movie_**) separados por comas |
| **_\_\_v_**     | Versión del usuario                       | Número      | No          | No    | **Automático** (se incrementa con cada modificación del usuario)                 |
| **_createdAt_** | Fecha de creación del usuario             | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                          |
| **_updatedAt_** | Fecha de modificación del usuario         | Fecha       | No          | No    | **Automático** (fecha en formato _DD/MM/AAAA HH:MM:SS_)                          |

## Instalación y ejecución de la aplicación

Una vez descargada la aplicación del repositorio de [GitHub] se debe ir al directorio raíz (**_Proyecto_8_**) y ejecutar el siguiente comando de **Node.js**:

```sh
npm run dev
```

Si se desea, se puede ejecutar **previamente** una carga inicial de datos en las colecciones **_movie_** y **_director_** (así como una subida de los carteles de las películas y de las fotos de los directores a **Cloudinary**) mediante el siguiente comando de **Node.js**:

```sh
npm run createData
```

**`IMPORTANTE:`** `la carga inicial elimina todos los datos almacenados previamente en las colecciones` **_`movie`_** `y` **_`director`_** `, elimina las películas prestadas a los usuarios en la colección` **_`user`_** `y elimina los archivos de los carteles de las películas y de las fotos de los directores subidos a ` **`Cloudinary`**

**`USUARIO INICIAL ADMIN:`** `usuario:` **_`admin`_** ` y contraseña:` **_`adminadmin`_**

## Endpoints de la colección _movie_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_movie_** y sus posibles respuestas:

| MÉTODO | URL                                            | DESCRIPCIÓN                     | LOGIN       | PARÁMETROS                                     | CUERPO DE LA PETICIÓN                                             | CÓDIGO DE RESPUESTA | RESPUESTA                                                                               |
| ------ | ---------------------------------------------- | ------------------------------- | ----------- | ---------------------------------------------- | ----------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------- |
| GET    | http://localhost:3000/movie/get/all/           | Búsqueda de todas las películas | NO          |                                                |                                                                   | 200                 | Lista de todas las películas ordenadas por título                                       |
| GET    | http://localhost:3000/movie/get/id/            | Búsqueda de una película        | NO          | Identificador de la película                   |                                                                   | 200                 | Película                                                                                |
| GET    | http://localhost:3000/movie/get/title/         | Búsqueda filtrada               | NO          | Título de la película                          |                                                                   | 200                 | Lista de películas filtradas por título y ordenadas por título                          |
| GET    | http://localhost:3000/movie/get/genre/         | Búsqueda filtrada               | NO          | Género de la película                          |                                                                   | 200                 | Lista de películas filtradas por género y ordenadas por título                          |
| GET    | http://localhost:3000/movie/get/age-rating/    | Búsqueda filtrada               | NO          | Clasificación por edad de la película          |                                                                   | 200                 | Lista de películas filtradas por clasificación por edad y ordenadas por título          |
| GET    | http://localhost:3000/movie/get/director-name/ | Búsqueda filtrada               | NO          | Apellidos o nombre del director de la película |                                                                   | 200                 | Lista de películas filtradas por apellidos o nombre del director y ordenadas por título |
| POST   | http://localhost:3000/movie/create/            | Creación de una película        | **_admin_** |                                                | **Multipart Form Data** con los campos de la película a crear     | 201                 | Película creada                                                                         |
| PUT    | http://localhost:3000/movie/update/id/         | Modificación de una película    | **_admin_** | Identificador de la película                   | **Multipart Form Data** con los campos a modificar de la película | 201                 | Película modificada                                                                     |
| DEL    | http://localhost:3000/movie/delete/id/         | Eliminación de una película     | **_admin_** | Identificador de la película                   |                                                                   | 200                 | Mensaje de confirmación de eliminación de la película                                   |

- El código de respuesta también puede ser **400** cuando falla la subida del cartel de la película a **Cloudinary**
- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **413** cuando falla la subida del cartel de la película a **Cloudinary** por no tener un tamaño válido
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **Multipart Form Data** en los métodos **POST** y **PUT**)

> La información devuelta de una película también incluye los **apellidos** y el **nombre** de su director

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **Multipart Form Data** con la información necesaria de los campos

> El campo para el cartel de la película puede ser de tipo texto o de tipo **file** mediante la selección de un archivo válido del disco (restricción en cuanto a tamaño y extensión del archivo)

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando los campos` **_`ageRating`_** `o` **_`numCopies`_** `no son numéricos`

**`IMPORTANTE:`** `el número de copias de una película no puede ser inferior al número de copias prestadas a los usuarios`

**`IMPORTANTE:`** `cuando se elimina una película, también se elimina de la lista de películas de su director`

**`IMPORTANTE:`** `no se puede eliminar una película que está siendo prestada a un usuario`

**`IMPORTANTE:`** `el cartel de una película será eliminado de` **`Cloudinary`** `si se produce alguna de las siguientes situaciones:`

- `Se ha producido un error al crear la película`
- `Se actualiza el cartel de la película por uno nuevo`
- `Se ha producido un error al actualizar la película`
- `Se elimina la película`

## Endpoints de la colección _director_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_director_** y sus posibles respuestas:

| MÉTODO | URL                                             | DESCRIPCIÓN                      | LOGIN       | PARÁMETROS                                | CUERPO DE LA PETICIÓN                                           | CÓDIGO DE RESPUESTA | RESPUESTA                                                                                  |
| ------ | ----------------------------------------------- | -------------------------------- | ----------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| GET    | http://localhost:3000/director/get/all/         | Búsqueda de todos los directores | NO          |                                           |                                                                 | 200                 | Lista de todos los directores ordenados por apellidos y nombre                             |
| GET    | http://localhost:3000/director/get/id/          | Búsqueda de un director          | NO          | Identificador del director                |                                                                 | 200                 | Director                                                                                   |
| GET    | http://localhost:3000/director/get/name/        | Búsqueda filtrada                | NO          | Apellidos o nombre del director           |                                                                 | 200                 | Lista de directores filtrados por apellidos o nombre y ordenados por apellidos y nombre    |
| GET    | http://localhost:3000/director/get/movie-id/    | Búsqueda de un director          | NO          | Identificador de la película del director |                                                                 | 200                 | Director                                                                                   |
| GET    | http://localhost:3000/director/get/movie-title/ | Búsqueda filtrada                | NO          | Título de la película del director        |                                                                 | 200                 | Lista de directores filtrados por título de la película y ordenados por apellidos y nombre |
| POST   | http://localhost:3000/director/create/          | Creación de un director          | **_admin_** |                                           | **Multipart Form Data** con los campos del director a crear     | 201                 | Director creado                                                                            |
| PUT    | http://localhost:3000/director/update/id/       | Modificación de un director      | **_admin_** | Identificador del director                | **Multipart Form Data** con los campos a modificar del director | 201                 | Director modificado                                                                        |
| DEL    | http://localhost:3000/director/delete/id/       | Eliminación de un director       | **_admin_** | Identificador del director                |                                                                 | 200                 | Mensaje de confirmación de eliminación del director                                        |

- El código de respuesta también puede ser **400** cuando falla la subida de la foto del director a **Cloudinary**
- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **413** cuando falla la subida de la foto del director a **Cloudinary** por no tener un tamaño válido
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **Multipart Form Data** en los métodos **POST** y **PUT**)

> La información devuelta de un director se puebla con el **identificador** y el **título** de sus películas ordenadas por título

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **Multipart Form Data** con la información necesaria de los campos

> El campo para la foto del director puede ser de tipo texto o de tipo **file** mediante la selección de un archivo válido del disco (restricción en cuanto a tamaño y extensión del archivo)

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando el campo` **_`movies`_** `no contiene identificadores válidos de películas`

**`IMPORTANTE:`** `cuando se relaciona un director con una película, ésta debe existir en la colección` **_`movie`_** `y no pertenecer a otro director`

**`IMPORTANTE:`** `la foto de un director será eliminada de` **`Cloudinary`** `si se produce alguna de las siguientes situaciones:`

- `Se ha producido un error al crear el director`
- `Se actualiza la foto del director por una nueva`
- `Se ha producido un error al actualizar el director`
- `Se elimina el director`

## Endpoints de la colección _user_

A continuación se detallan las peticiones **HTTP** de la **API** de la colección **_user_** y sus posibles respuestas:

| MÉTODO | URL                                         | DESCRIPCIÓN                                     | LOGIN             | PARÁMETROS                                       | CUERPO DE LA PETICIÓN                                                                         | CÓDIGO DE RESPUESTA | RESPUESTA                                                                                               |
| ------ | ------------------------------------------- | ----------------------------------------------- | ----------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| GET    | http://localhost:3000/user/get/             | Búsqueda del usuario que ha iniciado sesión     | **_user, admin_** |                                                  |                                                                                               | 200                 | Usuario que ha iniciado sesión                                                                          |
| GET    | http://localhost:3000/user/get/all/         | Búsqueda de todos los usuarios                  | **_admin_**       |                                                  |                                                                                               | 200                 | Lista de todos los usuarios ordenados por nombre de usuario                                             |
| GET    | http://localhost:3000/user/get/id/          | Búsqueda de un usuario                          | **_admin_**       | Identificador del usuario                        |                                                                                               | 200                 | Usuario                                                                                                 |
| GET    | http://localhost:3000/user/get/userName/    | Búsqueda filtrada                               | **_admin_**       | Nombre de usuario del usuario                    |                                                                                               | 200                 | Lista de usuarios filtrados por nombre de usuario y ordenados por nombre de usuario                     |
| GET    | http://localhost:3000/user/get/role/        | Búsqueda filtrada                               | **_admin_**       | Rol del usuario                                  |                                                                                               | 200                 | Lista de usuarios filtrados por rol y ordenados por nombre de usuario                                   |
| GET    | http://localhost:3000/user/get/movie-id/    | Búsqueda filtrada                               | **_admin_**       | Identificador de la película prestada al usuario |                                                                                               | 200                 | Lista de usuarios filtrados por identificador de la película prestada y ordenados por nombre de usuario |
| GET    | http://localhost:3000/user/get/movie-title/ | Búsqueda filtrada                               | **_admin_**       | Título de la película prestada al usuario        |                                                                                               | 200                 | Lista de usuarios filtrados por título de la película prestada y ordenados por nombre de usuario        |
| POST   | http://localhost:3000/user/login/           | Inicio de sesión de un usuario                  | NO                |                                                  | **Multipart Form Data** con el nombre de usuario y la contraseña del usuario a iniciar sesión | 200                 | Token de autorización generado                                                                          |
| POST   | http://localhost:3000/user/create/          | Creación de un usuario                          | **_admin_**       |                                                  | **Multipart Form Data** con los campos del usuario a crear                                    | 201                 | Usuario creado                                                                                          |
| PUT    | http://localhost:3000/user/update/          | Modificación del usuario que ha iniciado sesión | **_user, admin_** |                                                  | **Multipart Form Data** con los campos a modificar del usuario que ha iniciado sesión         | 201                 | Usuario que ha iniciado sesión modificado                                                               |
| PUT    | http://localhost:3000/user/update/id/       | Modificación de un usuario                      | **_admin_**       | Identificador del usuario                        | **Multipart Form Data** con los campos a modificar del usuario                                | 201                 | Usuario modificado                                                                                      |
| DEL    | http://localhost:3000/user/delete/          | Eliminación del usuario que ha iniciado sesión  | **_user, admin_** |                                                  |                                                                                               | 200                 | Mensaje de confirmación de eliminación del usuario que ha iniciado sesión                               |
| DEL    | http://localhost:3000/user/delete/id/       | Eliminación de un usuario                       | **_admin_**       | Identificador del usuario                        |                                                                                               | 200                 | Mensaje de confirmación de eliminación del usuario                                                      |

- El código de respuesta también puede ser **400** cuando no se consigue realizar el inicio de sesión o cuando falla la subida del usuario
- El código de respuesta también puede ser **401** cuando se intenta acceder a un método sin estar autorizado
- El código de respuesta también puede ser **404** cuando no se encuentran resultados de búsqueda (métodos **GET**)
- El código de respuesta también puede ser **500** cuando se produce un error interno del servidor al procesar la petición (por ejemplo, durante la validación de los campos del **Multipart Form Data** en los métodos **POST** y **PUT**)

> La información devuelta de un usuario se puebla con el **identificador** y el **título** de sus películas prestadas ordenadas por título

> Los métodos **POST** y **PUT** requieren en la petición un cuerpo en formato **Multipart Form Data** con la información necesaria de los campos

**`IMPORTANTE:`** `un error de` **_`cast`_** `(conversión) se produce cuando el campo` **_`movies`_** `no contiene identificadores válidos de películas prestadas`

**`IMPORTANTE:`** `cuando se relaciona un usuario con una película, ésta debe existir en la colección` **_`movie`_** `y que tenga copias disponibles para prestar (sólo se presta una copia de la misma película a un usuario)`

**`IMPORTANTE:`** `un usuario sólo puede ser creado con rol` **_`user`_**

**`IMPORTANTE:`** `se puede crear un usuario con películas prestadas inicialmente`

**`IMPORTANTE:`** `el rol y las películas prestadas sólo pueden ser modificados por un usuario con rol` **_`admin`_**

**`IMPORTANTE:`** `no se puede eliminar un usuario que tiene películas prestadas`

**`IMPORTANTE:`** `un usuario se puede eliminar a sí mismo`

**`IMPORTANTE:`** `ya existe el usuario inicial` **_`admin`_** `que no puede ser eliminado de la colección` **_`user`_**

[//]: # 'Lista de enlaces:'
[Cloudinary]: https://cloudinary.com/
[Insomnia]: https://insomnia.rest/
[GitHub]: https://github.com/carherval/Proyecto_8
