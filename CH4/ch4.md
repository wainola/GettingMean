# Constuyendo un sitio estatico con node y express.

# Visión del capitulo.

* prototipar una aplicacion a traves de su version estatica.
* definir rutas para urls.
* crear vistas en Express usando `jade` y `bootstrap`.
* usar controladres para trabajar con las rutas.
* pasar datos a los controladores y a las vistas.

# Definiendo las rutas en express.

4 son las paginas que vamos a tener en nuestra aplicacion: de *locaciones* son tres paginas y de *otros* es una. Locaciones tiene las paginas listas, detalles y reseñas. Otros tiene la pagina about.

La direciones url para cada pagina seran:

* locations (lista) -> homepage -> url: `/`.
* locations -> detalles de la localidad -> url: `/location`.
* locations -> reseñas de las locaciones -> url: `/location/review/new`
* otros -> About Loc8r -> url: `/about`.

Cuando alguien visite la pagina principal lo que queremos hacer es mostrarle la lista de locaciones.

# Distintos controladores para diferentes colecciones.

Lo primero que no queremos es tener todos los controladores en un solo archivo. Por lo que seria logico dividirlos en razon de las vistas que pretendemos proponer al sitio.

Dado que existen dos vistas principales, *locations* y *others* entonces tendremos dos archivos .js para cada uno. Tendremos un archivo `locations.js` y otro `others.js`.

En el esquema general de la app tendremos:

```
`app.js` (aplicacion) -> `index.js` (rutas) -> `locations.js others.js` (controladores).
```

Notamos que tenemos un solo archivo de rutas y un controlador para cada una de las colecciones que vamos a utilizar. Este esquema nos ayuda a organizar nuestro codigo.

# Requiriendo los archivos controladores.

Los archivos `locations.js` y `others.js` estaran en la carpeta `app_server` en el subdirectorio `controllers`.

Estos archivos seran requeridos en el archivo `index.js` del directorio routes:

```javascript
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* GET pagina principal */
router.get('/', ctrlMain.index);

module.exports = router;
```

Ahora tenemos dos variables que podemos referir en nuetro archivo route.


# Configurando las rutas.

En el archivo `index.js` tendremos que tener rutas para las tres vistas de locations mas la pagina about de others.

Cada una de estas rutas debera referenciar a un controlador.

**Importante:** las rutas sirven como servicios de mapeo, toman URL de un requerimiento entrante, y mapean a una parte especifica de la aplicación.

Como ya sabemos que partes queremos mapear, todo lo que tenemos que hacer es poner el codigo en nuestro archivo `index.js`:

```javascript
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOther = require('../controllers/others');

/* Locaciones de las paginas.*/
router.get('/', ctrlLocations.homelist);
router.get('/locations', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Pagina otros */
router.get('/about', ctrlOther.about);

module.exports = router;
```

Tenemos entonces el mapeo de las URL a los controladores.

# Construyendo los controladores básicos.

En nuestro archivo `main.js` lo que hace es controlar la pagina principal.

```javascript
/* GET home page*/

module.exports.index = function(req, res){
  res.render('index', {title: 'Express'});
}
```
No es necesario usar este archivo, por lo que podemos eliminarlo.

# Añadiendo los controladores de `other.js`.

En el controlador `others.js`:

```javascript
module.exports.about = function(req, res){
  res.render('index', {title: 'About'});
};
```

Lo que hacemos aca es definir una ruta usamos la misma vista pero cambiando el titulo a About.

# Añadiendo el controlador de locations.

Añadir el controlador para `locations.js` sera lo mismo que hicimos para el caso del controlador `others.js`:

Crearemos tres funciones basicas de controladores: `homeList`, `locationInfo`, `addReview`. Notar que estas funciones corresponden a los nombres de las funciones en el modulo `index.js` de la carpeta router.

```javascript
/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('index', {title: 'Home'});
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('index', {title: 'Add review'});
};
```
Ahora podemos testear usando `nodemon`.

# Creando algunas vistas.

Ahora que tenemos algunas paginas vacias y las rutas hechas es necesario darle contenido a nuestra aplicación.

# Construyendo la navegación.

Bootstrap ofrece una coleccion de elementos y clases que sirve para crear la estetica del sitio de manera rapida y con relativa facilidad.

En la pagina de navegacion queremos poner:
* el logo de nuestra pagina.
* el link a la pagina `about` apuntando a la direccion `/about`.

Todo esto lo trabajamos en nuestro archivo `layout.jade`.

