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

Para permitir que la aplicacion inicie, podemos crear marcadores de posicion para las funciones de los controladores. Estas funciones no haran nada en realidad, pero evitaran que la aplicacion se caiga cuando estemos construyendo la funcionalidad de nuestra API. En definitiva, cuando estemos construyendo nuestra API lo que podemos hacer es generar algunas funciones que eviten que nuestra app se caiga.

El primer paso es crear un archivo de controlador. Sabemos donde estos archivos deberian ir y como deberiamos llamarlos pues tenemos el mismo esquema en el directorio `app_server`. Necesitamos en este caso dos archivos `locations.js` y `reviews.js` en nuestro directorio `app_api/controllers`.

Podemos crear un marcador de posicion para cada funcion del controlador como una funcion exportadora en blanco como vemos a continuacion:

```javascript
module.exports.locationsCreate = function (req, res) {};
```
Para probar el ruteo deberemos retornar una respuesta.

# Retornando un JSON desde un request de Express.

Cuando construimos una aplicacion en express renderizamos una vista de plantilla que envia HTML al navegador. Pero con una API lo que queremos es devolver un codigo de estatus y algun tipo de JSON en los datos. Express permite hacer esto de manera bien sencilla:

```javascript
res.status(status);
res.json(content);
```

El primer elemento de codigo lo que hace es enviar el codigo de status como respuesta. El segundo envia el contenido en formato json.

Podemos usar estos dos comando en nuestro marcador de posicion de la funcion que creamos anteriormente para probar el tema de los envios de codigo de estatus del protocolo HTPP:

```javascript
module.exports.locationsCreate = function(req, res){
  res.status(200);
  res.json({"status": "success"});
};
```
Retornando un JSON y una respuesta de estado es una tarea bastante comun en las apis, por lo que es buena idea mover estas sentencias en sus propias funciones. Vamos a crear una funcion `sendJsonResponse` en ambos controladores y vamos a llamarlas a cada una desde los marcadores de posicion de los controladores:

```javascript
var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};

module.exports.locationsCreate = function(req, res){
  sendJsonResponse(res, 200, {"status": "success"});
};
```
De este modo podemos enviar una respuesta JSON asociada con un codigo de estatus en una sola linea.

# Incluyendo el modelo.

Es de vital imortancia que la API pueda hablar con la base de datos. Para hacer eso usaremos Mongoose, pero primero necesitamos hacer el `require` de Mongoose en el archivo del controlador y luego e eso traer el modelo de locaciones a los controladores. De esta manera los controladores podran exhibir los datos de la vista.

```javascript
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
```

La primera linea requiere obviamente mongoose para poder trabajar con nuestra DB. La segunda linea lo que hace es traer el modelo de nuestra db para que podamos interactuar con la coleccion de `locations`.

Si vemos a nuestra estructura de directorios de nuestra aplicacion tenemos que nuestro directorio `app_api` tenemos el directorio que contiene el modelo de nuestra db. En la carpeta `models` tenemos el schema de nuestra db y la conexion con la db. Pero es la API la que esta lidiando con la db, no Express. Si las aplicacones fueran separadas, el modelo seria parte de la API por lo que ahi es donde el modelo debe permanecer.

Ahora necesitamos decirle a nuestra aplicacion que movimos el directorio a `app_api/models` por lo que hacemos la actualizacion de nuestro codigo en el archivo `app.js`.

```javascript
require('./app_api/models/db');
```

# Nota respecto a problemas con la llamada a la API.

Siguiendo el tutorial de libro no podremos llegar a probar la llamada a la API por una razon muy simple: `nodemon` nos dara error puesto que la referencia a la url que estamos haciendo no se relaciona con el controlador que hemos programado. Los pasos explicativos son los siguientes:

1. llamamos a la siguiente url: `http://localhost:3000/api/locations/1111`.
2. en razon de la llamada a esa url deberiamos recibir una respuesta tanto en la consola como en el navegador. En el navegador recibimos un json con el mensaje `success`. En la consola recibimos el codigo de estatus de `http`.
3. al hacer el requerimiendo de la url se activa el codigo de nuestro archivo en el directorio `app_api/routes`, pasando primero por nuestro archivo principal `app.js`. Tenemos que en este archivo:

```javascript
app.use('/api', routesApi);
```
Por lo que cualquier URL que se ingrese con el prefijo `/api` invoca inmediatamente a la variable `routesApi` que esta haciendo referencia la modulo `index.js` que esta en el directorio que ya hemos citado.

4. hecho el requerimiento el modulo se activa. Se declaran dos variables asociadas al modulo de los controladores. Estas dos variables seran las encargadas en etapas mas avanzadas de enviarnos las respuestas de codigos de estatus y objetos que tenemos en nuestra base de datos.

5. Activado el modulo `index.js` nos encontramos que la variable router que esta haciendo referencia al metodo de express `Router` va a hacer un metodo `GET` de la URL que ingresamos. Este metodo `GET` tiene una url espefica que esta asociada con el id de la locacion que estamos pidiendo. En este caso el id de la locacion es `111`. Dado este id se gatilla una llamada a la variable `ctrlLocations` al metodo `locationsReadOne`.
5. gatillada esta llamada al metodo tenemos que en el archivo de los controladores el modulo exportado `locationsReadOne` es el encargado de enviar el estatus en la terminal y el contenido en formato json de la respuesta a traves de la funcion `sendJsonResponse`:

```javascript
var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};
```
Donde res es la respuesta, status es el status ingresado previamente como argumento de la funcion, en este caso `200` y el contenido de esta respuesta es el objeto json que enviamos, que es parseado como tal en el navegador a traves del metodo `res.json(content)`.

Si hacemos estos pasos previos no deberiamos tener problemas. El codigo que estaba dando problemas en este caso era el referido al tipo de metodo que estabamos invocando en la url que solo trabajaba con el `locationid`, por lo que en ese caso el unico metodo que el enrutador podia llamar era el `locationsReadOne`.

Una vez corregido estos errores en nuestro codigo debemos hacer dos cosas mas:

1. activar mongo a traves del comando `mongod`.
2. activar nodemon.

Y con eso estamos listos para enviar la url y probar nuestra api.

# Testando la API.

Podemos usar una aplicacion que nos permite hacer pruebas de nuestras APIS. Esta app se llama Postman, que puede ser usada tanto en el navegador como aplicacion de escritorio.

# Metodos GET: leyendo datos de la db.

Los metodos `GET` versan siempre de hacer consultas a las bases de datos y retornar datos en razon de esas consultas. En nuestro enrutador tenemos tres metodos `GET` ejecutando diferentes acciones.

Lo que haremos sera ver como buscar locaciones, ya que esto provee una buena introduccion a la manera en que mongoose funciona. Luego lo que haremos sera localizar un solo documento usando una ID y expandiremos nuestra busqueda a diferentes documentos.

# Encontrando un solo documento en MongoDB usando Mongoose.

Mongoose lo que hace es interactuar con la db a traves del modelo, razon por la cual lo importamos como `Loc` al comienzo del archivo de controlador. Un modelo de mongoose tiene bastantes metodos asociados para ayudarnos a poder interactuar con la db.

Para buscar un solo documento en nuestra db con un ID conocido en MongoDB mongoose tiene el metodod `findById`.

Los metodos de consulta de mongoose son:

* `find`.
* `findById`.
* `findOne`: obtiene el primer documento que calza con la consulta.
* `geoNear`: encuentra lugares geograficos cercanos a la latitud y longitud provista.
* `geoSearch`.

# Aplicando el metodo `findById` al modelo.

El metodo `findById` es muy sencillo de implementar. Acepta un solo parametro que en este caso es el ID a buscar. Es aplicado sobre el modelo de la siguiente manera:

`Loc.findById(locationid)`

Ojo: esto no iniciara la consulta sobre la base de datos. Solo le dira al modelo que tipo de consulta sera. Para comenzar una consulta sobre la db los modelos de mongoose deben tener un `exec` metodo.

# Corriendo la consulta con el metodo `exec`.

El metodo `exec` ejecuta la consulta y pasa el callback que se ejecutara cuando la operacion este completada. La funcion callback deberia aceptar dos parametros, un objeto `error` y una instancia del objeto consultado. El metodo es encadenado de la siguiente manera:

```javascript
Loc
  .findById(locationid)
  .exec(function(err, location){
    console.log('findById complete')
  });
```

Esta aproximacion nos asegura que la interacion con la db es asincronica, de manera tal que no bloquee los procesos en Node.

# Usando el metodo `findById` en un controlador.

