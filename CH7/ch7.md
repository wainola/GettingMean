# Consumiendo la API REST. Usando la API desde Express.

El siguiente capitulo cubre:

* llamar a la api desde la aplicacion en express.
* manejar y usar los datos retornados por la API.
* trabajar con los codigos de respuesta de la API.
* enviar datos desde el navegador hacia la API.
* validaciones y errores.

En este capitulo lo que haremos sera amarrar el front con el back de nuestra aplicacion.

# Como llamar a la API desde Express.

Lo primero que necesitamos cubrir es como llamar a la API desde Express. Esta aproximacion nos sirve incluso para futuras APIS que tengamos pensadas diseñar.

# Añadiendo el modulo `request` a nuestro proyecto.

El modulo `request` es como cualquier otro modulo o paquete que hemos integrado a nuestra aplicacion y puede ser añadido a nuestra aplicacion usando el comando `npm`. Para instalar su ultima version hacemos:

```
npm install --save request
```

Cuando la instalacion este completa podemos incluir `request` en nuestros archivos para usarlos. En nuestra aplicacion solo tenemos un archivo para hacer eventuales llamadas a la API y ese archivo es `controllers` en el directorio de `app_server`, por lo que es ahi donde requeriremos nuestro modulo `request`:

```javascript
var request = require('request');
```

# Configurando las opciones por defecto.

Cada llamada de la API usando `request` tiene que tener una URL totalmente calificada. Esto es, debe incluir una direccion completa y no ser una ruta relativa como con las que hemos trabajado para recibir o enviar datos a la api. **Esta url sera diferente para los ambientes de desarrollo y en vivo**.

El problema de tener diferentes URL's es que debemos hacer constantes chequeos en cada controlador para hacer que las llamadas a la API sean correctas. Recordar que una cosa son las llamadas a la API en el ambiente de produccion, que esta seteado en nuestra instancia en vivo con MongoLab y otra cosa es nuestro ambiente de desarrollo que corresponde a nuestra maquina local. Las URIS de la db varian para estos efectos, por lo que la aplicacion debe ser capaz de detectar los cambios.

Para solucionar esto lo que podemos hacer es setear con un condicional la variable de entorno de node conocida como `NODE_ENV`. En codigo esto seria asi:

```javascript
var request = require('request');
var apiOptions = {
  server: "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://dry-ocean-36724.herokuapp.com/";
}
```

Con esto cada llamada que hagamos a la API puede referenciar a `apiOptions.server` y verificara si estamos usando el ambiente correcto.

# Usando el modulo `request`.

El constructor basico para hacer un `request` es bien sencillo:

`request(options, callback)`

Las opciones como parametro del modulo `request` pueden ser las siguientes:

* url
* metodo, por ejemplo GET, POST, PUT, etc.
* json.
* qs que es un objeto en js representando cualquier parametro de consulta en string.

Veamos un ejemplo:

```javascript
var requestOptions = {
  url: "http://yourapi.com/api/path",
  method: 'GET',
  json: {},
  qs: {
    offset: 20
  }
};
```
Esta son las opciones de especificaciones mas comunes. La funcion callback opera cuando una respuesta le llega desde la API en este caso. Esta funcion callback tiene tres parametros: un objeto error, una respuesta completa, y un cuerpo parseado de la respuesta. El objeto error sera nulo a menos que sea atrapado. Tres tipos de datos seran utiles en nuestro codigo: el codigo de estatus de la respuesta, el cuerpo de la respuesta, y el error lanzado.

```javascript
function(err, response, body){
  if(err){
    console.log(err);
  } else if (response.statusCode === 200){
    console.log(body);
  } else {
    console.log(response.statusCode);
  }
};
```
Poniendo todo junto el esqueleto de nuestras llamadas a la API quedaria como sigue:

```javascript
var requestOptions = {
  url: "http://yourapi.com/api/path",
  method: 'GET',
  json: {},
  qs: {
    offset: 20
  }
};
request(requestOptions, function(err, res, body){
  if(err){
    console.log(err);
  } else if (res.statusCode === 200){
    console.log(body);
  } else {
    console.log(res.statusCode);
  }
});
```