```jade
doctype html
html
  head
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(rel='stylesheet', href='/bootstrap/css/amelia.bootstrap.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
  .navbar-default-navbar-fixed-top
    .container
      .navbar-header
        a.navbar-brand(href='/') Loc8r
          button-navbar-toggle(type='button', data-toggle='collapse', data-target='#navbar-main')
            span.icon-bar
            span.icon-bar
            span.icon-bar
        #navbar-main-navbar-collapse.collapse
          ul.nav.navbar-nav
            li
              a(href='/about/') About

    block content

    script(src='/javascript/jquery-3.1.1.min.js')
    script(src='/bootstrap/js/bootstrap.min.js')
```

# Envolviendo el contenido.

Trabajando desde arriba hacia abajo la siguiente area es el `content block`. Notamos que el contenido no tiene ningun margen. Podemos solucionar esto al hacer `.container` sobre `block content`. Esto lo que hara sera centrar el contenido.

# Añadiendo el footer.

Proseguimos lo mismo. Debajo de block content ponemos el footer de la pagina.

```jade
.footer
  .row
    .col-xs-12
      small &copy; Nicolas Riquelme 2016
```

Esto lo insertamos dentro del `.container` que esta sobre el `block content`.

Todo el codigo junto se ve asi:

```jade
doctype html
html
  head
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(rel='stylesheet', href='/bootstrap/css/amelia.bootstrap.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body

    .navbar.navbar-default.navbar-fixed-top
      .container
        .navbar-header
          a.navbar-brand(href='/') Loc8r
          button.navbar-toggle(type='button', data-toggle='collapse', data-target='#navbar-main')
            span.icon-bar
            span.icon-bar
            span.icon-bar
        #navbar-main.navbar-collapse.collapse
          ul.nav.navbar-nav
            li
              a(href='/about/') About
    .container
      block content

      .footer
        .row
          .col-xs-12
            small &copy; Nicolas Riquelme 2016

    script(src='/javascript/jquery-3.1.1.min.js')
    script(src='/bootstrap/js/bootstrap.min.js')
```

# Constuyendo la plantilla.

Cuando se construyen la plantillas es bueno partir desde las partes mas sencillas de una pagina. En este caso seria la pagina de inicio o el `homepage`.

# Definiendo el esquema.

En el caso del tutorial que estamos siguiendo, el principal objetivo de la pagina `homepage` es exhibir una lsita de lugares. Cada lugar tendra un nombre, direccion, distancia entre otros datos. Tambien se añadiran el header en la pagina, asi como una lista en contexto.

# Configurando la vista y los controladores.

**El primer paso es crear una nueva vista, es decir un nuevo archivo vista y linkearlo al controlador. Por lo que en la carpeta `app_server/views` vamos a hacer una copia del archivo `index.jade` y lo guardamos como `locations-list.jade`. Este es el primer paso.

El segundo paso es decirle al controlador para la `homepage`, que queremos usar esta nueva vista. Por lo que modificamos el archivo `locations.js` en el directorio `app_server/controllers`.**

```javascript
/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('locations-list', {title: 'Home'});
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
  res.render('index', {title: 'Location Info'});
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('index', {title: 'Add review'});
};
```

# Copiando la plantilla de layout.jade.

El codigo de la pagina principal queda de la siguiente manera:

```jade
extends layout

block content
  #banner.page-header
    .row
      .col-lg-6
        h1 Loc8r
          smalll &nbsp;Find places to work with wifi near you!
  .row
    .col-xs-12.col-sm-8
      .row.list-group
        .col-xs-12.list-group-item
          h4
            a(href='/location') Starcups
            small &nbsp;
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star-empty
              span.glyphicon.glyphicon-star-empty
            span.badge.pull-rigth.badge-default 100m
          p.address 125 High Street, Reading, RG6 1PS
          p
            span.label.label-warning Hot drinks
            | &nbsp;
            span.label.label-warning Food
            | &nbsp;
            span.label.label-warning Premiun wifi
            | &nbsp;

        .col-xs-12.list-group-item
          h4
            a(href='/location') Starcups
            small &nbsp;
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star-empty
              span.glyphicon.glyphicon-star-empty
            span.badge.pull-rigth.badge-default 100m
          p.address 125 High Street, Reading, RG6 1PS
          p
            span.label.label-warning Hot drinks
            | &nbsp;
            span.label.label-warning Food
            | &nbsp;
            span.label.label-warning Premiun wifi
            | &nbsp;

        .col-xs-12.list-group-item
          h4
            a(href='/location') Starcups
            small &nbsp;
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star
              span.glyphicon.glyphicon-star-empty
              span.glyphicon.glyphicon-star-empty
            span.badge.pull-rigth.badge-default 100m
          p.address 125 High Street, Reading, RG6 1PS
          p
            span.label.label-warning Hot drinks
            | &nbsp;
            span.label.label-warning Food
            | &nbsp;
            span.label.label-warning Premiun wifi
            | &nbsp;


    .col-xs-12.col-sm-4
      p.lead Looking for wifit and a seat? Loc8r helps you find placer to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.  
```

