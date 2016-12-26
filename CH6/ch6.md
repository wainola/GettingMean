# Escribiendo una API REST. Exponiendo la DB a la aplicacion.

El capitulo cubre:

* las reglas de las APIS REST.
* patrones de APIS.
* funciones CRUD.
* uso de express y mongoose para interactuar con MongoDB.
* Testeo de los `endpoints` de la API.

Tenemos configurado nuestra base de datos con Mongo a traves de mongoose. El problema es que la interaccion con mongo solo la podemos hacer a traves de la terminal. Es por esto que en este capitulo lo que haremos sera construir una REST API con la cual podamos interactuar a traves de llamadas `HTTP` y realizar operaciones `CRUD`.

# Las reglas de una API REST.

Hagamos una suerte de recapitulacion de las reglas de las APIS REST.

* REST significa **REpresentational State Transfer**, que es un estilo de arquitectura mas que un protocolo estricto. REST no tiene estado, por lo que no tiene idea del estado actual del usuario.
* API es la abreviacion referida a una interfaz publica de una aplicacion. Las API permite a las aplicaciones hablar con otras aplicaciones.

Por lo REST API es una interfaz sin estado de una aplicacion. En el caso del stack MEAN la API REST es usada para crear una interfaz sin estado de nuestra base de datos, permitiendo una manera en que otras aplicaciones puedan trabajar con datos.

Las API REST tienen una serie de estandares asociados. No es necesario seguirlos todos pero la idea es que nos mantengamos cerca de ese estandar de manera tal que nuestra API tenga buenas practicas de codigo.

En terminos basicos una API REST toma un request HTTP y lleva a cabo cierto procesamiento, enviando de vuelta una respuesta HTTP. El estandar que vamos a seguir para efectos de la app que estamos creando se orientan en tornoa los protocolos de requerimiento y respuesta.

# Request de URL's.

El requerimiento de URL de nuestra API REST tiene un estandar bien simple. Seguir este estandar hara que nuestra aplicacion sea facil de trabajar y mantener.

La manera de pensar en esta aproximacion parte por el hecho de que tenemos que pensar en los elementos que estan en nuestra db. Dada esta coleccion uno siempre tendra una serie de URL's para cada elemento de la coleccion. Tambien podriamos tener una serie de URL's para cada subdocumento de la coleccion. Cada URL en un conjunto tendria su propia ruta basica mas algunos parametos que definiriamos.

Dentro de un conjunto de URL's necesitamos cubir una serie de acciones que generalmente estan basadas en el estandar de operaciones CRUD.

* crear un nuevo item.
* leer una lista de muchos itemes.
* leer un item especifico.
* actualizar un item especifico.
* borrar un item especifico.

Dado el ejemplo de la app que estamos programando tenemos que Loc8r tiene una coleccion llamada `locations` con la cual queremos interactuar. En estrictor rigor cada locacion tiene la misma ruta URL, lo que cambian en este caso serian los parametros que apuntan a elementos particulares que buscamos exhibir en la api.

# Metodos request.

Los metodos de HTTP request pueden ser diferentes, pero en esencia le estan indicando al servidor que es lo que tienen que hacer. El requerimiento mas comun de todos es el `GET` que es el metodo que se usa cuando entramos una url en nuestra barra de navegacion de nuestro navegador. Otro metodo bien comun es el `POST` que usualmente se utiliza para subir datos.

Por ejemplo un metodo `POST` puede crear nuevos datos en nuestra base de datos. Lo cual puede implicar que veremos nuevos objetos de datos en nuestra db. Un metodo `GET` puede leer datos de una db. Por lo que de respuesta se obtiene un objeto de la db.

Utilizaremos los cuatro metodos HTTP que son:

* POST.
* GET.
* PUT: actualiza un documento en una db.
* DELETE: borra un objeto de una db.

Los metodos son importantes pues toda API REST bien diseñada usualmente tendra la misma URL para diferentes acciones. En estos casos, los metodos le estan diciendo al servidor que tipo de operacion deben realizar.

Si consideramos las rutas y los parametros de nuestra API y las mapeamos en razon de los metodos `request` apropiados, podemos tener un seudo diseño de API:

* crear una nueva locacion: metodo `POST`. La url seria `http://loc8r.com/api/locations`.
* leer una lista de locaciones: metodo `GET`. La url seria `http://loc8r.com/api/locations`.
* Leer una locacion especifica: metodo `GET`. La url seria `http://loc8r.com/api/location/123`. El parametro que se pasa es el id de la locacion.
* acutalizar una locacion especifica: metodo `PUT`. El parametro que se pide es el id de la locacion.
* Borrar una locacion espeficia: el metodo es `DELETE`. El parametro que se pasa es el id de la locacion.

Notar que los parametros pasados son simplemente argumentos que nos permiten filtrar los elementos que estamos buscando en la api.

Actualmente nuestra aplicacion tiene solo una coleccion por lo cual constituye un punto de partida. En todo caso los documentos en la coleccion de loc8r tiene reseñas como subdocumentos por lo que tambien debemos mapear esas relaciones.

# Rutas de los subdocumentos.

Mapear las relaciones de la API con los elementos de nuestra DB no es dificil, sobre todo pensando en los subdocumentos que en este caso corresponden a las reseñas de los lugares. En este caso los metodos son iguales a los generados para el caso de crear nuevas locaciones etc.

Si queremos crear una nueva reseña esa reseña tiene una url de ruta particular asociada a la locacion particular, por lo que la url seria `http://loc8r.com/api/location/123/reviews` utilizando claro esta el metodo `POST`. Nuevamente el parametro que le pasamos a nuestra API es el parametro del id de la locacion. Para los otros elementos como leer, actualizar y borrar usamos los metodos que ya conocemos: `GET`, `PUT` y `DELETE`. Notamos que no tenemos un metodo que nos envie la lista de reseñas. Esto es porque cuando el documento principal se cargue es ahi donde recuperaremos la lista de reseñas.

# Respuestas y codigo de estatus.

En una buena API si uno a esta le pide un requerimiento esta deberia responder con el requerimiento. Es decir una API bien diseñada deberia poder operar bajo todos los parametro sobre los cuales le estamos pidiendo la informacion.

Para una API exitosa tenemos respuestas estandarizadas que son importantes asi como tenemos metodos `request` estandarizados.

Existen dos componentes esenciales en una respuesta:

* los datos retornados.
* el codigo de estatus de HTTP.

Al combinarlos ambos en nuestra API deberia dar a quien hace el requerimiento la informacion necesaria para continuar.

# Retornando datos desde una API.

Nuestra API deberia retornar datos consistentes en un formato de datos consistente. Los formatos tipicos de API REST son XML y JSON. Vamos a usar JSON para nuestra API, ya que calza de manera natural con nuestra app MEAN.

La API va a devolver al menos uno de estos tres elementos cuando le hagamos un requerimientos:

* un objeto `JSON` conteniendo los datos de respuesta de la consulta.
* un objeto `JSON` conteniendo datos de error.
* una respuesta nula.

# Usando los codigos de estatus de HTTP.

Una buena API RESt deberia retonar los codigos de estatus de HTTP correctos. Los codigos de estatus son:

* 200: ok.
* 201: Creado.
* 204: Sin contenido.
* 400: Mal requerimiento.
* 401: Sin autorizacion.
* 403: Prohibido.
* 404: No encontrado.
* 405: Metodo no permitido.
* 409: Conflicto.
* 500: Error interno del servidor.

# Configurando la API en express.
