# Construyendo el modelo de datos con Mongo y Mongoose.

# Cobertura del capítulo.

* aplicación de mongoose como puente entre Express/Node y la base de datos Mongo.
* definicion del esquema de modelo de datos usando Mongoose.
* conectar la aplicación a la base de datos.
* manejar la base de datos usando MongoDB en la terminal.
* enviar la base de datos a un ambiente en vivo.
* usar la base de datos correcta dependiendo del ambiente, distinguiendo entre el ambiente local y la versiones en vivo de la aplicación.

Para guardar datos necesitamos una base de datos. En este caso usaremos MongoDB. Por lo que el siguiente proceso es crear la base de datos y el modelo de datos.

Partiremos conectando nuestra aplicación a la DB antes de usar mongoose para definir el esquema y los modelos. La ventaja de MongoDB es que no necesitamos crear una base de datos, pues MongoDB lo hace por nosotros.

# Conectando la aplicacion en Express con MongoDB usando Mongoose.

Podriamos conectar directamente nuestra app con la DB pero el problema de mongo es que no ofrece una buena manera de mantener la base datos y las estructuras de datos.

La ventaja de mongoose es que nos permite definir la estructura de datos y los modelos, mantenerlos y usarlos para poder interactuar con nuestra base de datos.

Dentro del stack que estamos usando, Mongoose entra en el a trabajar directamente con express y node, y es el encargado de hacer las llamadas a la base de datos Mongo. Node y express luego le hablaran directamente a Angular.

# Añadiendo Mongoose a nuestra aplicacion.

Como ya hems visto la manera mas rapida y efectiva de instalar un modulo npm es a traves de la linea de comando, para luego poder añadirlo a nuestras dependencias de nuestro `package.json`.

En la raiz del directorio de nuestra app hacemos `npm install --save mongoose` y se añadira a nuestro archivo de las dependencias.

# Añadiendo Monggose para conectar nuestra aplicacion.

En este momento vamos a conectar nuestra aplicacion a la DB. No hemos creado la DB aun, pero eso no es relevante por el momento. Mongo creara la DB la primera vez que intentemos usarla.

# Mongo y Mongoose.

Mongoose nos permite tener a nuestra disposicion cinco conexiones con nuestra base de datos.

# Configurando el archivo de conexion.

Cuando decidimos crear los directorios de nuestra app dentro del directorio `app_server` creamos tres subdirectorios. Uno de ellos fue el subdirectorio `models`. Es este el que usaremos para conectar nuestra app con la base de datos.

Pasos:

1. creamos un archivo llamado `db.js` en el directorio models.

2. en el archivo escribimos:

```javascript
var mongoose = require('mongoose');
```

3. ahora debemos traer este archivo en nuestra aplicacion, particularmente importandolo en nuestro archivo `app.js` por lo que escribimos dentro de ese archivo:

```javascript
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_server/models/db');
```

Como no vamos a exportar ninguna funcion en el archivo `db.js` no necesitamos asignarlo a alguna variable. Solo necesitamos que este ahi. Ahora podemos reiniciar la aplicacion. No deberia haber ningun problema, y ya deberiamos tener mongoose trabajando para nosotros.

# Creando la conexion con Mongoose.

Para crear la conexion con Mongoose debemos declarar una `URI` para nuestra base de datos, y pasarla al metodo `conect` de mongoose. Una `URI` de una bd es un string que sigue el siguiente constructo:

`mongodb://username:password@localhost:27027/database`

Los parametros username, password y port son opcionales. Por lo que nuestra `URI` va a ser relativamente sencilla. Dado que tenemos mongodb instalado en nuestra maquina local, vamos a añadir el siguiente snippet de codigo a nuestro archivo `db.js` para crear las conexiones con nuestra base de datos:

```javascript
var dbURI = 'mongodb://localhost/Loc8r'
mongoose.connect(dbURI);
```

Para verificar que todo este funcionando correctamente tenemos que generar un evento de conexion.

**Observacion: el libro se salta pasos respecto a como trabajar con Mongo. Los siguientes son los pasos para verificar que mongo este trabajando y no produzca un error de conexion.**

1. hacemos en la termina en el directorio de nuestra app: `brew services start mongodb`. Esto inicia el servicio de mongo.
2. luego en la misma terminal: `mongod`. Se inicia la base de datos.
3. finalmente si queremos corroborar que mongo esta activado le damos `mongo` y se inica el REPL de mongo en donde podemos verificar las bases de datos que tenemos etc.

