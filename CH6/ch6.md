# Escribiendo una API REST. Exponiendo la DB a la aplicacion.

El capitulo cubre:

* las reglas de las APIS REST.
* patrones de APIS.
* funciones CRUD.
* uso de express y mongoose para interactuar con MongoDB.
* Testeo de los `endpoints` de la API.

Tenemos configurado nuestra base de datos con Mongo a traves de mongoose. El problema es que la interaccion con mongo solo la podemos hacer a traves de la terminal. Es por esto que en este capitulo lo que haremos sera construir una REST API con la cual podamos interactuar a traves de llamadas `HTTP` y realizar operaciones `CRUD`.

# Las reglas de una API REST.

Hagamos una suerte de recapitulacion de las reglas de las APIS REST.

* REST significa **REpresentational State Transfer**, que es un estilo de arquitectura mas que un protocolo estricto. REST no tiene estado, por lo que no tiene idea del estado actual del usuario.
* API es la abreviacion referida a una interfaz publica de una aplicacion. Las API permite a las aplicaciones hablar con otras aplicaciones.

Por lo REST API es una interfaz sin estado de una aplicacion. En el caso del stack MEAN la API REST es usada para crear una interfaz sin estado de nuestra base de datos, permitiendo una manera en que otras aplicaciones puedan trabajar con datos.

Las API REST tienen una serie de estandares asociados. No es necesario seguirlos todos pero la idea es que nos mantengamos cerca de ese estandar de manera tal que nuestra API tenga buenas practicas de codigo.

En terminos basicos una API REST toma un request HTTP y lleva a cabo cierto procesamiento, enviando de vuelta una respuesta HTTP. El estandar que vamos a seguir para efectos de la app que estamos creando se orientan en tornoa los protocolos de requerimiento y respuesta.

# Request de URL's.

El requerimiento de URL de nuestra API REST tiene un estandar bien simple. Seguir este estandar hara que nuestra aplicacion sea facil de trabajar y mantener.

La manera de pensar en esta aproximacion parte por el hecho de que tenemos que pensar en los elementos que estan en nuestra db. Dada esta coleccion uno siempre tendra una serie de URL's para cada elemento de la coleccion. Tambien podriamos tener una serie de URL's para cada subdocumento de la coleccion. Cada URL en un conjunto tendria su propia ruta basica mas algunos parametos que definiriamos.

Dentro de un conjunto de URL's necesitamos cubir una serie de acciones que generalmente estan basadas en el estandar de operaciones CRUD.

* crear un nuevo item.
* leer una lista de muchos itemes.
* leer un item especifico.
* actualizar un item especifico.
* borrar un item especifico.

Dado el ejemplo de la app que estamos programando tenemos que Loc8r tiene una coleccion llamada `locations` con la cual queremos interactuar. En estrictor rigor cada locacion tiene la misma ruta URL, lo que cambian en este caso serian los parametros que apuntan a elementos particulares que buscamos exhibir en la api.

# Metodos request.

Los metodos de HTTP request pueden ser diferentes, pero en esencia le estan indicando al servidor que es lo que tienen que hacer. El requerimiento mas comun de todos es el `GET` que es el metodo que se usa cuando entramos una url en nuestra barra de navegacion de nuestro navegador. Otro metodo bien comun es el `POST` que usualmente se utiliza para subir datos.

Por ejemplo un metodo `POST` puede crear nuevos datos en nuestra base de datos. Lo cual puede implicar que veremos nuevos objetos de datos en nuestra db. Un metodo `GET` puede leer datos de una db. Por lo que de respuesta se obtiene un objeto de la db.

Utilizaremos los cuatro metodos HTTP que son:

* POST.
* GET.
* PUT: actualiza un documento en una db.
* DELETE: borra un objeto de una db.

Los metodos son importantes pues toda API REST bien diseñada usualmente tendra la misma URL para diferentes acciones. En estos casos, los metodos le estan diciendo al servidor que tipo de operacion deben realizar.

Si consideramos las rutas y los parametros de nuestra API y las mapeamos en razon de los metodos `request` apropiados, podemos tener un seudo diseño de API:

* crear una nueva locacion: metodo `POST`. La url seria `http://loc8r.com/api/locations`.
* leer una lista de locaciones: metodo `GET`. La url seria `http://loc8r.com/api/locations`.
* Leer una locacion especifica: metodo `GET`. La url seria `http://loc8r.com/api/location/123`. El parametro que se pasa es el id de la locacion.
* acutalizar una locacion especifica: metodo `PUT`. El parametro que se pide es el id de la locacion.
* Borrar una locacion espeficia: el metodo es `DELETE`. El parametro que se pasa es el id de la locacion.

Notar que los parametros pasados son simplemente argumentos que nos permiten filtrar los elementos que estamos buscando en la api.

Actualmente nuestra aplicacion tiene solo una coleccion por lo cual constituye un punto de partida. En todo caso los documentos en la coleccion de loc8r tiene reseñas como subdocumentos por lo que tambien debemos mapear esas relaciones.

# Rutas de los subdocumentos.

Mapear las relaciones de la API con los elementos de nuestra DB no es dificil, sobre todo pensando en los subdocumentos que en este caso corresponden a las reseñas de los lugares. En este caso los metodos son iguales a los generados para el caso de crear nuevas locaciones etc.

Si queremos crear una nueva reseña esa reseña tiene una url de ruta particular asociada a la locacion particular, por lo que la url seria `http://loc8r.com/api/location/123/reviews` utilizando claro esta el metodo `POST`. Nuevamente el parametro que le pasamos a nuestra API es el parametro del id de la locacion. Para los otros elementos como leer, actualizar y borrar usamos los metodos que ya conocemos: `GET`, `PUT` y `DELETE`. Notamos que no tenemos un metodo que nos envie la lista de reseñas. Esto es porque cuando el documento principal se cargue es ahi donde recuperaremos la lista de reseñas.

# Respuestas y codigo de estatus.

En una buena API si uno a esta le pide un requerimiento esta deberia responder con el requerimiento. Es decir una API bien diseñada deberia poder operar bajo todos los parametro sobre los cuales le estamos pidiendo la informacion.

Para una API exitosa tenemos respuestas estandarizadas que son importantes asi como tenemos metodos `request` estandarizados.

Existen dos componentes esenciales en una respuesta:

* los datos retornados.
* el codigo de estatus de HTTP.

Al combinarlos ambos en nuestra API deberia dar a quien hace el requerimiento la informacion necesaria para continuar.

# Retornando datos desde una API.

Nuestra API deberia retornar datos consistentes en un formato de datos consistente. Los formatos tipicos de API REST son XML y JSON. Vamos a usar JSON para nuestra API, ya que calza de manera natural con nuestra app MEAN.

La API va a devolver al menos uno de estos tres elementos cuando le hagamos un requerimientos:

* un objeto `JSON` conteniendo los datos de respuesta de la consulta.
* un objeto `JSON` conteniendo datos de error.
* una respuesta nula.

# Usando los codigos de estatus de HTTP.

Una buena API RESt deberia retonar los codigos de estatus de HTTP correctos. Los codigos de estatus son:

* 200: ok.
* 201: Creado.
* 204: Sin contenido.
* 400: Mal requerimiento.
* 401: Sin autorizacion.
* 403: Prohibido.
* 404: No encontrado.
* 405: Metodo no permitido.
* 409: Conflicto.
* 500: Error interno del servidor.

# Configurando la API en express.

Tenemos entones una idea de las acciones que debemos emprender para diseñar nuestra API REST. Con Express lo que haremos sera generar codigo sobre los controladores y las rutas para poder dar respuesta correcta a los elementos que pidamos en nuestra API.

Dado que tenemos archivos para los controladores y las rutas podemos hacer uso de ellos. Otra opcion mejor es mantener el codigo de la API separado para no correr riesgos de confusion al crear nuestra API en primera instancia. Tambien al mantener el codigo de nuestra API separado lo que nos permite es tener una base de codigo que podamos usar en el futuro para otras APIS que creemos. Lo que queremos aca es un desacoplamiento sencillo de nuestra base de codigo.