El controlador en el cual vamos a trabajar para buscar la locacion por id es `locations.js` en el directorio de la api.

Sabemos cual es el constructor basico para aplicar la operacion: aplicar el metodo en si, encadenado al metodo `exec` en el modelo. Para hacer que esto funcione de manera correcta en el contexto del controlador, necesitamos hacer dos cosas:

* obtener el `locationid` como parametro desde la ur y pasarselo a `findById`.
* proveer una salida al metodo `exec`.

Con express nuevamente podemos hacer esto bien sencillo. Podemos obtener los parametros de las urls que hemos ya definido en nuestro archivo routes. El parametro de las urls estan un objeto `params` adjuntado al objeto `request`. Dado que nuestra ruta es definida como:

```javascript
app.get('/api/locations/:locationid', ctrlLocations.locationsReadOne);
```
Podemos acceder al parametro de `locationid` desde el controlador de la siguiente manera:

`req.params.locationid`

Para el caso de la salida de datos, es decir del mensaje que buscamos imprimir, podemos usar la funcion `sendJsonResponse` que hemos definido anteriormente. En codigo seria:

```javascript
module.exports.locationsReadOne = function(req, res){
  Loc
    .findById(req.params.locationid)
    .exec(function(err, location){
      sendJsonResponse(res, 200, location);
    });
};
```

Con esto tenemos ahora un controlador muy basico de la API. Podemos probar el resultado obteniendo algunos de los ID de las locaciones en mongo y yendo a la url en nuestro navegador o llamando a `postman`. Para obtener algunos de los ids corremos el comando `.find()` en la shell de mongo y nos listara todas las locaciones que tenemos guardadas y los ids respectivos.

Si enviamos ahora una consulta por ejemplo no valida a la url, por ejemplo `http://localhost:3000/api/locations/1234` no nos aparecera nada, y en la terminal veremos un codigo de estado 200. En cambio si enviamos el id de una de nuestros documentos en la db como por ejemplo `http://localhost:3000/api/locations/585f2e96f071d4cf08151894` nos retornara el documento consultado.

# Atrapando errores.

El problema con un controlador basico es que solo manda de salida cuando la respuesta es exitosa, independiente de que lo haya sido o no. Es decir, si enviamos un id errado, en la consola vemos la respuesta 200 que es ok. Y si enviamos el id correcto tenemos tambien la respuesta del documento de la db correspondiente a ese id. Lo que tenemos que hacer es responder a requerimientos erroneos.

Para responder a estos requerimientos erroneos, el controlador necesita ser configurado para atrapar estos mensajes erroneos. En este caso podemos usar condicionales para atrapar los errores en el ingreso de las urls.

Con nuestro controlador basico tenemos tres errores que debemos atrapar:

* si el request no incluye el id de la locacion.
* si `findById` no retorna una locacion.
* si `findById` retorna un error.

El codigo de estatus para un requerimiento `GET` no satisfactorio es `404`.

```javascript
module.exports.locationsReadOne = function(req, res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location){
        if(!location){
          sendJsonResponse(res, 404, {"message": "locationid not found"});
          return;
        }else if (err){
          sendJsonResponse(res, 404, err);
        }
        sendJsonResponse(res, 200, location);
      });
  }else{
    sendJsonResponse(res, 404, {"message": "No locationid in request"});
  }
};
```

Este es el codigo final de nuestro controlador.

Lo que primero verificamos es que el objeto `params` exista dentro del objeto `request` y que ese objeto contenga algun valor para `locationid`. El condicional es cerrado en el caso de que ni el objeto `params` ni el id de la locacion sea encontrado, aunque este mensaje no se vera impreso.

Notar que si las condiciones antes mencionadas se cumplen pero no estan dentro de nuestra db, se envian los respectivos mensajes de error. Estas verificaciones terminan con un return, lo que hacer que la ejecucion de la funcion finalice.

# Encontrando un subdocumento basado en si ID.

Para buscar un subdocumento necesitamos primero cargar exitosamente la busqueda del documento por su id. Esto significa que debemos tomar el controlador `locationsReadOne` como punto de partida y añadir algunas modificaciones para crear el controlador `reviewsReadOne`. Este controlador:

* utiliza como parametro adicional la url de la reseña.
* selecciona solo el nombre y la reseña desde el documento, en vez de que mongodb retorne todo el subdocumento.
* buscar por una reseña que calce con el id que hemos pasado.
* retorna la respuesta apropiada en forma de json.

