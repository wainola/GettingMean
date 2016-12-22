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

  