# Monitoreando las conexiones con los eventos de conexion en mongoose.

Con Mongoose se publicaran los eventos basados en los estados de conexion y estos eventos en general son bastantes sencillos de enganchar en nuestra aplicacion. Vamos a usar eventos para ver cuando la conexion esta hecha y cuando ocurre un error y la conexion se detiene. Cuando alguno de estos eventos ocurren vamos a logear un mensaje en la consola.

```javascript
mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconected');
});
```
Cuando la aplicacion se reinicie con nodemon deberiamos ver el mensaje de que de conexcion con la `dbURI` que establecimos.

# Cerrando una conexion con Mongoose.

Cerrar una conexion con Mongoose cuando la conexion termina es una buena practica asi como abrirla cuando comienza a usarse la app. La conexion tiene dos elementos: una en nuestra aplicacion, y otra en MongoDB. Mongo necesita saber cuando queremos cerrar la conexion para que no mantenga elementos redundantes de conexion abiertos.

Para monitorear las conexiones necesitamos escuchar a los procesos en node. Debemos escuchar un proceso llamado `SIGINT`.

Si estamos usando `nodemon` para reiniciar la app automaticamente tambien deberemos escuchar un proceso llamado `SIGUSR2`. Heroku usa otro evento llamado `SIGTERM` por lo que necesitaremos escucharlo a el tambien.

# Capturando los eventos de finalizacion de procesos.

Con todos estos eventos, una vez que los capturamos vamos a prevenir que sus comportamientos por defecto sucedan. Para eso tenemos que asegurarnos que reiniciamos el comportamiento requerdo luego de que cerremos la conexion en mongoose.

Para hacer eso necesitamos tres escuchadores de eventos y una funcion para cerrar la conexion con la base de datos. Cerrar la db es un actividad *asincronica*, por lo que vamos a tener que pasarle una funcion que al cerrar o abrir la conexion sea un callback. Mientras estamos en eso podemos enviar un mensaje a la terminal confirmando que la conexion se ha cerrado. Podemos envolver todo esto en una funcion llamada `gracefulShutdown`:

```javascript
var gracefulShutdown = function(msg, callback){
  //cerramos la conexion pasando una funcion anonima.
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
```

Ahora necesitamos llamar a la funcion cuando la aplicacion termina, o cuando nodemon se reinicia. En el siguiente codigo vemos los escuchadores de eventos de los cuales hablabamos:

```javascript
process.once('SIGUSR2', function(){
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});
process.on('SIGTERM', function(){
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});
```

Cada vez entonces que la aplicacion termina la conexion con la db es cerrada. Similarmente cuando nodemon reinicia la aplicacion tambien cierra la conexion. Notamos que para el caso de nodemon solo usamos el evento once, ya que queremos escuchar por el evento `SIGUSR2` solamente una vez, y porque nodemon tambien escucha por el mismo evento y no queremos que lo capture todas las veces.

# Recapitulacion del archivo `db.js`.

Recapitulando un poco tenemos que:

* definimos una conexion con la db.
* abrimos la conexion con mongoose cuando la aplicacion se inicia.
* monitoreamos los eventos de conexion con mongoose.
* monitoreamos algunos procesos de node como eventos, que nos permiten cerrar las conexiones con mongoose.

El codigo complejo del archivo `db.js` es el siguiente:

```javascript
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconected');
});
// definimos la funcion para cerrar las conexiones.
var gracefulShutdown = function(msg, callback){
  //cerramos la conexion pasando una funcion anonima.
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
//eventos que escuchan los procesos de node para cerrar correctamente las conexiones.
// reinicio de nodemon.
process.once('SIGUSR2', function(){
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});
// finalizacion de la app.
process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});
// finalizacion en Heroku.
process.on('SIGTERM', function(){
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});
```

El codigo de mas arriba es muy resusable ya que los eventos que estamos escuchando siempre son los mismos.

# Porque modelar los datos.

Cuando entramos en la pagina principal de nuestra aplicacion tenemos una serie de locaciones sobre las cuales tenemos datos y podemos escribir reseñas. La pagina en este sentido carga los datos dinamicos de estas locaciones, datos que estan definidos en el archivo de los controladores de nuestra aplicacion. Los datos en los controladores son cargados luego en la vista con nuestro trabajo en las plantillas de jade. Lo que deberiamos hacer ahora es mover un poco mas alla esos datos que estan en los controladores a nuestro directorio de `models`.

