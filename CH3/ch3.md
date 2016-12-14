# Visión del capitulo.

* manejo de dependencias con `package.json`.
* configuración del proyecto con `Express`.
* configuración del ambiente MVC.
* esquema general con `bootstrap`.
* publicación con `heroku`.

# Definiendo las dependencias a usar con `package.json`.

El `package.json` es un archivo en donde están presente los datos de la aplicación que vamos a construir como las dependencias que utiliza.

# Creación de un proyecto Express.

Elementos necesarios a tener en cuenta cuando creamos un proyecto en `express`:

* node y npm en la maquina instaladas.
* el generador Express instalado globalmente.
* git.
* heroku.
* CLI.

# Configurando Express.

## Opciones de configuración.

Las opciones de configuración que podemos definir con express son las siguientes:
* que templating de HTML usaremos.
* que preprocesador de CSS usaremos.
* adicción de soporte para sesiones.

Si quisieramos usar LESS y Hogan hariamos:

`express --css less --hogan`

En el caso de las opciones de maquetado de HTML tenemos: jade, EJS, JsHtml y hogan. La idea basica de un motor de maquetado de HTML es que se crea la plantilla basica de html y se le pasan datos, que luego el motor compila y convierte en html basico.

Ejemplo de sintaxis de jade:

```
#banner.page-header
  h1 My page
  p.lead Welcome to my page
```

Se convierte en:

```html
<div id="banner" class="page-header">
  <h1>My page</h1>
  <p class="lead">Welcome to my page</p>
</div>
```

Para crear entonces nuestro proyecto express corremos en la terminal `express` y luego instalamos las dependencias con `npm install`.

# Reinicio automatico de la aplicacion con nodemon.

Para usar `nodemon` simplemente instalamos globalmente tal cual lo hicimos con express:

```
npm install -g nodemon
```
`nodemon` nos permite no tene que estar ejecutando el comando `npm start`cada vez que queramos probar alguna caracteristica de la aplicación que estamos programando.

Para usarlo en la carpeta donde programaremos la aplicacion, vamos al directorio y hacemos `nodemon`.

# Modificando la estructura MVC de Express.

MVC: model-view-controler. La idea detras de este concepto es separar los datos de la vista y la lógica de la aplicacion. La idea es lograr una integración efectiva entre las distintas partes o componentes de la app.

# Ciclo en MVC.

En general una aplicación web lo que hara es que, dado el requerimiento por parte de un usuario, se retornara una respuesta ante ese requerimiento. En terminos de MVC:

* un requerimiento llega a la aplicacion.
* el requerimiento es enrutado por el controlador.
* el controlador hace un requerimiento al modelo.
* el modelo responde al controlador.
* el controlador envia una respuesta a la vista.
* la vista envia una respuesta al origen del requerimiento.

# Modicando la estructura de directorios.

Si revisamos el directorio del proyecto en `express` vamos a encontrar una estructura de archivos que incluyen el directorio `views`, el directorio `routes`, pero no hay directorios `models` o `controllers`.

Para trabajar desde la arquitectura MVC vamos a:

* crear un directorio `app_server`.
* en el directorio `app_server` creamos dos subdirectorios: `models` y `controllers`.
* movemos los directorios `routes` y `views` al directorio `app_server`.

# Usando los directorios `views` y `routes`.

Lo primero que debemos hacer es indicarle a `express` que hemos movido los directorios `views` y `routes`, ya que cuando ejecutemos de nuevo el comando express, este buscara en los directorios por defecto que asigno en la creacion del proyecto.

Para hacer esto vamos a el archivo `app.js` y hacemos la siguiente modificación:

```javascript
app.set('views', path.join(__dirname, 'app_server', 'views'));
```

La app aun no funcionara porque hemos movido el directorio `routes`:

# Usando la nueva localización de `routes`.

Nuevamente en el archivo `app.js` cambiamos a lo siguiente:

```javascript

var routes =  require('./app_server/routes/index');
var users = require('./app_server/routes/users');
```

Ahora si guardamos y corremos la aplicación de nuevo tendremos nuevamente todo ok.

# Separando controladores de ruteo.

Debemos buscar separar controladores de ruteo. Controladores son los encargados de la logica de la aplicacion, mientras que el ruteo es encargado del mapeo de las url.

## Entendiendo definiciones de rutas.

En nuestro directorio `routes` tenemos el siguiente codigo:

```javascript
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
```

`router.get()` es donde el router busca por un requerimiento `GET` de la pagina principal que es justamente la URL `/`. La funcion anonima que corre el codigo es realmente el controlador, que renderiza `index` que esta en la carpeta views. Es justamente esto que queremos separar. El ruteo de los controladores.

Una aproximación que podemos tomar es sacar la funcion anonima callback de la funcion route y nombrarla. Esto nos permite tener una aproximación ingenua a como podemos separar el ruteo de los controladores.

```javascript

var homepageController = function(req, res){
  res.render('index', {title: 'Express'});
};

/* GET pagina principal */
router.get('/', homepageController);
```

