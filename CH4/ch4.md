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