# Usando listas de datos desde la API.

Hasta este momento el controlador que hara todo el trabajo deberia tener la importacion del modulo `request`. Ahora viene la fase en que debemos comenzar a trabajar con el controlador y comunicarnos con la API.

Tenemos dos paginas sobre las cuales vamos a enviar datos. La pagina principal que muestra los lugares y la pagina de detalles donde hay mas informacion sobre estos lugares listados en primera instancia.

El actual controlador de nuestra pagina principal utiliza el metodo `res.render()` enviando los datos en formato de objeto a nuestro motor de plantillas. Los datos se encuentran almacenados actualmente en el controlador mismo.

Lo que nosotros queremos o el comportamiento esperado que buscamos es que la pagina principal exhiba los contenidos de almacenados como datos, luego de que estos contenidos sean extraidos de la API.

# Moviendo el renderizado a funciones declaradas.

Es una practica comun en js que, dado que las funciones son objetos, utilicemos la declaracion de funciones para luego reutilizarlas en distintas partes de nuestro codigo. Esto nos evita de escribir varias veces el mismo comportamiento para distintos callbacks. Por lo que desde el punto de vista de una buena practica de codigo, conviene poder tener una funcion declara que sea invocada cuantas veces sea necesario dentro de nuestro codigo:

```javascript
var renderHomePage = function(req, res){
  res.render('location-list', {
    title: 'Loc8r - find a place to work with wifi',
    ...
  });
};
module.exports.homelist = function(req, res){
  renderHomePage(req, res);
};
```

Este es mas o menos el esqueleto que buscamos incorporar.

# Construyendo el requerimiento a la API.

Lo que queremos es extraer datos de la API. Para eso debemos construir el requerimiento a la API o mejor dicho la llamada.

Para construir esta llamada necesitamos saber la URL, el metodo, el cuerpo JSON y el string de consulta a enviar. Dados estos parametros el mapeo de estos requerimientos en nuestra llamada es bastante directo.

Como ya vimos las opciones que se ingresan al modulo `request` es un simple objeto en js.

```javascript
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 20
    }
  };
  request(
    requestOptions,
    function(err, response, body){
      renderHomePage(req, res);
    }
  );
};
```

# Usando los datos de respuesta de la API.

Vamos ahora a usar los datos que la llamada a la API nos esta generando:

```javascript
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -0.7992599,
      lat: 51.378091,
      maxDistance: 20
    }
  };
  request(
    requestOptions,
    function(err, response, body){
      renderHomePage(req, res, body);
    }
  );
};
```

Notamos que el `body` de la funcion renderHomePage deberia ser un arreglo de locaciones. Esto es lo que necesita la funcion para enviar esos datos a la vista. Por lo que podemos modificar nuevamente nuestra funcion `renderHomePage` para que justamente renderice ese arreglo de locaciones:

```javascript
var renderHomePage = function(req, res, responseBody){
  res.render('location-list', {
    title: ' Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find a place to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody
  });
};
```
Podemos testear esto en el navegador al actualizar nuestro controlador.

# Definiendo mensajes de salida basados en los datos de respuesta.

**Nota: ya hemos solucionado casi todos estos problemas pero se hace relevante tomar algunas notas relativas al trabajo con la API en el cliente.**

Notamos que tenemos nuestra funcion `renderHomePage`:

```javascript
var renderHomePage = function(req, res, responseBody){
  res.render('location-list', {
    title: ' Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find a place to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody
  });
};
```

Esta funcion es la encargada de renderizar los elementos de la pagina principal de manera tal que se desplieguen dinamicamente con la llamada interna a la api. **Notamos que esto funciona asi debido a que usando el modulo `request` usamos una url que le pasamos al modulo para poder trabajar. Esta url es la url que sirve para listar los elementos de la API**.

Volviendo al tema: la funcion `renderHomePage` lo que deberia hacer es poder pasar a la vista un arreglo sobre el cual podamos iterar usando las capacidades de `jade`. Esto implica que podriamos estar en vista de diferentes tipos de datos que necesitamos manejar de manera apropiada:

El `responseBody` podria ser tres cosas:

* un arreglo de locaciones.
* un arreglo vacio sin locaciones encontradas.
* una cadena conteniendo mensajes que la API retorna debido a los errores.

Ya tenemos el codigo para lidiar con la opcion del arreglo:

```javascript
request(
  requestOptions,
  function(err, response, body){
    var i, data;
    data = body;
    if(response.statusCode === 200 && data.length){
      for(i=0; i<data.length; i++){
        data[i].distance = _formatDistance(data[i].distance);
      }
    }
    renderHomePage(req, res, data);
  }
);
```
Aca el parametro `body` es asignado a la variable `data`. Asumimos que ese parametro corresponde a un arreglo, por lo que se llevan a cabo dos verificaciones: el codigo de estado de la respuesta y el largo del arreglo. En este caso si la API retorna el mensaje de OK independiente de que retorne, entonces corremos un ciclo para formatear la distancia y luego llamamos a la funcion para enviar los datos. Nuevamente, aca estamos contando de que el retorno de los datos sera exitoso.

Ahora nos toca lidiar con lo otro: el caso de que el retorno de los datos no sea exitoso.

Para hacer esto necesitamos actualizar nuestra funcion `renderHomePage` para que haga lo siguiente:

* generar una variable que contenga un mensaje.
* chequear que el `body` de la respuesta sea un arreglo, y de no serlo enviar el mensaje apropiado.
* si la respuesta es un arreglo, generar un mensaje diferente en el caso de que este vacio.
* enviar el mensaje a la vista.

Esto lo logramos con el siguiente codigo:

```javascript
var renderHomePage = function(req, res, responseBody){
  var message;
  if(!(responseBody instanceof Array)){
    message = 'API lookup error';
    responseBody = [];
  } else {
    if(!responseBody.length){
      message = 'No places found nearby';
    }
  }
  res.render('locations-list', {
    title: ' Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find a place to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and seat? Loc8r helps you find places to work when out and about. Perhaps with coffe, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: responseBody,
    message: message
  });
};
```

Utilizando el operador `instanceof` verificamos que el arreglo sea una instancia de un arreglo. Usamos una sentencia en negativo para verificar que, si la instancia de un arreglo, entonces mande el mensaje correspondiente. En el caso de que la instancia sea un string, ignorara el resultado booleano, y se ejecutara de todos modos el condicional, generando esta vez un arreglo, asignando `responseBody`. Notamos que para que esto suceda, para que `responseBody` sea un arreglo, es que `responseBody` paso como otra instancia pero no un arreglo. En este caso se generar la asignacion.

Luego el `else` lo que hace es evaluar que, en caso de que la respuesta sea un arreglo, que este no tenga longitud. En este caso resulta que el arreglo esta vacio.

Finalmente hacemos la asignacion del nuevo atributo, generando una propiedad `message` con el valor del mensaje.

Actualizamos nuestro motor de plantillas para cargar como error el mensaje en caso de sucederce.

# Seleccionando documentos desde la API. La pagina de detalles.

Cuando tenemos cargada nuestra pagina principal tenemos las listas de locaciones que hemos ingresado previamente a la API. Ahora lo que nos toca hacer es regular la situacion cuando hacemos click en alguna de estas locaciones para ver la informacion particular de esta. Es decir debemos pedir los datos particulares de una de las locaciones.

# Configurando las urls en las rutas para acceder a documentos especificos con Mongo.

La ruta actual que tenemos para ver las locaciones particulares es `/locations`. Esto porque el controlador tiene la informacion en su interior y la renderiza directamente. Lo que queremos hacer es que, en base a un evento click, podamos obtener una locacion particular.

En nuestra API nosotros podemos obtener locaciones particulares al ingresar la ruta `/api/locations/:locationid`. Podemos hacer esto mismo en el lado cliente para el caso de las rutas de nuestra aplicacion principal en express. Hacemos esto en nuestro archivo `index.js`:

```javascript
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOther = require('../controllers/others');

/* Locaciones de las paginas.*/
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo); // añadimos el parametro /:locationid
router.get('/location/review/new', ctrlLocations.addReview);

/* Pagina otros */
router.get('/about', ctrlOther.about);

module.exports = router;
```

Ya que tenemos la ruta seteada en nuestro archivo `index.js` entonces ahora podemos comenzar a trabajar directamente con el controlador.

Una pregunta que se nos aparece con lo que acabamos de hacer es como obtenemos el ID de las locaciones particulares. Pensando en la aplicacion como un todo el mejor lugar para comenzar es la pagina principal. Lo que podemos hacer es asignar de antemando el ID de cada locacion que hemos llamado en la pagina principal, y asignarlo a algun elemento html con el cual estemos trabajando. Esa seria una solucion parcial.

```jade
extends layout

include _includes/sharedHTMLfunctions

block content
  #banner.page-header
    .row
      .col-lg-6
        h1= pageHeader.title
          smalll &nbsp;#{pageHeader.strapline}

  .row
    .col-xs-12.col-sm-8
      .error= message
      .row.list-group
      each location in locations
        .col-xs-12.list-group-item
          h4
            a(href='/location/#{location._id}')= location.name
            small &nbsp;
              +outputRating(location.rating)
            span.badge.pull-rigth.badge-default= location.distance
          p.address= location.address
          p
            each facility in location.facilities
              span.label.label-warning= facility
              | &nbsp;
    .col-xs-12.col-sm-4
      p.lead= sidebar
```

Tenemos que en el apartado `h4 a(href='/location#{location._id}')= location.name` cada vez que llamamos a las locaciones en la pagina principal, podemos luego hacer la llamada a las locaciones particulares al asignar el id de la locacion directamente el link. Ahora tenemos entonces los links asignados a la ruta de la locacion + el id unico.

# Moviendo el renderizado a una funcion.

Nuevamente el renderizado de la pagina lo haremos a traves de una funcion que llame a la API desde el controlador.

```javascript
var renderDetailPage = function(req, res){
  res.render('location-info', {
    ...
  });
};
module.exports.locationInfo = function(req, res){
  renderDetailPage(req, res);
};
```

Notamos que seguimos el mismo flujo de trabajo que hicimos para renderizar la pagina principal de nuestra aplicacion.

# Consultando a la API por un ID unico y un parametro de URL.

Dentro de la ruta que el controlador necesita invocar para llamar a un subdocumento particular esta la id del documento que queremos consultar. Para obtener estos valores podemos nuevamente usar `req.params` y añadirlo la ruta del `request` dentro de las opciones. El `request` es nuevamente uno de tipo `GET` por lo que la opcion `json` que le demos sera un objeto vacio.

Sabiendo esto podemos usar el mismo parametro que usamos cuando creamos el controlador de la pagina principal y hacer el requerimiento a la API. Luego llamamos a la funcion que creamos para renderizar todo el contenido.

```javascript
module.exports.locationInfo = function(req, res){
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid; // obtiene el id de la locacion desde la URL y la adjunta.
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body){
      renderDetailPage(req, res);
    }
  );
};
```

# Pasando los datos de la API a la vista.

Asumiendo que la API esta retornando los datos correctos, necesitamos hacer un preprocesamiento de esos datos para poder exhibirlos en la pagina.

```javascript
module.exports.locationInfo = function(req, res){
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid; // obtiene el id de la locacion desde la URL y la adjunta.
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body){
      var data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      renderDetailPage(req, res, data);
    }
  );
};
```

Lo siguiente que haremos es actualizar el controlador para usar los datos que recibimos de la API en vez de los datos que estan dispuestos ya en el controlador mismo.

```javascript
var renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};
```

Notamos que usamos el mismo enfoque para la pagina principal. Creamos una funcion que renderiza la vista y esa funcion es llamada cuando pasamos nuestro metodo `request`. Notamos que nuevamente, antes de llamar a nuestro metodo `request` generamos un objeto llamado `requestOptions` en el cual le damos los valores esenciales que vamos a recibir cuando hagamos la llamada:

```javascript
requestOptions = {
  url: apiOptions.server + path,
  method: 'GET',
  json: {}
};
```
Nuevamente le pasamos al metodo `request` estas opciones:

```javascript
request(
  requestOptions,
  function(err, response, body){
    var data = body;
    data.coords = {
      lng: body.coords[0],
      lat: body.coords[1]
    };
    renderDetailPage(req, res, data);
  }
);
```

Recordemos que el metodo `request` toma un parametro como opciones que es el objeto que ya mostramos, y luego toma la funcion callback en donde se pasan los datos. Notamos que el callback toma el `body` de respuesta que es un string en primera instancia y que luego pasa a ser un objeto, puesto que en las opciones del request generamos el atributo `json` como un objeto vacio. Y luego setea las coordenadas, creando un nuevo atributo del objeto con las cordenadas de la variable `body`. Finalmente hace la llamada a la funcion de renderizado:

```javascript
var renderDetailPage = function(req, res, locDetail){
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};
```
# Depurando los errores de vista.

Tenemos un problema con la vista. Por alguna razon no esta exhibiendo las reseñas de manera correcta. Revisemos uno por uno los problemas a los cuales nos estamos enfrentando.

Partiendo por la vista tenemos que:

```jade
small.reviewTimestamp #{review.timestamp}
```

Ahora debemos revisar el `schema` para ver si hemos cambiado algo cuando definimos el modelo. El `schema` para las reseñas es:

```javascript
var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});
```
Notamos que en el atributo `createdOn` es donde tenemos las fechas que permiten hacer referencia a cuando fueron creadas las reseñas. Podemos incorporar esto a las vistas haciendo:

```jade
small.reviewTimestamp #{review.createdOn}
```
Una ves recargada la pagina notamos que podemos exhibir las fechas pero en el formato en que son guardadas por el objeto `Date.now`. Por lo que ahora debemos formatear las fechas.

Para aproximarnos a la manera en que podemos formatear las fechas lo que podemos hacer es nuevamente crear un `mixin` de `jade` para poder formatear la fecha de creacion de las reseñas de manera correcta.

Tenemos lo siguiente:

```jade
mixin formatDate(dateString)
  -var date = new Date(dateString);
  -var d = date.getDate();
  -var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  -var m = monthNames[date.getMonth()];
  -var y = date.getFullYear();
  -var output = d + ' ' + m + ' ' + y;
  =output
```

El mixin toma la fecha cuando es llamado en `ormatDate(dateString)`. Crea luego una variable con un nuevo objeto `Date` pasando el parametro que recibe la funcion. Luego dado un arreglo con los meses, formatea la fecha.

Para llamar al mixin hacemos lo mismo que con el mixin anterior:

```jade
span.reviewAuthor #{review.author}
small.reviewTimestamp
  +formatDate(review.createdOn)
```

Con esto tenemos formateada las fechas con las cuales hemos creado las reseñas.

# Creando paginas de errores especificas.

¿Que sucede si no encontramos el ID de nuestra locacion? Deberiamos ser capaces en ese caso de enviar un mensaje de error personalizado. En este caso cuando se envia el ID de una locacion que no existe la API envia un mensaje de error del tipo 404. Este error se origina desde la URL del navegador, por lo que el navegador tambien deberia ser capaz de enviar un error del tipo 404.

Desde la perspectiva del lado servidor atrapar los errores depende en general de como escuchemos los mensajes de estado de codigo que recibimos. En este caso debemos mirar en `response.statusCode`.

# Atrapando todos los errores de codigo.

Mejor que solamente atrapar los errores que corresponden a mensajes de estado del tipo 404, podemos simplemente enfocarnos en considerar que todo lo que no es codigo 200 debe ser considerado un error, por lo que podemos crear una funcion que maneje todos estos errores.

La actualizacion de la funcion `location-info` queda como sigue:

```javascript
module.exports.locationInfo = function(req, res){
  var requestOptions, path;
  path = '/api/locations/' + req.params.locationid; // obtiene el id de la locacion desde la URL y la adjunta.
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    function(err, response, body){
      var data = body;
      if(response.statusCode === 200){
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        renderDetailPage(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};
```
# Añadiendo 