Si hacemos la modificación en vivo la pagina deberia funcionar.

## Entendiendo `res.render()`.

La funcion `res.render()` es la encargada de compilar las plantillas de vista y enviar un respuesta al navegador en html.

## Moviendo el controlador fuera del archivo de ruta.

En node par referencia un nuevo modulo se crea este modulo exportandolo y luego requiriendolo en el archivo en el cual lo necesitemos. Usualmente la mejor practica o quizas la mas completa sea usar `module.exports` para exportar funciones completas.

Para este caso primero debemos crear un archuvo llamado `main.js` en nuestra carpeta `controllers` y crear un metodo de exportación llamado `index` para ser usado por la funcion `res.render()` en nuestro archivo de rutas.

En el archivo `main.js` creamos entonces la exportación:

```javascript

/* GET home page*/

module.exports.index = function(req, res){
  res.render('index', {title: 'Express'});
}
```

El siguiente paso es requerir el modulo en el archivo `index.js`:

```javascript

var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET pagina principal */
router.get('/', ctrlMain.index);

module.exports = router;
```

Ahora tenemos la arquitectura del ruteo y los controladores armadas parcialmente. Si cargamos la pagina nuevamente se despliega correctamente.

# Importanto Bootstrap.

Para aplicar un esquema estetico de manera mas rapida, se utilizara boostrap, por lo que los archivos de éste se copian al directorio `public`.

# Trabajo con jade.

Cuando abrimos el archivo `index.jade` vemos lo siguiente:

```jade
extends layout

block content
  h1= title
  p Welcome to #{title}
```

A pesar de los sucinto de la sintaxis hay algunas cosas que explicar aca:

* el archivo `index.jade` esta siendo una extension del archivo `layout.jade`.
* luego de esa sentencia tenemos un bloque llamado `content` donde va un titulo, que hemos definido en nuestro controlador, y un parrafo donde se da la bienvenida.

Notamos que no hay referencias a los elementos basicos de un html, como la etiqueta body o la etiqueta head. Todas estas se encuentran en el archivo `layout.jade`.

```jade
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
```

Notamos los elementos estructurales basicos de un esquema de html y ademas el elemento `block content` que luego es referenciado y utilizado por el archivo `index.jade`.

## Añadiendo Bootstrap.

Para añadir elementos externos como bootstrap usar el archivo `layout.jade` hace sentido. En este archivo debemos lograr lo siguiente:

* referenciar bootstrap.
* referenciar bootstrap en sus archivos js.
* referenciar jQuery que es requerido por bootstrap.
* añadir el `viewport` para que la pagina escale bien en dispositivos moviles.

Para eso trabajamos sobre el `layout.jade`. Una vez que seteamos el esquema general tendremos lo siguiente:

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
    block content

    script(src='/javascript/jquery-3.1.1.min.js')
    script(src='/bootstrap/js/bootstrap.min.js')
```

# Haciendo el deploy en heroku.

Para hacer el deploy con heroky debemos primero tener nuestra cuenta en heroku y hacer el login a traves de la terminal de nuestro pc. Luego de eso añadimos los motores a nuestro `package.json`:

```javascript
{
  "name": "loc8r",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "engines": {
    "node": "~6.9.1",
    "npm": "~3.10.8"
  },
  "dependencies": {
    "body-parser": "~1.15.2",
    "cookie-parser": "~1.4.3",
    "debug": "~2.2.0",
    "express": "~4.14.0",
    "jade": "~1.11.0",
    "morgan": "~1.7.0",
    "serve-favicon": "~2.3.0"
  }
}
```

# Testeo local con heroku.

Una vez que hemos configurado nuestro `package.json`, este archivo le dira a `heroku` que nuestra aplicacion es una aplicacion `node.js`.

Para poder probarla localmente hacemos `heroku local` en la terminal una vez logeados. Esto nos permite acceder al servidor local en el `localhost:5000`.

# Haciendo el pushing usando git.

Los pasos a seguir son:

* guardando la aplicacion en git: debemos guardar la aplicacion en git en nuestra maquina local.
  1. inicializar el directorio como un repo git.
  2. decirle a git que archivos queremos añadir al repo de git.
  3. hacer commits de los cambios en el repo.

Una vez hecho esto tenemos el repo local generado y estamos listos para hacer nuestra aplicacion en heroku.

El siguiente paso es crear.  una aplicacion en heroku. Para eso hacemos `heroku create`. Esto nos da una url donde la aplicacion estar, ademas del nombre del repo remoto en git.

Si nos logeamos en el navegador veremos tambien la app de heroku generada. Esto nos permite tener un container de nuestra aplicacion y lo siguiente es enviar a este container todos los elementos de nuestra app.

# Haciendo el deploy.

Tenemos la aplicacion en un repo de git y hemos creado un nuevo repo remoto en heroku. El repo remoto esta vacio, por lo que necesitamos hacer un push de los contenidos de nuestro repo local al repo de heroku.
