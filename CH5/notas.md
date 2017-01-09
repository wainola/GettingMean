# Modelo de datos: Mongo y Mongoose.

## Primeros pasos.

Nosotros ya tenemos una aplicacion hecha en express. La aplicacion lo que haces es conectar una serie de datos de la web que tenemos levantada y mostrarlas en la vista. La forma en que se exhiben los contenidos es bajo el paradigma MVC. Bajo este diseño de arquitectura, la vista esta separada del modelo y de los controladores. En estricto rigor, la vista es cargada dinamica a traves de los controladores.

Nuestra app tiene la siguiente estructura de directorios **previo diseño del directorio reservado para la API**:

```
Loc8r
|
|_app_server
  |_controllers
  |_routes
  |_views
|_bin
|_node_modules
|_public
  |_bootstrap
  |_images
  |_javascripts
  |_stylesheets
|_.gitignore
|_app.js
|_package.json
|_Procfile
```

Siguiendo esta estructura de directorios, nuestra app esta actualmente cargando la vista desde la informacion almacenada en los controladores y son cargados dinamicamente en la vista a traves de un motor de plantillas. El directorio `routes` nos sirve para definir las rutas url y los metodos que se utilizan para exponer las vistas. Estos metodos son todos del tipo `GET`, que invocan en razon de una ruta, un metodo de controlador encargado de cargar la vista.

Este es el panorama general de lo que seria el **lado cliente de nuestra aplicacion**. Ahora vamos a desarrollar el lado servidor, fundamentalmente la API que tenga los datos almacenados en una db.

## Objetivo de la API.

Hasta el momento nuestra aplicacion conecta la informacion almacenada
en la vista a traves de los controladores. Un ejemplo de esto es el codigo de la pagina principal de nuestra aplicacion:

```javascript
module.exports.homelist = function(req, res){
  res.render('locations-list', {
    title: 'Loc8r - find a placer to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!',
    },
    sidebar: 'Looking for wifi and seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: [{
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
      distance: '100m'
    }, {
      name: 'Cafe Hero',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 4,
      facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
      distance: '200m'
    }, {
      name: 'Burguer Queen',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 2,
      facilities: ['Food', 'Premiun wifi'],
      distance: '250 m'
    }]
  });
}
```
Aca hay varios elementos que vale la pena analizar de manera sucinta:

* `module.exports.homelist` representa el modulo que estamos exportando para ser usado en nuestro archivo de las rutas. Como todo modulo, es una funcion que recibe dos parametros, un `request` y un `response`.
* utilizamos la funcion `res.render()` que renderiza la vista y envia esos datos en forma de string al cliente. El metodo toma como parametro el nombre del archivo en las vistas, y lo conecta, permitiendo definir un esquema rudimentario de datos para procesar con el motor de plantillas.
* El segundo parametro que toma el metodo `res.render()` es un objeto. Este objeto son todos los datos que seran desplegados en la vista de la pagina. El despliegue de los datos se hace a traves de la iteracion o posicionamiento directo de esos elementos invocados a traves del motor de plantillas.

Notamos que esta es una aproximacion rudimentaria pero efectiva. En nuestros controladores almacenamos la informacion de nuestro sitio y a traves de motor de plantilla  cargamos esa informacion para ser desplegada **dinamicamente** en funcion de las rutas que le pedimos a la pagina en el navegador.

El objeto de estas notas es reforzar los conocimientos obtenidos en la construccion de la API. La API REST que diseñamos tendra la misma informacion almacenada en los controladores, pero la cargara a traves de llamadas a la base de datos. Por lo que en nuestro esquema de aplicacion, aca comenzamos a trabajar directamente con la base de datos y con mongoose, que permite hacer el modelado y los esquemas de nuestra base.

# Express + MongoDB a traves de Mongoose.

La conexion entre la DB y Express puede hacerse directamente, no obstante Mongo no ofrece buenas caracteristicas para mantener la db y la integridad de la estructura de datos. O al menos no de manera amigable.

Mongoose ofrece varias ventajas para definir la estructura de datos y el modelo de la db. Mongoose es un intermediario entre nuestra db en Mongo y nuestra app en Express.

Para añadir mongoose a nuestra aplicacion, podemos hacer un `npm install --save mongoose` y esto añadira no solo el modulo, sino que tambien añadira la dependencia a nuestro `package.json`.

## Nueva estructura de directorios y configuracion del archivo de conexion.

Dado que comenzaremos a programar nuestra API, la estructura de directorios cambia. Tenemos que es como sigue:

```
Loc8r
|
|_app_api
  |_controllers
  |_models
  |_routes
|_app_server
  |_controllers
  |_routes
  |_views
|_bin
|_node_modules
|_public
  |_bootstrap
  |_images
  |_javascripts
  |_stylesheets
|_.gitignore
|_app.js
|_package.json
|_Procfile
```

* en el directorio `controllers` almacenamos los controladores encargados de lidiar con los metodos HTTP referidos a la API. En ese directorio tendremos dos archivos, `locations.js` y `reviews.js`. Esto obedece a que nuestra aplicacion opera sobre dos estructuras de datos que deben ser tratadas de manera diferente. La primera son las locaciones, que constituyen los documentos principales en nuestra db. La segunda son las reseñas que estan adjuntas a las locaciones y que por ende son tratadas como subdocumentos. Si nuestra aplicacion fuera de otra indole es altamente probable que el tratamiento de los datos seria similar.
* el directorio models contiene dos archivos: `db.js` y `locations.js`. El archivo `db.js` controla los eventos de conexion o desconexion a nuestra db. El archivo `locations.js` es donde definimos el esquema general de los documentos de nuestra db.
* en el directorio `routes` definimos el archivo `index.js` que es el encargado de direccionar las peticiones de rutas a nuestra api y entregar las respuestas exhibidas a traves de los controladores.

Para conectar con la db y manejar los estados de las conexiones en nuestro archivo usamos entonces lo siguiente:

```javascript
var mongoose = require('mongoose');
```
Luego debemos ir a nuestro archivo `app.js` en donde debemos hacer el requerimiento de nuestro archivo `db.js`:

```javascript
// Fragmento del archivo app.js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// requerimos el archivo que maneja las conexiones con la db.
require('./app_api/models/db');

```

Notamos que no asignamos el requerimiento a ninguna variable. Esto es porque en nuestro archivo `db.js` no vamos a exportar ninguna funcion.

## Creacion de la conexion.

Inicialmente la conexion a la db la vamos a hacer de manera local. Para generar una conexion con la db debemos declarar una URI, que es un unificador de recursos uniformes, que constituye una cadena de caracteres que identifica los recursos de una red unica. La URI nos servira para conectar mongoose a nuestra DB a traves del metodo `conect`.

Las URI's de las db's siguen el siguiente constructo:

```
mogodb://username:password@localhost:27027/database
```

Los parametros username y password son en este caso opcionales. Notamos que al final del constructo de la URI va el nombre de nuestra db. En nuestro archivo `db.js` hacemos:

```javascript
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r'
mongoose.connect(dbURI); // establecemos la conexion de manera exitosa.
```

Para hacer la verificacion debemos generar eventos de conexion que nos indiquen que estamos conectados a la db. Antes que eso debemos activar la db usando el comando `mongod` y luego verificar que tenemos la base lista para trabajar.

Notar que para crear una base de datos en la terminal de mongo hacemos:

`use Name_DB` donde Name_DB puede ser cualquier nombre de base de datos. Esto crea la db pero no aparece listada si hacemos `show dbs`. Una vez que ingresemos datos, podremos ver la nueva db lista para ser usada.

## Monitoreo de conexiones con eventos de mongoose.

En nuestro archivo `db.js` nos preocuparemos de manejar las conexiones a la db que se realicen en los distintos entornos sobre los cuales estamos trabajando. Para eso usaremos los eventos con el metodo `connection` y el evento `on`. Tres son los mensajes que debemos asegurarnos de remitir:

* conectado.
* error.
* desconectado.

Los constructos usando el metodo de mongoose es:

`mongose.connection.on('estado', callback)`

Notamos que el monitoreo de la conexion opera sobre el evento `on` de node. Tenemos entonces:

```javascript
mongoose.connection.on('conectado', function(){
  console.loh('Mongoose conectado a ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('Mongoose error de conexion ' + err)
});
mongoose.connection.on('desconectado', function(){
  console.log('Mongoose desconectado');
});
```
Estos son los constructors basicos para manejar conexiones en mongoose utilizando el evento `on` de node.

## Cierre de conexiones.

El cierre de conexiones es una buena practica cuando notamos que la conexion se termina. La conexion en este caso que establecemos tiene dos puntos: una en nuestra aplicacion y otra en Mongo. Lo que tenemos que hacer aca es decirle a Mongo que queremos cerrar la conexion que hemos abierto.

Para monitear el estado de las conexiones necesitamos escuchar los procesos en node. Debemos escuchar el proceso `SIGINT` y otros dos procesos mas.