La ventaja de hacer esto que es solidifica los requerimientos de la estructura de datos de nuestra aplicacion. Esto refleja que la estructura de datso refleja las necesidades de nuestra aplicacion. Por lo que aca lo que haremos sera hablar de modelar los datos.

# Mongoose y lo que hace.

Mongoose permite manejar el modelo de datos de nuestra aplicacion dentro de nuestra aplicacion. Por lo que no es necesario trabajar sobre la base de datos. Definimos el modelo de datos desde nuestra aplicacion.

Veamos algunas convenciones de nombre que usaremos por el momento:

* en mongodb cada entrada es llamada `document`.
* en mongodb una coleccion de documentos es llamado `collection`.
* en mongoose la definicion de un documento es llamado `schema`.
* cada entidad individual de datos definida en el `schema` es llamada `path`.

Un modelo es una version compilada del `schema`. Todas las interacciones de datos usadas con mongoose pasan por el modelo.

# Como funciona el modelo de datos de mongoose.

Veremos primero un documento en mongo y luego un `schema` en mongoose:

```javascript
// Documento en mongo.
{
  "firstname": "Simon",
  "surname": "Holmes",
  _id : ObjectId("52279effc62ca8b0c1000007")
}
```

```javascript
// schema
{
  firstname: String,
  surname: String
}
```

Como podemos ver el schema hace referencia a los tipos de datos que estan dentro del documento. El schema en este caso refleja el nombre de cada ruta de datos y luego define el tipo de dato que va a contener.

# Definiendo un schema simple con mongoose.

Como sabemos un schema de mongoose es simplemente un objeto en js que definimos en nuestra aplicacion. Vamos a configurar este esquema.

Vamos a definir el schema en nuestro directorio `models` al lado de nuestro archivo `db.js`. Creamos en la carpeta `models` el archivo `locations.js`. Requerimos luego mongoose pues lo necesitamos para definir el `schema`.

```javascript
var mongoose = require('mongoose');
```

Vamos a requerir el archivo en nuestro archivo `db.js`:

```javascript
require('./locations');
```

# Configuracion basica del schema.

Con mongoose tenemos una funcion constructora que nos permiten definir nuevos `schemas` que tipicamente son asignados a variables.

```javascript
var locationSchema = new mongoose.Schema({});
```

El codigo lo añadimos a nuestro archivo `locations.js`.

# Definiendo el schema para controlar los datos.

El beneficio de mover los datos de la vista de los controladores hacia un schema es que nos permite visualizar de manera efectiva como queremos estructurar los datos con los que vamos a trabajar.

Vamos a partir definiendo el schema del controlador `homelist`. Recordemos que el controlador encargado de esto pasa lo siguientes datos respecto a nuestra primera locacion:

```javascript
locations: [{
  name: 'Starcups',
  address: '125 High Street, Reading, RG6 1PS',
  rating: 3,
  facilities: ['Hot drinks', 'Food', 'Premiun wifi'],
  distance: '100m'
}]
```

Teniendo esto podemos ya definir nuestro `schema` basico:

```javascript
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  facilities: [String],
  distance: String
});
```

# Asignando valores por defecto.

En algunos caso es util asignar valores por defecto cuando nuestro documento mongo es creado basado en nuestro esquema. Cuando una locacion es añadida a nuestra db no tendra reseñas ni rating.

Lo que podemos hacer es definir valores por defectos como el 0 para el caso de rating. En el caso de rating podemos definirlo asi en nuestro schema:

```javascript
var locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: {type: Number, "default": 0},
  facilities: [String],
  distance: String
});
```

# Añadiendo validacion: campos requeridos.

Con mongoose podemos facilmente añadir campos de validación para el caso de nuestro schema. Esto ayuda a manejar la integridad de los datos y proteger nuestra db de problemas asociados como datos perdidos o datos malformados.

Una forma de validar datos es asegurarnos de que los datos requeridos no esten vacios. Podemos hacer:

```javascript
name: {type: String, required: true}
```

Si luego intentamos guardar una locacion sin un nombre mongoose va a retornar un error de validacion que podemos capturar inmediatamente en nuestro codigo.

# Añadiendo validacion: limites de numeros.

La misma tecnica la podemos usar para definir valores maximos y minimos para ciertos campos de datos, como este caso el campo de rating, cuyo valor minimo sabemos que es 0 y su valor maximo es 5.

```javascript
rating: {type: Number, "default": 0, min:0, max: 5}
```

Con esto mongoose no nos dejara guardar valores de rating menores a 0 y mayores a 5.