# Añadiendo el resto.

Ahora que tenemos la pagina de localidades lista tenemos que añadir las siguientes vistas a nuestro proyecto:

* detalles.
* añadir reseñas.
* about.

# Pagina detalles.

La pagina detalles tiene lo siguiente:

* nombre.
* direccion.
* rating.
* horarios.
* facilidades.
* localizacion en el mapa.
* reseñas:
  * rating.
  * nombre del reseñador.
  * fecha de la reseña.
  * texto de la reseña.
* boton para añadir reseñas.
* texto para configurar el contexto de la pagina.

# Previo.

Como siempre debemos modificar nuestro archivo `locations.js` en nuestro directorio `controllers`:

```javascript
/* Obtener pagina principal*/
module.exports.homelist = function(req, res){
  res.render('locations-list', {title: 'Home'});
};
/* Obtener la pagina 'Location info'*/
module.exports.locationInfo = function(req, res){
  res.render('location-info', {title: 'Location Info'});
};

/* Obtener la pagina 'Add review'*/
module.exports.addReview = function(req, res){
  res.render('index', {title: 'Add review'});
};
```
Notamos que modificamos el modulo que obtiene la pagina `location-info`.

# La vista.

Añadimos la vista al archivo `location-info`:

```jade
extends layout

block content
  .row.page-header
    .col-lg-12
      h1 Starcups
  .row
    col-xs-12.col-sm-9
      .row
        .col-xs-12.col-sm-6
          p.rating
            span.glyphicon.glyphicon-star
            span.glyphicon.glyphicon-star
            span.glyphicon.glyphicon-star
            span.glyphicon.glyphicon-star-empty
            span.glyphicon.glyphicon-star-empty
          p 125 High Street, Reading, RG6 1PS
          .panel.panel-primary
            .panel-heading
              h2.panel-title Opening hours
            .panel-body
              p Monday - Friday: 7:00am - 7:00pm
              p Saturday : 8:00am- 5:00pm
              p Sunday : closed
          .panel.panel-primary
            .panel-heading
              h2.panel-title Facilities
            .panel-body
              span.label.label-warning
                span.glyphicon.glyphicon-ok
                | &nbsp; Hot drinks
              | &nbsp;  
              span.label.label-warning
                span.glyphicon.glyphicon-ok
                | &nbsp; Food
              | &nbsp;
              span.label.label-warning
                span.glyphicon.glyphicon-ok
                | &nbsp; Premiun Wifi.
              | &nbsp;
        .col-xs-12.col-sm-6.location-map
          .panel.panel-primary
            .panel-heading
              h2.panel-title Location map
            .panel-body
              img.img-responsive.img-rounded(src='http://map.googleapis.com/maps/api/staticmap?center=51.455041,-0.9690884&zoom=17&size=400x350&sensor=false&markers=51.455041,-0.9690884&scale=2')
  .row
    .col-xs-12
      .panel-heading
        a.btn.btn-default.pull-right(href='/location/review/new') Add review
        h2.panel-title Customer reviews
      .panel-body.review-container
        .row
          .review
            .well.well-sm.review-header
              span.rating
                span.glyphicon.glyphicon-star
                span.glyphicon.glyphicon-star
                span.glyphicon.glyphicon-star
                span.glyphicon.glyphicon-star
                span.glyphicon.glyphicon-star
              span.reviewAuthor Nicolas Riquelme
              small.reviewTimestamp 14 Diciembre 2016
                p What a great place. I can't say enough good things about it.
            .col-xs-12
              .row
                .review
                  .well.well-sm.review-header
                    span.rating
                      span.glyphicon.glyphicon-star
                      span.glyphicon.glyphicon-star
                      span.glyphicon.glyphicon-star
                      span.glyphicon.glyphicon-star-empty
                      span.glyphicon.glyphicon-star-empty
                    span.reviewAuthor Charlie Chaplin
                    small.reviewTimestamp 23 de Julio 2016
                  .col-xs-12
                    p It was okay. Coffe wasn't great, but the wifi was fast.
  .col-xs-12.col-md-3
    p.lead Simon's cafe is on Loc8r because it has accessible wifi and space to sit down with your laptot and get some work done.
    p If you've been and you like it - or if you don't - please leave a review to help other people just like you.
```

Le damos un poco de estilo en el archivo `style.css`:

```css
.review {padding-bottom: 5px;}
.panel-body.review-container {padding-top: 0;}
.review-header {margin-bottom: 10px;}
.reviewAuthor {margin: 0 5px;}
.reviewTimestamp {color: #ccc;}
```

Ahora podemos ir a la direccion `localhost:3000/location` para ver el resultado.

# Añadiendo la pagina de reseñas.