La sintaxis para manejar los eventos de conexion es la siguiente:

```javascript
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
  console.log('Mongoose conectado a ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('Mongoose error de conexion ' + err);
});
mongoose.connection.on('desconnected', function(){
  console.log('Mongose desconectado');
});
// funcion que cierra conexciones.
var gracefullShutDown = function(msg, callback){
  mongoose.connection.close(function(){
    console.log('Mongoose desconectado a traves de ' + msg);
    callback();
  });
};
// Los siguientes son eventos que escuchan los procesos de node para cerrar las conexiones.
// evento 1: reinicio de nodemon.
process.once('SIGUSR2', function(){
  gracefullShutDown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});
// finalizacion de la app
process.on('SIGINT', function(){
  gracefullShutDown('app termination', function(){
    process.exit(0);
  });
});
// finalizacion en HEROKU.
process.on('SIGTERM', function(){
  gracefullShutDown('Heroku app shutdown', function(){
    process.exit(0);
  });
});
```
Este codigo es reusable en el caso de que estemos implementando un flujo de trabajo que incluya nodemon para la visualizacion de cambios de nuestra app, el deployado en heroku etc.

## Notas sobre los procesos capturados.

**SIGUSR2**: es una interrupcion de señal dada por alguna aplicacion determinada por el usaurio. Node ocupa el `SIGUSR1` y nodemon en este caso ocupa el `SIGUSR2`.
**SIGINT**: terminacion de la señal por el teclado. Normalmente involucra las teclas CTRL+C.
**SIGTERM**: terminacion de la señal. En este caso obdece a la terminacion de la señal por parte de heroku.

## Recapitulacion.

Hasta el momento hemos definido la arquitectura basica del archivo `db.js` que es el que regula las conexiones entre `mongoose` y la base de datos.

Se definio para el manejo de conexiones con la db una funcion que tiene la siguiente estructura:

```javascript
var nombreFuncion = function(mensaje, callback){
  // se cierra la conexion con el metodo de mongoose close.
  mongoose.connection.close(function(){
    console.log('Desconexion de mongoose a traves de ' + mensaje);
    callback();
  });
};
```
En esta aproximacion el callback hace referencia a la funcion que llamamos para hacer la terminacion de los procesos. En el caso del reinicio de `nodemon` la funcion callback llamada al metodo `process.kill(process.pid)`.

Esta solucion es bastante estandar si estamos usando como flujo de trabajo nodemon y heroku.

## Modeloamiento de los datos.

La gracia de `mongoose` es que nos permite determinar a traves de codigo el esquema general de nuestra base de datos. La determinacion del esquema ayuda a establecer salvaguardas para la creacion de documentos en nuestra db. Todo esto es llevado a cabo en el directorio `models`.

Cuando trabajamos con `mongodb` tenemos que:

* cada entrada es un `document`.
* una coleccion de entradas o `documents` es llamada una `collection`.
* con mongoose la definicion de la estructura de un documento es llamada `schema`.
* las entidades individuales de datos definidas en un `schema` es llamada una ruta o `path`.

El `modelo` en este caso es la version compilada del `schema`. Todas las interaciones de datos pasan por el modelo.

El mongo un documento se presenta de la siguiente manera en la shell:

```javascript
{
  "nombre": "Nicolas",
  "apellido": "Riquelme",
  _id: ObjectId("2434364574534534534dfgfbvd")
}
```
En mongoose este `schema` es definido de la siguiente manera:

```javascript
{
  nombre: String,
  apellido: String
}
```
Dado que en este caso estamos trabajando con una pagina que busca crear reseñas de lugares, al modelo de nuestra db le pondremos un nombre referente a el tipo de datos que vamos a guardar ahi, que en este caso es el de locaciones. Por lo que en el mismo directorio de `models` donde tenemos guardado nuestro archivo `db.js` vamos a crear un archivo llamada `locations.js` que servira como nuestra `schema` de nuestra db.

Luego de creado el archivo para definir el `schema` requerimos le archivo en nuestro archivo `db.js`:

```javascript
require('./locations');
```

Luego en nuestro archivo `locations.js` donde hemos vamos a definir nuestro `schema` hacemos:

```javascript
var mongoose = require('mongoose');
var locationSchema = new mongoose.Schema({});
```

La funcion `new mongoose.Schema({});` es la que nos va a permitir crear los `schemas` tanto de documentos como de subdocumentos de nuestra aplicacion.