# Usando datos geograficos en Mongo con Mongoose.

Mongo puede guardar datos geograficos com lat y long y puede manejar un index basados en estos datos. Esto permite a los usuarios hacer busquedas rapidas de lugares que estan cerca de otros o dadas ciertas coordenadas especificas.

Los datos geograficos estan guardados de acuerdo al formato GeoJSON. Podemos usar mongoose para definir en el schema estos datos geoespaciales en la ruta de nuestro schema. Para esto debemos:

* definir una ruta como un arreglo del tipo Number.
* definir una ruta teniendo un indice `2dsphere`.

```javascript
var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere'}
});
```

El campo `2dsphere` es critico pues permite a mongo hacer las consultas sobre el indice.

# Creando schemas mas complejos con subdocumentos.

Hasta el momento hemos definido un schema de datos bien sencillo en donde tenemos arreglos de string y strings propiamente tales. Vamos en todo caso a complejizar aun mas la manera en que definimos el schema.

Tenemos que nuestra pagina principal nos permite hacer click en las locaciones. Cuando hacemos click tenemos datos que estan siendo nuevamente transmitidos de manera dinamica desde nuestro controlador `locations.js` a taves de la plantilla de jade.

```javascript
location: {
    name: 'Starcups',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 3,
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    coords: {
        lat: 51.455041,
        lng: -0.9690884
    },
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
    }],
    reviews: [{
        author: 'Nicolas Riquelme',
        rating: 5,
        timestamp: '17 de Diciembre 2016',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
    }, {
        author: 'Charlie Chaplin',
        rating: 3,
        timestamp: '14 de junio del 2017',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
    }]
}
```
En la propiedad reviews lo que tenemos es un arreglo de objetos, asi como tambien lo tenemos para el caso de los horarios de apertura.

En bases de datos relacionales se crean dos tablas separadas para el caso de los horarios y las reseñas y se unen a traves de una consulta cuando necesitamos la informacion. En mongo tenemos una base de datos documental, por lo que todo lo que pertenece a un documento pariente debe permanecer en ese documento. En mongo tenemos el concepto de `subdocumento` para guardar datos que estan siendo repetitivos o datos que estan anidados, en este caso los datos de las reseñas y los datos de los horarios. Los `subdocumentos` son como los documentos propiamente tales en el sentido que contienen su propio schema y cada uno tiene su propio `_id` que mongo les asigna. Sin embargo los subdocumentos estan anidados dentro de los documentos y solo pueden accesados a traves una ruta del documento.

# Usando schemas anidados en mongoose para definir subdocumentos.

Los subdocumentos son definidos en mongoose usando schemas anidados. Para eso definiremos un nuevo schema para un subdocumento. Partiremos con los horarios de apertura de las locaciones. Notar que este schema que crearemos necesita estar en el mismo archivo que el schema de las locaciones, pero debe ir despues del schema `locationSchema`.

```javascript
var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});
```

Este schema es bastante sencillo y mapea sobre los datos que tenemos en el controlador. Hemos requerido dos campos, el campo `closed` y el `days`.

Para anidar este schema dentro de `locationSchema` es bastante sencillo:

```javascript
var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere'}
  openingTimes: [openingTimeSchema]
});
```

Con esto puesto podemos añadir multiples subdocumentos de una locacion dada, y estos seria guardados en esta locacion del documento. Un ejemplo de ello seria el siguiente documento en Mongo con el subdocumento openingTimes:

```javascript
{
"_id": ObjectId("52ef3a9f79c44a86710fe7f5"),
"name": "Starcups",
"address": "125 High Street, Reading, RG6 1PS",
"rating": 3,
"facilities": ["Hot drinks", "Food", "Premium wifi"], "coords": [-0.9690884, 51.455041],
"openingTimes": [{
    "_id": ObjectId("52ef3a9f79c44a86710fe7f6"),
    "days": "Monday - Friday",
    "opening": "7:00am",
    "closing": "7:00pm",
    "closed": false
  }, {
    "_id": ObjectId("52ef3a9f79c44a86710fe7f7"),
    "days": "Saturday",
    "opening": "8:00am",
    "closing": "5:00pm",
    "closed": false
  }, {
    "_id": ObjectId("52ef3a9f79c44a86710fe7f8"),
    "days": "Sunday",
    "closed": true
}]
}
```

Con este schema ya definido nos moveremos ahora al siguiente schema correspondiente a as reseñas.

# Añadiendo un segundo conjunto de subdocumentos.