# Limitando las rutas retornadas desde mongodb.

Cuando uno obtiene un documento desde Mongo no necesita todo el documento obtenido, sino que las partes que hagan mas sentido. Limitar los datos que estamos pasando es mas sano en terminos de consumo de recursos de red.

Podemos hacer esto con mongoose a traves del metodo `select` encadenado a la consulta al modelo. Por ejemplo:

```javascript
Loc
  .findById(req.params.locationid)
  .select('name reviews')
  .exec();
```

El metodo select acepta una cadena de espacio separado de las rutas que queremos obtener.

# Usando mongoose para encontrar un subdocumento especifico.

Mongoose tambien ofrece un metodo helper para encontrar un subdocumento dado un id. Dado un arreglo de subdocumentos, Mongoose tiene un metodo de `id` que acepta el id que queremos encontrar. El metodo de `id` retornara el subdocumento que calce con la consulta:

```javascript
Loc
  .findById(req.params.locationid)
  .select('name reviews')
  .exec(
    function(err, locacion){
      var review;
      review = location.reviews.id(req.params.reviewid);
    }
  );
```
Con este codigo la reseña deberia ser retornada en el callback.

# Añadiendo errores y poniendo todo el codigo junto.

El codigo final de nuestro controlador reviews queda como sigue:

```javascript
module.exports.reviewsReadOne = function(req, res){
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location){
          var response, review;
          if(!location){
            sendJsonResponse(res, 404, {
              "message": "locationid not found"
            });
            return;
          }else if (err){
            sendJsonResponse(res, 400, err);
            return;
          }
          if(location.reviews && location.reviews.length > 0){
            review = location.reviews.id(req.params.reviewid);
            if(!review){
              sendJsonResponse(res, 404, {
                "message": "review not found"
              });
            }else{
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res, 200, response);
            }
          }else{
            sendJsonResponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
      );
  }else{
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};
```
Notemos que el codigo de mas arriba va hacia nuestro controlador `reviews.js`, pues lo que estamos pidiendo el la lectura de las reseñas, por lo que estamos llamando a los metodos `router.get()` referidos a las reseñas.

El codigo del controlador de las reseñas es el siguiente:

```javascript
var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.reviewsReadOne = function(req, res){
  console.log('Getting single review');
  if(req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function(err, location){
          console.log(location);
          var response, review;
          if(!location){
            sendJsonResponse(res, 404, {
              "message": "locationid not found"
            });
            return;
          } else if (err){
            sendJsonResponse(res, 400, err);
            return;
          }
          if(location.reviews && location.reviews.length > 0){
            review = location.reviews.id(req.params.reviewid);
            if(!review){
              sendJsonResponse(res, 404, {
                "message": "review not found"
              });
            } else {
              response = {
                location: {
                  name: location.name,
                  id: req.params.locationid
                },
                review: review
              };
              sendJsonResponse(res, 200, response);
            }
          } else {
            sendJsonResponse(res, 404, {
              "message": "No reviews found"
            });
          }
        }
      );
  }else{
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};
```

# Observaciones.

Notamos que en la DB hemos declarado muchos campos de reseña con el id `id`. Los correcto seria actualizar estos valores, pues para que la API pueda enviar los valores de las reseñas el valor de id debe ser siempre `_id`.

# Buscando multiples documentos con consultas geoespaciales.

 La pagina principal de Loc8r deberia desplegar una lista de locaciones basadas en la localizacion geografica actual de la persona. MongoDB y Mongoose tienen consultas especiales para poder hacer busquedas basadas en estos parametros.

 El metodo de mongoose `geoNear` permite encontrar una lista de locaciones cercanas a un punto especificado, hasta un rango de distancia especificado maximo. `geoNear` es un metodo de modelo que acepta tres parametros:

 * a geoJSON punto geografico.
 * un objeto de opcion.
 * una funcion callback.

 El constructo basico es:

 `Loc.geoNear(point, options, callback);`

 A diferencia del metodo `findById`, el metodo `geoNear` no tiene un metodo exec. En ves de eso el metodo es ejecutado inmediatamente una ve que el callback es completado.

# Construyndo el punto geoJSON.

El primer parametro de `geoNear` es un punto `geoJSON`. Este punto es un simple objeto JSON que contienen la lat y long en un arreglo. El constructo es como sigue:

```javascript
var point = {
  type: "Point",
  coordinates: [lng, lat]
}
```
La ruta url para obtener una lista de locaciones no tienen las coordenadas en la url como parametros, por lo que se tendra que especificar de una manera distinta. Una consulta por un string es ideal para este tipo de datos, significando que la url requerida se vera mas o menos asi:

`api/locations?lng=-0.7992599&lat=51.378091`

Express permite tener acceso a los valores en una consulta de cadenas, poniendolos en un objeto `query` adjunto al objeto `request`. Por ejemplo tendriamos algo como `req.query.lng`. La long y lat seran en este caso strings recibidos, pero necesitan ser añadidos al punto como numeros. Podemos usar el metodo `parseFloat` para ejercer una coercion de tipo entre el string a numero. Cuando ponemos todo esto junto tenemos:

```javascript
module.exports.locationsByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  Loc.geoNear(point, options, callback);
};
```

Naturalmente este controlador no funcionara aun puesto que los parametros `options` y `callback` estan actualmente indefinidos.

# Añadiendo las opciones de consulta al geoNear.

El metodo `geoNear` tiene solo una opcion requerida: `spherical`. Esto determina si la busqueda debe ser basada en un objeto esferico o plano. Dado que es aceptable pensar que la tierra es redonda usaremos la opcion `spherical`.

Para crear el objeto hacemos lo siguiente:

```javascript
var geoOptions = {
  spherical: true
};
```
Con esto la busqueda quedara basada en coordenadas de una esfera.

# Limitando los resultados de geoNear por numero.

Cuando hacemos requerimientos a las APIs queremos limitar el numero de respuestas que recibimos cuando retornamos la lista. En el metodo `geoNear` añadir la opcion `num` permite hacer esto:

```javascript
var geoOptions = {
  spherical: true,
  num: 10
};
```

Luego de esto la busqueda solo enviara las proximas 10 locaciones mas cercanas.

# Limitando los resultados por distancia.

Cuando devolvemos resultados geograficos otra manera de limitar los resultados es estableciendo una distancia maxima sobre la cual se establece un diametro de lejania. En este caso lo que hacemos es añadir simplemente un `maxDistance` para efectos de determinar cual sera la distancia maxima sobre la cual vamos a exponer los resultados.

Con el siguiente snippet de codigo establecemos el limite de distancia de los resultados dado una distancia maxima.

```javascript
var theEarth = (function(){
  var earthRadius = 6371;
  var getDistanceFromRads = function(rads){
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance){
    return parseFloat(distance / earthRadius);
  };
  return{
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();
```
Con esto tenemos una funcion reusable para poder hacer nuestros calculos de distancia.

Ahora podemos añadir el valor de `maxDistance` a las opciones y añadir estas opciones al controlador:

```javascript
module.exports.locationsListByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  Loc.geoNear(point, geoOptions, callback);
};
```

# Viendo el resultado de geoNear.

El callback completo para el metodo geoNear tiene los siguientes tres parametros:

* un objeto error.
* un objeto resultados.
* un objeto stats.

Dada una consula satisfactoria un objeto error estara como `undefined`, el objeto resultados sera un arreglo de resultados, y el objeto stats contendra informacion acerca de la consulta. Vamos a primero trabajar con la consulta exitosa, y luego añadiremos el error.

Seguida de la consulta `geoNear`, mongo retorna una arreglo de objetos. Cada objeto contiene una distancia y un documento retornado desde la db. En otras palabras, mongo no añade la distancia. El siguiente codigo muestra el ejemplo de lo que retorna mongo:

```javascript
[{
  dis: 0.002532674663406363,
  obj: {
    name: 'Starcups',
    addres: '125 High Street, Reading, RG6 1PS'
  }
}]
```
Notamos que este arreglo solo tiene un objeto. Una consulta exitosa probablemente tendra mas de un objeto. La consulta `geoNear` lo que hace de de hecho es devolver todo el documento dentro del objeto `obj`.

Evidenciamos tres problemas aca:
* La API no deberia retornar mas datos de los necesarios.
* queremos retornar la distancia en un valor que sea legible.

# Procesando los datos de geoNear.

Tenemos que en el controlador de nuestra pagina, particularmente el controlador `locations.js` tenemos lo siguiente:

```javascript
{
  name: 'Starcups',
  address: '125 High Street, Reading, RG6 1PS',
  rating: 3,
  facilities: ['Hot drinks', 'Food', 'Premium wifi'],
  distance: '100m'
}
```

Para crear un objeto en base a estas lineas, lo que tenemos que hacer es iterar sobre el resultado y hacer un push a un nuevo arreglo. Estos datos procesados pueden ser luego retornados con una respuesta de estado del tipo 200.

```javascript
Loc.geoNear(point, options, function(err, results, stats){
  var locations = [];
  results.forEach(function(doc){
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: dob.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  sendJsonResponse(res, 200, locations);
});
```

Añadimos todo ese codigo a nuestro controlador `locations.js` en el directorio de la API. Ahora lo que podemos hacer es probar enviando lat y lng para ver los resultados. Si la distancia es muy lejana el arreglo retornano sera vacio.

# Añadiendo los errores.

Añadimos un breve snippet para manejar el tema de los errores. En este caso el error es que no nos envien los datos de lng y lat requeridos.

```javascript
if(!lng || !lat){
  sendJsonResponse(res, 404, {
    "message": "lng and lat query parameters are required"
  });
  return;
}
```

El codigo del controlador completo es:

```javascript
module.exports.locationsListByDistance = function(req, res){
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  if(!lng || !lat){
    sendJsonResponse(res, 404, {
      "message": "lng and lat query parameters are required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats){
    var locations = [];
    results.forEach(function(doc){
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: dob.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });
    sendJsonResponse(res, 200, locations);
  });
};
```
Enviando las lng y lat de nuestra ubicacion nos retorna un areglo vacio.

# Metodos POST: añadiendo datos a Mongo.

Los metodos POST versan sobre crear documentos o subdocumentos en la base de datos, y luego retornalos como datos guardados a manera de confirmacion.

En este caso nuestros metodos POST haran lo siguiente: `crear una nueva locacion` y `crear una nueva reseña`.

Los metodos POST trabajan añadiendo los datos posteados a la db. De la misma manera en que los parametros URL son accesados con las consultas de string realizadas sobre `req.params` y accesadas via `re.query`, los controladores en Express acceden a los datos posteados a traves de `req.body`.

# Creando nuevos documentos en Mongo.

En la base de datos Loc8r cada locacion es un documento, por lo que eso es lo que estaremos creando en esta seccion. Con mongoose la creacion de documentos es un ejercicio muy sencillo. Se toma el modelo que ya tenemos definido, y aplicamos el metodo `create` y enviamos algunos datos a la funcion callback. Este es el constructo minimo adjuntado al modelo Loc.

`Loc.create(dataToSave, callback)`

Existen dos pasos relevantes para el proceso de creacion en la db:

* tomar los datos porteados y crear un objeto js que coincida con el schema.
* enviar la repuesta apropiada en el callback dependiendo del exito o el fracaso de la operacion `create`.

Dado el paso 1 sabemos que podemos obtener datos que se nos envian a nosotros a traves del `req.body` y dado el paso 2, este paso deberia ser bastante familiar dado los otros controladores que hemos creado.

```javascript
module.exports.locationsCreate = function(req, res){
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location){
    if (err){
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
};
```

Lo anterior exhibe lo facil que es crear un nuevo documento en mongo y guardar algunos datos.

Notamos que tambien no hay ningun campo para `rating`. Recordar que el schema de mongoose habiamos configurado rating de la siguiente manera:

`rating: {type: Number, "default": 0, min:0, max:5}`

# Validando los datos usando mongoose.

Notamos que no hemos introducido ninguna forma de validacion, por lo que es posible que puedan ingresar datos vacios. Recordemos el schema que hemos definido en el modelo:

```javascript
var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},   facilities: [String],
  coords: {type: [Number], index: '2dsphere', required: true},  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});
```

Existen metodos que estan requeridos y que si se colocan vacios se va a generar un error.

# Creando nuevos subdocumentos.

En el contexto de nuestra pagina las reseñas corresponden a subdocumentos de nuestra db. Los subdocumentos son creados y guardados en funcion de sus elementos parientes, en este caso la locacion sobre el cual se le esta haciendo la reseña. Para crear subdocumentos con nuestra API tenemos que:

* encontrar el elemento pariente correcto.
* añadir un nuevo subdocumento.
* guardar sobre el documento que es pariente.

