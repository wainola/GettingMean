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

La manera de pensar en esta aproximacion parte por el hecho de que tenemos que pensar en los elementos que estan en nuestra db. 