Añadimos entonces el segundo subdocumento con su correspondiente schema y luego lo añadimos al final en nuestro archivo `locations.js`:

```javascript
var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});
```

Insertamos este schema en nuestro `locationSchema`:

```javascript
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});

var openingTimeSchema = new mongoose.Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, "default": 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere'}
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});
```
Que representa nuestro schema final para los datos de nuestra pagina relativa a las locaciones.

Un documento de mongo mapeado con el schema que hemos definido seria como el que sigue:

```javascript
{
  "_id": ObjectId("52ef3a9f79c44a86710fe7f5"),
  "name": "Starcups",
  "address": "125 High Street, Reading, RG6 1PS",
  "rating": 3,
  "facilities": ["Hot drinks", "Food", "Premium wifi"],
  "coords": [-0.9690884, 51.455041],
  "openingTimes": [{
    "_id": ObjectId("52ef3a9f79c44a86710fe7f6"),
    "days": "Monday - Friday",
    "opening": "7:00am",
    "closing": "7:00pm",
    "closed": false
  }, {
    "_id": ObjectId("52ef3a9f79c44a86710fe7f7"),
    "days": "Saturday",
    "opening": "8:00am",
    "closing": "5:00pm",
    "closed": false
  }, {
    "_id": ObjectId("52ef3a9f79c44a86710fe7f8"),
    "days": "Sunday",
    "closed": true
}],
"reviews": [{
            "_id": ObjectId("52ef3a9f79c44a86710fe7f9"),
            "author": "Simon Holmes",
            "rating": 5,
            "createdOn": ISODate("2013-07-15T23:00:00Z"),
            "reviewText": "What a great place. I can\'say enough good things about it."
          }, {
            "_id": ObjectId("52ef3a9f79c44a86710fe7fa"),
            "author": "Charlie Chaplin",
            "rating": 3,
            "createdOn": ISODate("2013-06-15T23:00:00Z"),
            "reviewText": "It was okay. Coffee wasn't great, but the wifi was fast."
          }]
}
```
Esto nos deberia dar una idea de como se ven los documento en mongo, incluidos los subdocumentos que se basaron el subschemas que definimos. Notamos que podemos leerlos porque son JSON aunque mongo lo que hace es almacenar BSON que son JSON binarios.

# Compilar schemas en los modelos.

Una aplicacion no interactua con los schemas de manera directa cuando se trabajan con los datos. La interaccion de los datos se hace a traves de los modelos.

En mongoose un modelo es una version compilada de los schemas. Una vez compilada una instancia del modelo mapea directamente a una instancia de un solo documento en nuestra db. Es a traves de esta relacion uno a uno que el modelo puede crear, leer, guardar y borrar datos.

Esta aproximacion hace que trabajar con mongoose sea relativamente sencillo.

# Compilando el modelo desde el schema.

Cualquier cosa con la palabra `compiling` suele sonar a algo complicado, pero en mongoose hacer la compilacion del schema en el modelo es relativamente sencillo.

Para hacer la compilacion tenemos que agregar el siguiente codigo en `locationSchema`:

```javascript
mongoose.model('Location', locationSchema);
```

El primer parametro del metodo hace referencia al nombre del modelo compilado. El segundo es la referencia al schema. **El codigo anterior lo añadimos despues de la definicion de nuestro schema general.**

# Usando la shell de MongoDB para crear una base de datos y añadir datos.

Para construir nuestra app Loc8r vamos a crear una nueva base de datos de manera manual y de la misma forma iremos añadiendo datos para ir probando. Esto implica que creamos una version particular de Loc8r para efectos de testeo y para poder trabajar directamente con MongoDB y probar cosas.

# Basicos de la shell de mongo.

Para iniciar el shell de mongo hacemos `mongo` en la terminal. Para hacer un listado de las dbs hacemos: `show dbs`.

Para usar una base de datos especial hacemos: `use local`. Se nos retorna un mensaje en que hemos cambiado a esa db para trabajar.

# Listando las colecciones en una base de datos.

Una vez que estamos en una base de datos particular es relativamente sencillo listar las coleciones de esa base de datos. Hacemos `show collections`. Si estamos usando por ejemplo la db `local` se nos retorna el mensaje `startup_log`.

# Viendo los contenidos de una coleccion.

La shell de mongo nos permite hacer consultas a los elementos de una base de datos. El modo de construir esa consulta es: `db.collectionName.find(queryObject)`. El `queryObject` se usa para especificar lo que estamos tratando de encontrar. La consulta mas sencilla es una vacia, que retorna todos los documentos de una coleccion.