Lo primero que haremos sera crear un area separada dentro de nuestra aplicacion para los archivos que crearemos en nuestra API. En el nivel mas alto creamos un directorio llamado `app_api`. Este directorio estara al mismo nivel que nuestro directorio `app_server`.

En este directorio que creamos tendremos todos los archivos necesarios para crear nuestra API: rutas, controladores y modelos.

# Creando las rutas.

Tal como hicimos en nuestra aplicacion principal de Express tendremos un archivo `index.js` en nuestro directorio `app_api/routes` que tendra las ruta que utilizaremos en nuestra API.

# Incluyendo las rutas en la aplicacion.

Lo primero que haremos antes es referenciar este archivo en nuestro archivo de aplicacion principal llamado `app.js`.

El primer paso en este caso es decirle a nuestra aplicacion que estamos añadiendo mas rutas para tener en cuenta, y cuando debemos usar esas rutas. Ya tenemos en nuestro archivo `app.js` el comando que hace el require del nuestro archivo de servidor, por lo que debemos simplemente imitar la sintaxis:

```javascript
var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
```

Luego necesitamos decirle a la aplicacion cuando usar las ruta. Actualmente tenemos la siguiente linea de codigo diciendole a nuestra app que use las rutas del directorio `routes` de `app_server`:

```javascript
app.use('/', routes);
```
Notar el primero parametro `'/'`. Esto nos permite a nosotros especificar un conjunto de URL's para las cuales las rutas aplicaran. Por ejemplo si definimos que nuestra API comience con la ruta `'/api/'`, por lo que al añadir esa ruta y llamar a nuestra variable `routesApi` tendremos la ruta seteada para la llamada a la API.

```javascript
app.use('/', routes);
app.use('/api', routesApi);
```

# Especificando los metodos request en las rutas.

Hasta el momento solo hemos usado el metodo `GET` en las rutas, como en el siguiente codigo:

```javascript
router.get('/location', ctrlLocations.locationInfo);
```

Usando los otros metodos es bastante sencillo como cambiar del `router.get()` al `router.post()` por ejemplo. El siguiente codigo lo que hace es ejemplificar un metodo `POST` para crear una nueva locacion:

```javascript
router.post('/locations', ctrlLocations.locationInfo);
```
Notamos que no especificamos la ruta `/api`. Esta fue especificada en el archivo `app.js`, por lo que estas rutas solo deberian ser usadas si parten con `/api`, por lo que se asumen que todas las rutas especificadas tendran el prefijo `/api`.

# Especificando los parametro de URL requeridos.

Es bien comun para las url de APIS tener parametros que identifiquen documentos especifimos o subdocumentos. Especificando estos parametros en las rutas es bastante sencillo: tenemos que usar el prefijo del nombre del parametro cuando definimos cada ruta.

Por ejemplo: digamos que estamos tratando de acceder a la reseña que tiene el ID `abc` que pertenence a la locacion que tiene el ID `123`; tenemos una ruta de URL que es asi:

`/api/locations/123/reviews/abc`

Cambiando los ID's por nombres de parametros nos da una ruta como la siguiente:

`/api/locations/:locationid/reviews/:reviewid`

Con una ruta como esa Express solo hara match de las URL's que concuerden con se parametro. Por lo que un ID de locaciones debe estar entre `/locations` y `/reviews` y un ID de reseña tiene que ser especificado al final de la URL.

Cuando una ruta como esta es asignada a un controlador, el parametro estara disponible para ser usado en el codigo, con los nombres especificados en la ruta, `locationid` y `reviewid` en este caso.

# Definiendo las rutas de Loc8r en la API.

El archivo del directorio routes quedara asi:

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

Este es el archivo router que necesitamos requerir en nuestro archivo controlador. Aun no creamos el archivo controlador y lo haremos pronto.

Notamos que la aproximacion que tomamos es una buena practica. Al definir las rutas inmediatamente y las funciones, lo que hacemos es desarrollar inmediatamente una vision global de que es lo que lo que debe ir en el archivo controlador.

Nuestra aplicacion tiene ahora dos archivos que rutean. El archivo de rutas normal que nuestra aplicacion Express ordinaria, y el archivo de rutas de nuestra API.

# Creando los controladores.