Para eso tenemos que trabajar sobre los controladores de las reseñas, fundamentalmente debemos crear el controlador asociado a la creacion de una nueva reseña:

```javascript
module.exports.reviewsCreate = function(req, res){
  var locationid = req.params.locationid;
  if(locationid){
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location){
          if(err){
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message" : "Not found, locationid required"
    });
  }
};
```
Notamos que hacemos una llamada a la funcion `doAddReview` que nos permite formatear la reseña que estamos agregando.

# Añadiendo y guardando un subdocumento.

Una vez que encontramos el documento pariente y obtenido los otros subdocumentos, podemos añadir uno nuevo. Los subdocumentos son esencialmente arreglos de objetos, y la manera mas sencilla de añadir nuevos datos es crear un objeto de datos y usar el metodo push de js:

```javascript
location.reviews.push({
  author: req.body.author,
  rating: req.body.rating,
  reviewText: req.body.reviewText
});
```

Esto esta siendo posteado desde los datos, y por ende es la razon por la cual usamos el `req.body` como parametro.

Una vez que el subdocumento es añadido, debe ser guardado, ya que los subdocumentos no pueden ser guardados por si mismos. Para guardar un documento en en mongoose, el modelo tiene un metodo `save` que espera un callback con un parametro de error y un objeto retornado.

```javascript
location.save(function(err, location){
  var thisReview;
  if(err){
    sendJsonResponse(res, 400, err);
  } else{
    thisReview = location.reviews[location.reviews.length-1];
    sendJsonResponse(res, 201, thisReview);
  }
});
```

El documento retornado por el metodo `save` es un documento completo y no solo el subdocumento.

Cuando se añaden documentos y subdocumentos lo que debemos tener en cuenta es como esto tiene un impacto en otros datos. En Loc8r añadir una nueva reseña añade un nuevo rating. Este nuevo rating va a impactar el rating promedio del lugar. Por lo que para guardar de manera exitosa, debemos tambien tomar en cuenta que debemos añadir una funcion que permita actualizar el rating de la locacion.

El codigo final es como sigue:

```javascript
var doAddReview = function(req, res, location){
  if(!location){
    sendJsonResponse(res, 404, {
      "message": "locationid not found"
    });
  } else {
    location.reviews.push({
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location){
      var thisReview;
      if(err){
        sendJsonResponse(res, 400, err);
      } else{
        thisReview = location.reviews[location.reviews.length-1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};
```

# Actualizando el rating promedio.

Calcular el rating promedio no es particularmente complicado. Lo que tenemos que hacer es:

* encontrar el documento correcto dado el id provisto.
* iterar sobre los documentos de reseña para sumar los valores de rating.
* calcular el valor promedio.
* actualizar el valor del rating del documento pariente.
* guardar el documento.

Notamos que todo este codigo debe ser puesto en el controlador `reviews.js`.

El codigo del calculo de las reseñas promedios es:

```javascript
var updateAverageRating = function(locationid){
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
      function(err, location){
        if (!err){
          doSetAverageRating(location);
        }
      });
};

var doSetAverageRating = function(location){
  var i, reviewCount, ratingAverage, ratingTotal;
  if(location.reviews && location.reviews.length > 0){
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for(i = 0; i < reviewCount; i++){
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};
```

Notamos aca que no estamos enviando una respuesta JSON. Esto es porque la respuesta JSON ya la enviamos. La operacion completa aca es asincronica.

Añadir una reseña no es el unico momento en que queremos actualizar el rating. Por lo que cobra sentido hacer que estas funciones sean accesibles desde otro controlador y que no esten encadenadas en la accion misma de crear una reseña, cuestion que se lleva a cabo en el controlador que permite la creacion de reseñas.

# Metodos PUYt: actualizando la base de datos en MongoDB.

Los metodos PUT dicen relacion con la actualizacion de documentos o subdocumentos ya existentes en nuestra db. En este caso lo buscamos implementar respecto al controlador `locations.js` es:

* actualizar una locacion en particular.
* actualizar una reseña en particular.

Los metodos PUT son similares a los metodos POST, porque funcionand tomando los datos y posteandolos. Pero en vez de usar los datos para crear nuevos documentos en la DB, los metodos PUT actualizan los datos de documentos ya existentes.

# Usando Mongoose para actualizar documentos en MongoDB.
