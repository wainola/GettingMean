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