Por ejemplo: `db.startup_log.fin()` devolvera toda las colecciones de esta base de datos.

# Creando una base de datos en mongo.

En realidad no se crea un db, lo que hacemos es que partimos usandola. Hacemos en la shell: `use Loc8r`.

# Creando una coleccion y documentos.

De manera similar no necesitamos crear explicitamente una coleccion en mongo. Se creara sola al momento en que nosotros guardemos por primera vez los datos:

Para establecer una correspondencia con el modelo vamos a querer tener una coleccion de `locations`. Podemos crear y guardar una coleccion al pasar el objeto de datos con el comando save como sigue:

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

Con este paso creamos una coleccion nueva en `locations` y ademas añadimos nuestro primer documento en la coleccion. Luego en la misma terminal podemos hacer `show collections` y veremos nuestra coleccion creada y podemos hacer la consulta respectiva. En este caso consultamos haciendo `db.locations.find();` lo cual nos retornara todos los documentos que la coleccion tiene. El retorno de la informacion no tendra cambios de linea, por lo que si queremos que se nos retorne un formato mas amigable de lectura hacemos `db.locations.find().pretty();`

# Añadiendo subdocumentos.

Notamos que nuestro primer documento no tiene los datos completos, ya que aun no integramos los subdocumentos de reseñas. Podemos añadir esto con el comando inicial save, como lo hicimos cuando recien añadimos el primer documento.

Mongo tiene un comando `update` que acepta dos argumentos. El primero es la consulta para saber que documento actualizar, y el segundo contiene las intrucciones de que hacer cuando encuentra el documento que queremos actualizar. En este momento podemos hacer una simple consulta al documento `Startcups` ya que sabemos que no hay duplicados. Para las instrucciones del objeto podemos usar el comando `$push` para añadir nuevos objetos en la ruta de las reseñas. No importa si la ruta no existe, mongo la añadira de todos modos.

El codigo seria:

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

Si corremos este comando en la consola de mongo usando la db `Loc8r` añadira la reseña al documento.  Podemos repetir este comando todas las veces que quieras, cambiando los datos para añadir multiples reseñas.

# Repitiendo el proceso.

Estos comandos no han permitido poner añadir datos dentro de nuesta db. Ahora podemos añadir mas locaciones.

Cuando terminemos con eso, estaremos listos para que nuestra aplicacion puedan comenzar a usar nuestra db, que en ese caso encaja muy bien con la construccion de una api. Antes que hagamos eso queremos actualizar nuestro repo en heroku.

# Enviando la base a un ambiente en vivo.

Las db necesitan estar externamente accesibles y no ser accesibles localmente. Vamos a ver como poner la db en un ambiente en vivo. Esto nos servira para que toda vez que actualicemos datos de nuestra app en la base de datos, esos datos se vean reflejados en las vistas con las que estamos trabajando.

Utilizaremos un servicio llamado `mongoLab` que puede ser usado como un add-on de Heroku.

# Configurando MongoLab.

Nuestra primera meta es obtener un acceso externo a nuestra db a traves del URI, de manera tal que podamos enviar datos y añadirlas a nuestra app.

El metodo que usamos para setear nuestra base de datos en un ambiente en vivo fue el de mongoLab. En este caso tenemos que primero hacernos una cuenta en mongoLab, generar un usuario y luego enviar este usuario en Heroku:

`heroku config:set MONGOLAB_URI=mongodb://<dbUser>:<dbUserPass>@ds145188.mlab.com:45188/wainola_locations`

Una vez configurado esto tenemos entonces la conexion establecida entre nuestro ambiente en vivo y nuestra base de datos.

Al utilizar la URI que MongoLab nos provee tenemos:
* el nombre de usuario de la base.
* la clave.
* la direccion del servidor.
* el puerto.
* el nombre de la base de datos.

# Enviando datos.

Ahora podemos hacer el push de los datos. Los pasos son:

* crear un directorio temporal que tenga datos de prueba.
* los datos de prueba de nuestro entorno de desarrollo de la base de Loc8r.
* restaurar los datos en nuestro ambiente en vivo.
* probar la base de datos viva.

# Creando el directorio temporal.

Creamos entonces el directorio donde tendremos los datos de prueba: `makdir tmp/mongodump`.

# Enviando los datos desde la db de desarrollo.

El proceso de enviar los datos es mas que todo una exportacion.
