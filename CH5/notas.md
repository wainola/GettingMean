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