Notamos que en nuestra pagina, fundamentalmente en el archivo controlador, la vista carga y renderiza la siguiente informacion:

```javascript
locations: [{
  name: 'Starcups',
  address: 'Pericles 1580, depto 202',
  rating: 3,
  facilities: ['Buen cafe artesanal', 'wifi de mucho poder', 'Comida gourmet'],
  distance: ' 100m'
}]
```
En razon de eso podemos definir inmediatamente el `schema`:

```javascript
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0},
  facilities: [String],
  distance: String
});
```
Inmediatamente podemos añadir validaciones de datos que corresponden a campos requeridos. En primera instancia como estamos comunicando entre la base y la app directamente a traves de consola, los mensajes de errores van a ser impresos en la consola. Por ejemplo podemos pedir que el campo `name` sea un campo requerido dandole dentro del objeto el atributo `required`.

Las validaciones tambien pueden ser numero para campos como `rating` en donde existe un tope de valores que pueden tomar este campo. En el caso de las coordenadas geograficas, el campo seria:

```javascript
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0},
  facilities: [String],
  distance: String,
  coords: {type: [Number], index: '2dsphere'}
});
```
La ruta del indice es del tipo `2dsphere`.

Muchas veces las bases de datos en mongo van a manejar subdocumentos, que en este caso son documentos dentro de documentos. Las definiciones de como lidiamos con documentos dependen de los requerimientos que la aplicacion que estamos diseñando tiene. En este caso dado que tenemos un documentos principal llamado `locations`, tenemos que añadir como subdocumentos las reseñas, que en ultima instancia seran campos añadidos en comunicacion desde el cliente hacia el servidor. En el caso de los subdocumentos podemos definir el schema como sigue:

```javascript
var openingTimesSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});
```

Es de notar que las definiciones de los subesquemas de los subdocumentos deben hacerse sobre el esquema general del documento. En ese caso, todos los esquemas de los subdocumentos van sobre el esquema general. El codigo final nos quedaria como sigue:

```javascript
var mongoose = require('mongoose');
var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});
var openingTimesSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0},
  facilities: [String],
  distance: String,
  coords: {type: [Number], index: '2dsphere'},
  openingTimes: [openingTimesSchema],
  reviews: [reviewSchema]
});
```

Definido el `schema` de nuestra base de datos debemos compilarlos. Notamos que la aplicacion no trabajar con el `schema` sino que con la version compilada. En nuestro archivo sobre el cual definimos el `schema` añadimos:

```javascript
var mongoose = require('mongoose');
var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});
var openingTimesSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0},
  facilities: [String],
  distance: String,
  coords: {type: [Number], index: '2dsphere'},
  openingTimes: [openingTimesSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);
```

El primer parametro del metodo model hace referencia al nombre del modelo compilado, y el segundo al schema.

# Creacion de colecion y documentos en mongo.

Las db no necesitan ser creadas para trabajar sobre ellas en mongo. Si queremos añadir entradas hacemos:

```javascript
db.locations.save({
  name: 'Starcups',
  address: '125 High Street, Reading, RG6 1PS',
  rating: 3,
  facilities: ['Hot drinks', 'Food', 'Premium wifi'],
  coords: [-0.9690884, 51.455041],
  openingTimes: [{
    days: 'Monday - Friday',
    opening: '7:00am',
    closing: '7:00pm',
    closed: false
  }, {
    days: 'Saturday',
    opening: '8:00am',
       closing: '5:00pm',
    closed: false
  }, {
    days: 'Sunday',
    closed: true
  }]
});
```
Con esto tenemos creada una nueva coleccion en `locations` y ademas añadimos nuestro primer documento en la coleccion. Es conveniente antes de hacer esto usar el comando `use <nombreDB>` para luego poder guardar usando el comando `db.<nombreDB>.save({});`.

Para añadir subdocumentos usamos el comando `db.<nombreDB>.update({});`. El metodo toma dos argumentos en notacion literal. El primero es el nombre de la db que queremos actualizar y el segundo es el elemento que queremos añadir: en este caso una reseña:

```javascript
db.locations.update({
  name: 'Starcups'
}, {
  $push: {
    reviews: {
      author: 'Nicolas Riquelme',
      id: ObjectId(),
      rating: 5,
      timestamp: new Date('Dic 24, 2016'),
      reviewText: 'What a great place. I can\'t  say enough good things about it.'
    }
  }
});
```

Con estos dos comandos podemos ir llenando la db de contenido que luego sera usada mediante la arquitectura API Rest.
