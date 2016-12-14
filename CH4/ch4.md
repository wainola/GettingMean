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
