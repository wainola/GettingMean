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
