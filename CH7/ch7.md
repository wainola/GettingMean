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
