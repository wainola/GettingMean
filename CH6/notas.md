# Notas en API REST.

`REST`significa **REpresentational State Transfer**. Es un estilo de arquitectura mas que un protocolo estrictor.

Una `API REST` es una interfaz sin estado de una aplicacion. Para el caso del stack MEAN la API es usada para almacenar los datos de la aplicacion que son cargados en la vista.

Simplificando el diseño de una API tenemos que dado un `request` HTTP, se lleva a cabo cierto procesamiento y se envia una respuesta de ese procesamiento. En el caso de nuestra API llevaremos a cabo las clasicas operaciones CRUD:

* creacion de itemes.
* lectura de itemes.
* lectura de itemes particulares.
* actualizacion de itemes especificos.
* borrado de itemes especificos.

Para esto usaremos una serie de metodos que son parte de la tecnologia HTTP:

* POST para enviar datos particulares.
* GET para lectura de datos.
* PUT para actualizar datos particulares.
* DELETE para borrar datos particulares.

Estos metodos son relevantes y operan bajo el requerimientos de URLS particulares que luego veremos, cuando tengamos que definir las rutas en funcion de los metodos que queremos llevar a cabo.

Los parametros que pasaremos para poder ejecutar los metodos HTTP son parametros que estan incluidos en las URLS. Esto implica detectar las rutas de los documentos como por ejemplo:

`http://localhost:3000/locations/locationid/reviews`

En el caso anterior supongamos que el id de nuestra locacion es `123id456`. Para ver las reseñas a traves de un metodo GET hariamos:

`http://localhost:3000/locations/123id456/reviews`

Lo cual nos daria como resultado la vista de las reseñas que se han subido para esa locacion particular.

La lectura de datos de una API supone que esos datos son retornados en alguna formato legible. En este caso optamos por retornar los datos en formato JSON. Recordemos que para el caso de la aplicacion que estamos diseñando, el retorno de datos sera utilizado para que luego nuestra aplicacion pueda consumir los datos y enviarlos a la vista. Haremos uso tambien de los mensajes de estado propios del protocolo HTTP.

# Primeros pasos.

Primero antes que partiro configurando rutas y metodos debemos determinar en nuestro archivo `app.js` la ruta que sera usada cuando ingresemos la url correspondiente a la api. En este caso definimos tanto la variable a utilizar, que a su vez hara referencia al archivo contenido en el directorio de las rutas de la api, y esa variable sera la llamada por el metodo `get()` cuando se requiera la url:

```javascript
var routesApi = require('./app_api/routes/index');

// luego mas abajo.

app.use('/api', routesApi);
```

Con esto queda definido en nuestro archivo `app.js` cual sera el archivo llamado para trabajar con las API. Notar que este es el tipico flujo de trabajo sobre el cual ya hemos hecho cosas. Dada una ruta ingresada en el navegador, un archivo del directorio `routes` es llamado, y en razon de esa llamada, el archivo de rutas es el encargado de llamar a los controladores que son los que finalmente trabajan con los datos.

# Definicion de las rutas.

A diferencia del directorio de rutas de `app_server`, alli lo que hemos hecho hasta ahora ha sido que, en funcion de las rutas, el archivo llamada a una funcion particular del controlador, y esta llamada particular envia algunos datos, aca estaremos trabajando sobre los metodos propios de HTTP mas alla del metodo GET que ha sido el que mas hemos usado.

**Se recomienda como buena practica determinar las rutas antes de trabajar sobre los controladores, de manera tal que en las mismas rutas definamos los nombres de las funciones que luego seran invocadas en el archivo de controladores. Esto es:**

```javascript
var post('/locations', ctrlLocations.locationsCreate);
```

Tenemos que ingresada la ruta `http://localhost:3000/api/locations/` con un metodo post, lo que estamos haciendo es invocar al modulo `ctrlLocations.locationsCreate` que vive en nuestro archivo controlador.

Tenemos que el archivo de rutas es como sigue, tremendamente directo. Notaremos que hay una division de metodos. Estan los metodos para las locaciones que, en el diseño de nuestra base de datos constituyen los documentos y tenemos los metodos propios de las reseñas, que en nuestra base de datos constituyen los subdocumentos.

```javascript
var express = require('express');
var router = express.Router();
// Los siguientes archivos a incluir aun no se crean.
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

// Locations.

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// reviews
router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

module.exports = router;
```
Notamos que luego de la importacion de express importamos tambien el metodo `Router()` de express para trabajar con las rutas.

# Creacion de los controladores.

Los controladores son la ultima frontera entre nuestra aplicacion y la base de datos. Como tales son los que se llevan a aca la carga de codigo mayor relacionada con el trabajo con la api.

Los modulos de controladores con los que trabajaremos van a ser funciones con dos 
