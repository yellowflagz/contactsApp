- [Desarrollo y documentación del proyecto](#desarrollo-y-documentación-del-proyecto)
  - [Configuración Inicial del Proyecto](#configuración-inicial-del-proyecto)
    - [Instalación de NodeJS - Express y Nodemon](#instalación-de-nodejs---express-y-nodemon)
    - [Setup de MongoDB y Variables de Entorno](#setup-de-mongodb-y-variables-de-entorno)
    - [Creación del modelo de datos con Mongoose](#creación-del-modelo-de-datos-con-mongoose)
  - [Definición de la API](#definición-de-la-api)
    - [Archivo de Rutas](#archivo-de-rutas)
  - [Definición de endpoints (API)](#definición-de-endpoints-api)
    - [Creación de usuarios](#creación-de-usuarios)
    - [Devolver todos los contactos](#devolver-todos-los-contactos)
    - [Devolver un contacto en concreto](#devolver-un-contacto-en-concreto)
    - [Modificar un contacto](#modificar-un-contacto)
    - [Borrar contactos](#borrar-contactos)
  - [Estructura de la Página Web](#estructura-de-la-página-web)
    - [Requisitos Previos](#requisitos-previos)
      - [Conexión a MongoDB](#conexión-a-mongodb)
      - [Views , Template Engines y Middleware](#views--template-engines-y-middleware)
    - [Endpoints de la App Web ¿Cómo funcionan?](#endpoints-de-la-app-web-cómo-funcionan)
      - [Obtener la lista de Contactos](#obtener-la-lista-de-contactos)
      - [Crear un Contacto](#crear-un-contacto)
      - [Borrar un contacto](#borrar-un-contacto)
      - [Obtener la página Edit](#obtener-la-página-edit)
      - [Editar un Contacto](#editar-un-contacto)
  - [Página Web Completada](#página-web-completada)

# Desarrollo y documentación del proyecto

## Configuración Inicial del Proyecto

Antes de empezar, crearemos nuestra base de datos para su posterior uso. Usaremos MongoDB Atlas ya que nos proporciona un hosting de base de datos de manera gratuita, lo cual está genial para trabajar en un proyecto como este.

Nos dirigiremos a [https://www.mongodb.com/es](https://www.mongodb.com/es) y nos crearemos una cuenta, acto seguido elegiremos la opción gratuita.

En el apartado de configuración, sencillamente **escogemos el provider que más nos guste y la región más cercana a nosotros.**

Una vez le damos a crear, tardará unos minutos en montarlo todo, mientras tanto podemos ir al apartado de **Security > Database Access y crear un usuario para nuestra base de datos.**

También necesitamos indicarle en el apartado de Network Access **desde qué direcciones IP vamos a conectarnos para que la base de datos nos permita acceder** a ella.

Aquí iría vuestra dirección IP pública o la dirección IP del servicio que quiere acceder a la base de datos. Como vamos a estar desarrollando la aplicación, **lo más cómodo es ponerla en "Allow access from anywhere" y posteriormente modificarlo.**

![mongo2](/mdassets/Untitled_2.png)

### Instalación de NodeJS - Express y Nodemon

Primeramente necesitaremos instalar [NodeJS,](https://nodejs.org/es/) una vez lo tengamos instalado, desde la terminal del sistema operativo y situándose en el directorio raíz del proyecto, ejecutaremos el siguiente comando para inizializar el proyecto con NodeJS:

```jsx
npm init --yes
```

También necesitaremos levantar un servidor web, y nada mejor para esto que **[Express](https://en.wikipedia.org/wiki/Express.js)**

```jsx
npm i express
```

Lo siguiente que haremos será crear la carpeta "**src"** en la raíz del proyecto, y dentro de ella, el archivo **index.js,** donde escribiremos el código del servidor.

```jsx
const express = require("express"); // Requerimos express como módulo

const app = express(); // Se le asigna una constante para un mejor manejo
const port = process.env.PORT || 9000; // Puerto en el que funcionará el servidor

app.listen(port, () => console.log("server listening on port", port));

// Finalmente declaramos mediante el método listen que nuestro server escucha por
// el puerto indicado, y que cuando conecte, imprima un mensaje en pantalla.
```

Al asignar **process.env.PORT** a nuestra constante, **conseguimos que utilice el puerto asignado por el entorno** **en el que se encuentre** si así lo necesitásemos (por ejemplo una web de hosting), en caso contrario, usaría el puerto 9000.

Antes de continuar, **instalaremos nodemon,** es un paquete que permite al servidor **actualizarse automáticamente cada vez que guardemos nuestros cambios**, lo que lo hace super útil a la hora de desarrollar.

Como se trata de una **dependencia de desarrollo**, es decir, que no se necesita para que la app funcione, **agregaremos la flag -D**

```jsx
npm i nodemon -D
```

Es un buen momento para hablar del archivo **package.json,** este archivo **es el corazón de cualquier proyecto de NodeJS. Almacena todos las dependencias y módulos requeridos por el proyecto, define el punto de entrada, define scripts...**

Si echamos un ojo a nuestro package.json veremos que aparecen **express y nodemon como dependencias.**

```js
{
  "name": "webAppProyecto",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": { 	    // Dependencias para el correcto funcionamiento de la aplicación
    "express": "^4.17.1"
  },
  "devDependencies": {     // Dependencias para el desarrollo de la aplicación

    "nodemon": "^2.0.15"
  }
}
```

Ahora que entendemos qué es y para qué sirve el package.json, es momento de **cambiar el script de inicialización** que trae por defecto. **Este script define los parámetros a la hora de iniciar el servidor**, en nuestro caso vamos a poner que inicie el servidor con nodemon.

```js
{
  "name": "webAppProyecto",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon src/index.js" // Hacemos que nodemon inicialice index.js
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

Ahora es el momento de **iniciar el servidor.**

```jsx
npm run start
```

Navegamos a [localhost:9000](http://localhost:9000), **y deberíamos de recibir el error "Cannot GET /"**

Esto **ocurre por que no tenemos rutas definidas todavía**, entonces el servidor nos devuelve un error.

> Si no hubiésemos instalado nodemon, **tendríamos que apagar y volver a encender el servidor cada vez que cambiásemos algo en el proyecto**, de esta manera, podemos desarrollar de una manera mucho más cómoda y eficiente.

Nos dirigiremos a nuestro archivo **index.js,** y definiremos una ruta raíz mediante el **método get**.

```jsx
const express = require("express");

const app = express();
const port = process.env.PORT || 9000;

// Nuestras rutas

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

app.listen(port, () => console.log("server listening on port", port));
```

Al método get se le pasan dos valores, **el primero es la ruta y el segundo es una función flecha con los valores request y response,** donde podremos indicar lo que queremos que nos devuelva.

### Setup de MongoDB y Variables de Entorno

Nosotros **vamos a estar utilizando la base de datos no-relacional [MongoDB](https://www.mongodb.com/es)**, pero se podría utilizar una base de datos SQL como [**MySQL**](https://www.mysql.com/) o directamente almacenar nuestros datos en arrays de JavaScript si así lo deseásemos.

Para el mejor manejo de la base de datos, **vamos a instalar el paquete [Mongoose](https://codigofacilito.com/articulos/que-es-mongoose)**, que nos otorgará características como **validaciones, construcción de queries, middlewares....** A demás de todo esto, **simplifica la sintáxis** a la hora de escribir el código.

Volveremos a la terminal, y con **CTRL+C apagamos el server**. Escribimos el siguiente comando

```jsx
npm i mongoose
```

Esto instalará el paquete y lo añadirá al package.json, y como no podía ser de otra manera, **vamos a requerirlo en nuestro index.js y a establecer la conexión con la base de datos.**

```jsx
const express = require("express");
const mongoose = require("mongoose"); // Requerimos mongoose

const app = express();
const port = process.env.PORT || 9000;

// routes

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

// Mongoose

mongoose.connect("Tu_Key"); // Necesitamos pasarle nuestra key de MongoDB como parámetro

app.listen(port, () => console.log("server listening on port", port));
```

Podemos obtener la key dirigiéndonos a la **dashboard de MongoDB, en driver seleccionamos NodeJS junto con su versión correspondiente.**

![Untitled](/mdassets/dashboard.png)

Sin embargo, pegar nuestra key en texto plano directamente en el código, no es lo más práctico.

**Vamos a crear una variable de entorno para poder acceder a ella tantas veces como queramos** (como la que usamos para definir el puerto), y que nuestro código esté mas limpio y organizado.

> No es lo mismo ver una string larguísima, que a saber qué significa, que ver una variable que se llame MONGODB_URI

Para crear variables de entorno personalizadas, **vamos a instalar un nuevo paquete llamado dotenv.**

```jsx
npm i dotenv
```

Posteriormente **lo requerimos en index.js**

```jsx
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// routes

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

// Mongoose

mongoose.connect();

app.listen(port, () => console.log("server listening on port", port));
```

En esta ocasión **no será necesario asignarle una constante, ya que solo con declararlo ya podremos acceder a nuestras propias variables de entorno.** Las vamos a definir en un archivo llamado "**.env"** que estará localizado en la raíz de nuestro proyecto.

```jsx
MONGODB_URI =
  "mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@cluster0.ybp3b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
```

Una vez definida la variable de entorno volvemos a index.js

```jsx
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

// routes

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

// Mongoose

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo")) // Nos conectamos a la base de datos
  .catch((error) => console.error(error));

// Si la conexión es satisfactoria, devuelve "Connected to Mongo"
// Si ocurre un error, devuelve el error.

app.listen(port, () => console.log("server listening on port", port));
```

Reiniciamos el servidor, y **debería de salirnos en consola "Connected to Mongo"**

### Creación del modelo de datos con Mongoose

Para conseguir interactuar correctamente con la base de datos, **le debemos de asignar un modelo de datos**. Este modelo lo tenemos que crear nosotros, en este caso **como usamos MongoDB, lo crearemos con Mongoose.**

> En cierta manera **los modelos de datos se parecen bastante a cuando defines una tabla en SQL**

Nos dirigimos a la carpeta src y **crearemos una carpeta llamada "models"**. Dentro de esta **crearemos el archivo user.js**, donde se definirán los modelos de datos para nuestro objeto user.

```js
// models/user.js
const mongoose = require("mongoose"); // Requerimos mongoose

const userSchema = mongoose.Schema({
  // Definimos el schema y lo asignamos a una constante
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema); // Importante exportarlo para que luego en routes/user.js podamos requerirlo

// ¿A que ahora el el modelo de datos tiene algo más de sentido?
```

Y posteriormente **lo importamos en routes/user.js para poder trabajar con él**

```js
const express = require("express");
const router = express.Router();
const userSchema = require("../models/user"); // <=================

router.post("/users", (req, res) => {
  res.send("create user");
});

module.exports = router;
```

Si tuviésemos que trabajar con algún otro tipo de dato, **tendríamos que repetir estos pasos para definir su modelo de datos**, sin embargo, mi proyecto trata sobre una agenda de contactos, así que **con definir un modelo** (el de los contactos, que en este caso se llama user) **sería más que suficiente**.

> Un modelo de datos, **define el tipo de datos que envía y recibe la base de datos**, también **es necesario para trabajar con el servidor y la API.**

## Definición de la API

Ahora **es momento de definir nuestra API. **La API **permite interactuar con el servidor y la base de datos** a cualquier persona que esté en su posesión**. Lo cual nos sirve para **reutilizar todo el proyecto en un futuro\*\*.

Antes, definimos una ruta raíz en el archivo index.js, sin embargo, **definiremos las rutas en su propio directorio y archivo para distinguir las rutas de la API, de la Web App.** De esta manera nuestro proyecto estará mucho más organizado, y cuando queramos modificar el código nos será infinitamente más fácil hacerlo.

### Archivo de Rutas

Para ello **crearemos un nuevo directorio dentro de src llamado routes.**

Dentro de este directorio, **crearemos un archivo llamado user.js,** donde definiremos todas las rutas que queramos, en este caso para la api del servidor.

```jsx
const express = require("express"); // Requerimos express
const router = express.Router(); // Asignamos el método router a una constante

// Nuestras rutas

module.exports = router; // Exportamos las rutas para que los demás archivos puedan acceder a ellas
```

El módulo router nos servirá para definir todas estas rutas, **empezaremos por definir una ruta para nuestra [API](https://www.redhat.com/es/topics/api/what-are-application-programming-interfaces).**

```js
const express = require("express");
const router = express.router();

router.post("/users", (req, res) => {
  // Usamos el método post
  res.send("create user");
});

module.exports = router;
```

De momento, esta ruta no devuelve nada, para poder trabajar con ella la tenemos que **"añadir" a nuestro index.js**

```js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user); // Requerimos nuestro archivo user

const app = express();
const port = process.env.PORT || 9000;

// middleware

app.use("/api", userRoutes); // Mediante el método use, indicamos que queremos usar "/api" como prefijo de nuestras rutas

// routes

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

// Mongoose

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.error(error));
app.listen(port, () => console.log("server listening on port", port));
```

Una vez requeridas las rutas, usando **"app.use"**, agregamos el prefijo "/api"a todas nuestras rutas especificadas en user.js.

> **Todo software que se sitúa entre la petición del cliente y la respuesta del servidor, se denomina [middleware](https://es.wikipedia.org/wiki/Middleware#:~:text=El middleware es todo software,de datos en aplicaciones distribuidas.).**

Ahora la ruta que definimos en user.js funciona correctamente, solo que solo devuelve una string ("create user"). Lo que tenemos que hacer ahora es indicarle **cómo va a crear ese usuario.**

> Mientras creamos nuestras rutas **será necesario testearlas y ver qué valores nos retornan,** para ello vamos a utilizar una [**extensión de VSCode llamada REST Client**](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) aun que podríamos utilizar multitud de herramientas como [Postman](https://www.postman.com/).

Una vez instalada la extensión, **crearemos un archivo llamado "requests.http" en la raíz del proyecto.** Acto seguido le indicamos **dónde queremos hacer la request:**

```js
###
POST <http://localhost:9000/api/users> HTTP/1.1 // Request a /api/users
Content-Type: application/json // Le indicamos el tipo de contenido que va a devolver, en este caso un JSON

{}
```

Si le damos a send request nos devolverá lo siguiente:

```js
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 11
ETag: W/"b-RiuDmWuTiJQ+XuV6F6PhreGRiB0"
Date: Tue, 16 Nov 2021 17:48:11 GMT
Connection: close

create user // Parámetro de nuestra función users
```

Si nos fijamos, **nos devuelve la string que pusimos como parámetro en la ruta de users.js,** lo cual significa que funciona correctamente.

## Definición de endpoints (API)

### Creación de usuarios

**Los endpoints son rutas que responden a una petición** y que normalmente devuelven JSONs.

Ahora que tenemos el modelo de datos y nuestro directorio de rutas creado, **es momento de ir a nuestra ruta de creación de users (ubicada en _routes/user.js_ ) y añadirle el código necesario para que cree un usuario:**

```js
const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");

// Crear un nuevo usuario
router.post("/users", (req, res) => {
  const user = userSchema(req.body); // Creamos el schema, que tendrá como input el cuerpo de la request que hace el cliente a la api
  user
    .save() // Lo intentamos guardar en la base de datos con .save()
    .then((data) => res.json(data)) // Si se guarda de manera satisfactoria, entonces devuelve los datos en formato json
    .catch((error) => res.json({ message: error })); // Si sale mal, nos devuelve un json con el mensaje de error
});

module.exports = router;
```

Sin embargo, nuestro servidor **no entiende los parámetros en JSON por defecto**, si hacemos una request ahora mismo esta fallará.

Para que esto no suceda y podamos trabajar con JSONs, **nos dirigimos al apartado de middleware de index.js y agregamos la siguiente línea:**

```js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user");

const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json()); // Middleware de express para trabajar con JSONs
app.use("/api", userRoutes);

// routes

app.get("/", (req, res) => {
  res.send("Welcome to my Web App");
});

// Mongoose

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.error(error));
app.listen(port, () => console.log("server listening on port", port));
```

Es importante que vaya **antes de llamar a las rutas**, ya que **primero tiene que interpretar el JSON** antes de ejecutar ninguno de los endpoitns de la api.

Una vez tenemos agregado el código, sólo nos queda realizar la prueba de fuego para comprobar que funciona correctamente, **usar el REST Client y ver qué nos devuelve.** Para esto **volveremos a utilizar la extensión REST Client,** modificando el archivo **requests.http**

```http
POST http://localhost:9000/api/users HTTP/1.1
Content-Type: application/json

{
    "name": "Amancio",
    "surname": "Ortiga",
    "phone": "666666666",
    "email": "amanciortiga@indietext.com"

}
```

Es importante que al hacer la request, **el input JSON tenga todos los campos requeridos** en el modelo de datos que realizamos previamente. Si **name** es **required** y lo **omitimos**, nos **dará un error**.

Si todo sale bien aparecerá en pantalla un mensaje como el siguiente.

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 133
ETag: W/"85-Psdg50xEB708uR0rd8wOFXgW3wA"
Date: Wed, 24 Nov 2021 09:18:11 GMT
Connection: close

{
  "name": "Amancio",
  "surname": "Ortiga",
  "phone": 666666666,
  "email": "amanciortiga@indietext.com",
  "_id": "619e03532c7c3039b4455eac",
  "__v": 0
}
```

Pero, **¿se habrá creado realmente el objeto en la base de datos?** Para comprobarlo vamos a dirigirnos a MongoDB Atlas, y en nuestro cluster clicaremos en **"Browse Collections"**

![clustermongo](/mdassets/untitled4.png)

Y como podremos comprobar, **efectivamente se ha creado un nuevo registro en la base de datos:**![registromongo](/mdassets/untitled5.png)

Ahora que hemos definido nuestra ruta y su función para crear nuevos usuarios (contactos en este caso), **debemos definir los endpoints restantes**, como borrar, actualizar u obtener los contactos.

### Devolver todos los contactos

Este endpoint es muy similar al anterior, **apenas tendremos que cambiar un par de cosas** en el código:

```js
// Devolver todos los contactos

router.get("/users", (req, res) => {
  // En vez de el método post usamos get para pedir información a la base de datos
  userSchema // En vez de pedir el contenido del modelo de datos, sencillamente indicamos que estaremos usando el esquema en sí, no sus valores
    .find() // Finalmente con el método find indicamos que busque todos los registros que coincidan con el esquema de el modelo de datos userSchema
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
```

Probamos el endpoint y **hacemos una request**

```http
GET http://localhost:9000/api/users HTTP/1.1
```

Deberíamos de obtener el siguiente **mensaje con una lista de todos los elementos.** He añadido unos cuantos más para que el ejemplo sea algo más práctico:

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 513
ETag: W/"201-AjaUwabkhnw0ABVaYrLPO4o258Q"
Date: Wed, 24 Nov 2021 10:04:41 GMT
Connection: close

[
  {
    "_id": "619dfcd3c2f843afc0d4ecb6",
    "name": "Amancio",
    "surname": "Ortiga",
    "phone": 666666666,
    "email": "amanciortiga@indietext.com",
    "__v": 0
  },
  {
    "_id": "619e0cc7ec9d7bce4e1440c6",
    "name": "Uxia",
    "surname": "Camposanto",
    "phone": 987458512,
    "email": "uxia@inventing.com",
    "__v": 0
  },
  {
    "_id": "619e0e14ec9d7bce4e1440c9",
    "name": "Iago",
    "surname": "Rioxán",
    "phone": 698745821,
    "email": "iago@inventing.com",
    "__v": 0
  },
  {
    "_id": "619e0e38ec9d7bce4e1440cb",
    "name": "Xabier",
    "surname": "Breixo",
    "phone": 662146921,
    "email": "xabier@inventing.com",
    "__v": 0
  }
]

```

### Devolver un contacto en concreto

Ahora **vamos a definir el endpoint para obtener un contacto** en concreto. El cuerpo del endpoint sigue siendo muy similar a los dos anteriores, lo que tenemos que hacer ahora es **obtener el id del contacto para posteriormente buscarlo con el método findById**

```js
// Devolver un sólo contacto

router.get("/users/:id", (req, res) => {
  // Modificamos la ruta para que concatene el id con /users/
  const { id } = req.params; // Asignamos una constante { id } que obtendremos de los parámetros de la request
  userSchema
    .findById(id) // Usamos findById para buscar el contacto en cuestión
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
```

Probamos el endpoint y hacemos una request, **usando el id del contacto en la ruta**

```http
GET http://localhost:9000/api/users/619dfcd3c2f843afc0d4ecb6 HTTP/1.1
```

Deberíamos de obtener **el contacto asociado al ID**

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 133
ETag: W/"85-vxtppOSsFyfNEbSzJ6O1ZCXE9ho"
Date: Wed, 24 Nov 2021 10:15:13 GMT
Connection: close

{
  "_id": "619dfcd3c2f843afc0d4ecb6",
  "name": "Amancio",
  "surname": "Ortiga",
  "phone": 666666666,
  "email": "amanciortiga@indietext.com",
  "__v": 0
}
```

### Modificar un contacto

Vamos a crear el **endpoint que nos permitirá modificar los contactos.**

```js
// Actualizar contacto

router.put("/users/:id", (req, res) => {
  // Usamos PUT para actualizar
  const { id } = req.params;
  const { name, surname, phone, email } = req.body; // Definimos una constante que contenga todos los datos de nuestros contactos
  userSchema
    .updateOne({ _id: id }, { $set: { name, surname, phone, email } }) // Actualizamos con updateOne
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
```

Con el método updateOne, **conseguimos modificar los registros de nuestra base de datos**.

Primeramente **nos pide el id como parámetro,** el cual obtenemos del propio registro y lo asignamos a la constante. **Como segundo parámetro, usamos un objeto con el parámetro $set,** que es el que actualizará todos los datos.

**Vamos a probar el endpoint** cambiando el número de teléfono de nuestro querido Amancio Ortiga:

```http
PUT http://localhost:9000/api/users/619dfcd3c2f843afc0d4ecb6 HTTP/1.1
Content-Type: application/json

{
    "name": "Amancio",
    "surname": "Ortiga",
    "phone": "685471236",
    "email": "amanciortiga@indietext.com"

}

```

Nos devolverá un mensaje conforme todo ha salido correctamente, y si volvemos a buscar a Amancio Ortiga en la base de datos, **su número de teléfono se habrá actualizado a "685471236"**

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 133
ETag: W/"85-ROmV9l/pbttKqv00MQgONJIdEgc"
Date: Wed, 24 Nov 2021 10:39:25 GMT
Connection: close

{
  "_id": "619dfcd3c2f843afc0d4ecb6",
  "name": "Amancio",
  "surname": "Ortiga",
  "phone": 685471236,
  "email": "amanciortiga@indietext.com",
  "__v": 0
}
```

### Borrar contactos

Por último **definimos el endpoint para borrar contactos de nuestra agenda**, es el más sencillo de todos ya que solo le tenemos que pasar el Id correspondiente para que borre el contacto asociado a él.

```js
// Boorar contacto

router.delete("/users/:id", (req, res) => {
  // Usamos el método http delete
  const { id } = req.params;
  userSchema
    .remove({ _id: id }) // Con .remove borramos el contacto asociado al id
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
```

Probamos el endpoint, borrando a Amancio Ortiga (ya que no tiene mucho sentido que Amancio aparezca en su propia agenda)

```http
DELETE http://localhost:9000/api/users/619dfcd3c2f843afc0d4ecb6 HTTP/1.1
```

Nos debe de devolver el parámetro _delete count: 1_

Si obtenemos la lista de los contactos de nuevo, **veremos que Amancio ya no está entre ellos**

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 379
ETag: W/"17b-g0g+TH9YnsEsQbabA96HRLy86nc"
Date: Wed, 24 Nov 2021 11:11:23 GMT
Connection: close

[
  {
    "_id": "619e0cc7ec9d7bce4e1440c6",
    "name": "Uxia",
    "surname": "Camposanto",
    "phone": 987458512,
    "email": "uxia@inventing.com",
    "__v": 0
  },
  {
    "_id": "619e0e14ec9d7bce4e1440c9",
    "name": "Iago",
    "surname": "Rioxán",
    "phone": 698745821,
    "email": "iago@inventing.com",
    "__v": 0
  },
  {
    "_id": "619e0e38ec9d7bce4e1440cb",
    "name": "Xabier",
    "surname": "Breixo",
    "phone": 662146921,
    "email": "xabier@inventing.com",
    "__v": 0
  }
]
```

## Estructura de la Página Web

### Requisitos Previos

#### Conexión a MongoDB

Una vez tenemos la API creada y funcionando, **podemos proseguir con la estructura de la página.**

Necesitaremos **definir rutas y endpoints** igual que hicimos en la API, de esta manera, **tendremos endpoints distintos para la web en sí, y la API.**

Antes de continuar **instalaremos dos paquetes** que nos van a hacer falta: methodOverride y ejs

```js
npm install ejs
```

```js
 npm install method-override
```

Nos dirigimos a **index.js** en el directorio raíz, y nos conectaremos al cliente de MongoDB, **para poder definir una constante que contenga nuestra base de datos y nuestra [colección](https://www.mongodb.com/es/basics/create-database#:~:text=Las%20colecciones%20en%20MongoDB%20son,a%20ellas%20en%20un%20comando.).**

Antes de realizar la conexión, **será necesario requerir mongodb y asignarlo a una constante.** De paso, **requeriremos un par de módulos más que necesitaremos más adelante**, el apartado inicial de index.js tiene que verse tal que así:

```js
const express = require("express");
const mongoose = require("mongoose"); // Framework de mongo
const MongoClient = require("mongodb").MongoClient; // Cliente de MongoDB
const bodyParser = require("body-parser"); // bodyParser traduce las requests http a json
const path = require("path"); // Sirve para acortar rutas
require("dotenv").config();
const userRoutes = require("./routes/user");
const methodOverride = require("method-override"); // Nos permite agregar más métodos a los formularios HTML
const app = express();
const port = process.env.PORT || 9000;
```

Una vez tenemos todo lo que necesitamos, **nos conectamos al cliente de MongoDB y asignamos las constantes**

```js
MongoClient.connect(process.env.MONGODB_URI).then((client) => {
  const db = client.db("myFirstDatabase"); // Asignamos la base de datos a una constante
  const usersCollection = db.collection("users"); // Asignamos la colección users a una constante
});
```

**Dentro de esta conexión** que acabamos de hacer, **definiremos todas los endpoints de la web app**, ya que **necesitaremos estar accediendo todo el rato** a la colección para modificar, añadir y eliminar datos.

#### Views , Template Engines y Middleware

Para tratar toda la información que entra y sale del servidor y de la base de datos, **necesitamos lo que comúnmente se llama "Template Engine"**. Este _middleware_ **genera plantillas dinámicas que nos permiten usar los datos del servidor en tiempo real**, nosotros estaremos utilizando **[ejs](https://ejs.co/). **No nos olvidemos de instalar también methodOverride.

Después de instalarlo, **lo requerimos en el apartado de middleware**, indicando también la ruta de nustras views (archivos .ejs que contendrán el código HTML). A demás, **aprovecharemos para agregar el resto de middleware** que habíamos requerido antes (**methodOverride, bodyParser...**). Tiene que quedar tal que así:

```js
// middleware

app.set("view engine", "ejs"); // Usamos ejs como motor de plantillas
app.set("views", "./views"); // Definimos ./views como directorio para nuestras views
app.use("/public", express.static("public")); // Definimos el directorio public para guardar estilos o scripts para las views (css/js)
app.use(express.json());
app.use("/api", userRoutes);
app.use(bodyParser.urlencoded({ extended: true })); // Usamos el bodyParser para tratar las request https y jsons
app.use(express.json());
app.use(methodOverride("_method")); // Finalmente usamos methodOverride para usar métodos como put en formularios HTML (por defecto solo admite GET y POST)
```

Como os habréis dado cuenta**, hemos definido dos directorios que no hemos creado aún, _public y views_**. Los creamos en la raíz del proyecto.

**Dentro de public irán los estilos css y js** que podamos necesitar para confeccionar la web, y **dentro de views, estarán las vistas HTML** (extensión ejs) que renderizará el servidor. Parece complicado, pero en realidad es más sencillo de lo que parece.

**Vamos a crear las páginas .ejs** que veremos en nuestro navegador, para ello **nos dirigimos a la carpeta de views y creamos el archivo index.ejs**.

Esta página **contiene un formulario para añadir contactos** y la **lista** de los mismos.

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ContactsApp</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
      integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" href="/public/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,700"
      rel="stylesheet"
    />
  </head>

  <body>
    <h1 class="display-3 text-center">ContactsApp</h2>
    <div class="container-fluid">
      <form action="/users" method="POST">
        <input class="form-control mb-2" type="text" required placeholder="Nombre" name="name" />
        <input class="form-control mb-2" type="text" required placeholder="Apellidos" name="surname" />
        <input
          class="form-control mb-2"
          type="tel"
          pattern="[0-9]{9}"
          required
          placeholder="Teléfono"
          name="phone"
        />
        <input class="form-control mb-2" type="email" placeholder="mail@dominio.com" name="email" />

        <button class="btn btn-info btn-block" type="submit">Añadir Contacto</button>
      </form>



    <div class="container-fluid">

    <% for(var i = 0; i < users.length; i++) {%>
      <div class="row">
      <div class="card mb-2 col-12">
        <div class="card-body text-center">
          <div class="name mb-2 font-weight-bold"><%= users[i].name %></div>
          <div class="surname mb-2 font-weight-bold"><%= users[i].surname %></div>
          <div class="phone mb-2"><%= users[i].phone %></div>
          <div class="email mb-2"><%= users[i].email %></div>
          <form action="/edit" method="post">
            <button class= "btn btn-info" type="submit" value="<%= users[i]._id %>" name="id">
              Editar
            </button>
          </form>
          <form action="/delete" method="POST">
            <button class="btn btn-danger" type="submit" value="<%= users[i]._id %>" name="id">
              Borrar
            </button>
          </form>
        </div>
      </div>
    </div>
    <% } %>
  </div>
  </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

```

Si usas mi código, **verás que tiene estilos aplicados usando Bootstrap**, necesitarás también hacer un nuevo **archivo css llamado styles.css** en la carpeta public con el siguiente código:

```css
body {
  background-color: #f8f9fa;
  font-family: "Nunito", sans-serif;
}

h1 {
  color: black;
  font-weight: lighter;
}

.card {
  background-color: #f7ede2a9;
  font-size: larger;
}
```

Necesitaremos también, **una página que se muestre cuando queramos editar un contacto**. Crearemos el archivo **edit.ejs** en la carpeta Views.

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css"
      integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" href="/public/styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,700"
      rel="stylesheet"
    />
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Editar Contacto</title>
  </head>
  <body>
    <h1 class="display-3 text-center pb-2">
      <%= users.name + " " + users.surname %>
    </h1>
    <form class="form" action="/edit?_method=PUT" method="post">
      <div class="container-fluid">
      <div class="form-row">
        <div class="col">
          <input
            type="text"
            placeholder="Nombre"
            value="<%= users.name %>"
            name="name"
            required
            class="form-control mb-2"
          />
        </div>
        <div class="col">
          <input
            type="text"
            placeholder="Apellidos"
            value="<%= users.surname %>"
            name="surname"
            required
            class="form-control mb-2"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col">
          <input
            type="tel"
            pattern="[0-9]{9}"
            placeholder="Teléfono"
            name="phone"
            value="<%= users.phone %>"
            required
            class="form-control"
          />
        </div>
        <div class="col">
          <input
            type="email"
            placeholder="e-mail"
            value="<%= users.email %>"
            name="email"
            class="form-control"
          />
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-info btn-block mt-2"
        value="<%= users._id %>"
        name="id"
      >
        Modificar
      </button>

    <form action="/" method="get">
      <button type="submit" class="btn btn-secondary btn-block mt-2">Volver</button>
    </form>
    </form>
    </div>
    </form>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

```

Si te fijas, verás el código ejs, que **se utiliza para renderizar la información que recibe del servidor directamente en formato HTML.** A demás, este motor en concreto tiene una sintáxis similar a JavaScript, con lo que es muy sencillo de usar.

### Endpoints de la App Web ¿Cómo funcionan?

Ahora que tenemos las páginas para mostrar según la petición, **podemos hacer los endpoints.** Si os fijáis en los formularios de las páginas ejs, veréis que **utilizan diversos métodos como PUT, GET y POST.**

Estos métodos **los disparan botones de tipo submit**, haciendo una **http request** a nuestro servidor. Cuando esto ocurre, los endpoints se encargan de recibir la petición y enviar una respuesta.

#### Obtener la lista de Contactos

Primero obtendremos la lista de usuarios, este código es muy similar al que escribimos en nuestra API anteriormente.

```js
MongoClient.connect(process.env.MONGODB_URI).then((client) => {
  const db = client.db("myFirstDatabase");
  const usersCollection = db.collection("users");
  app.get("/", (req, res) => {
    // Cuando entramos a la raíz de la web, dame la información de todos los usuarios
    db.collection("users") // En mi colección usuarios
      .find() // Busca todos los registros
      .toArray() // Conviértelos en una lista (para poder iterarlos en la vista ejs)
      .then((results) => {
        res.render("index", { users: results }); // Devuelveme los resultados y renderiza la vista index.js (que tendrá acceso a todas y cada una de las propiedades de los registros)
      })
      .catch((error) => console.error(error));
  });
});
```

Si se ha hecho bien, tendríamos que ver ya la lista de los usuarios que hay en la base de datos al entrar a nuestra página web, tal que así:

![vistainicial](/mdassets/vistainicial.png)

#### Crear un Contacto

Seguimos creando los endpoints, en este caso **crear un contacto.**

```js
// CREAR CONTACTOS
app.post("/users", (req, res) => {
  usersCollection
    .insertOne(req.body) // Insertamos un registro en la colección usuarios
    .then((result) => {
      res.redirect("/"); // Cuando se agregue el registro redireccionamos al inicio de la página de nuevo
    })
    .catch((error) => console.error(error));
});
```

Los datos que coge para crear el usuario **vienen del formulario de nuestra página web principal.**

```ejs
<form action="/users" method="POST">
        <input class="form-control mb-2" type="text" required placeholder="Nombre" name="name" />
        <input class="form-control mb-2" type="text" required placeholder="Apellidos" name="surname" />
        <input
          class="form-control mb-2"
          type="tel"
          pattern="[0-9]{9}"
          required
          placeholder="Teléfono"
          name="phone"
        />
        <input class="form-control mb-2" type="email" placeholder="mail@dominio.com" name="email" />

        <button class="btn btn-info btn-block" type="submit">Añadir Contacto</button>
      </form>
```

#### Borrar un contacto

Seguimos con el endpoint de borrar, que en este caso lo disparamos con un post, pero podríamos dispararlo sin problema con un delete también.

```js
app.post("/delete", (req, res) => {
  usersCollection
    .deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) }) // Recogemos el ID del registro (que viene del formulario) y lo transformamos a tipo ObjectId
    .then((result) => {
      res.redirect("/"); // Cuando lo borremos, redirigimos de nuevo a la página principal para ver los cambios
    })
    .catch((error) => console.error(error));
});
```

La línea que acompaña entre paréntesis a _deleteOne_, nos sirve para **transformar el tipo de dato del Id que recogemos de la petición.** Esto se debe a que **MongoDB utiliza el tipo de dato ObjectId para los IDs de sus registros,** y si no lo transformásemos de esta manera **sería imposible identificar correctamente el registro** para su posterior eliminación.

#### Obtener la página Edit

Para editar un contacto **necesitamos primero acceder al formulario** que nos permita introducir los datos que queremos editar. Es por esto que hicimos un segundo archivo ejs.

Debido a esto, **requerimos de dos endpoints**, uno para acceder a la página y otro que envíe los datos. Primero definiremos el de la página:

```js
app.post("/edit", (req, res) => {
  usersCollection
    .findOne({ _id: mongoose.Types.ObjectId(req.body.id) }) // Buscamos por Id el registro en la base de datos
    .then((results) => {
      res.render("edit", { users: results }); // Renderizamos edit.js junto con los datos del registro
    })
    .catch((error) => console.error(error));
});
```

Si lo hemos hecho todo bien, tendríamos que ver lo siguiente al presionar el botón de editar en un contacto:

![vistaedit](/mdassets/vistaedit.png)

Sin embargo, por mucho que le demos a modificar, **no va a suceder nada**, ya que este botón **envía una request a un endpoint que todavía no hemos definido.**

#### Editar un Contacto

Finalmente definimos el endpoint que edita el contacto

```js
app.put("/edit", (req, res) => {
  usersCollection
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body.id) }, // Buscamos por Id y actualizamos
      {
        $set: {
          name: req.body.name, // Reescribimos todos los campos necesarios
          surname: req.body.surname,
          phone: req.body.phone,
          email: req.body.email,
        },
      },
      { new: true, omitUndefined: true }
    )
    .then((result) => {
      // Si todo sale bien, redirigimos al usuario a la página principal
      res.redirect("/");
    })
    .catch((error) => console.error(error))
    .catch((error) => console.error(error));
});
```

Una vez más, estos datos vienen de un formulario, en este caso ubicado en edit.js

```ejs
<form class="form" action="/edit?_method=PUT" method="post">
      <div class="container-fluid">
      <div class="form-row">
        <div class="col">
          <input
            type="text"
            placeholder="Nombre"
            value="<%= users.name %>"
            name="name"
            required
            class="form-control mb-2"
          />
        </div>
        <div class="col">
          <input
            type="text"
            placeholder="Apellidos"
            value="<%= users.surname %>"
            name="surname"
            required
            class="form-control mb-2"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col">
          <input
            type="tel"
            pattern="[0-9]{9}"
            placeholder="Teléfono"
            name="phone"
            value="<%= users.phone %>"
            required
            class="form-control"
          />
        </div>
        <div class="col">
          <input
            type="email"
            placeholder="e-mail"
            value="<%= users.email %>"
            name="email"
            class="form-control"
          />
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-info btn-block mt-2"
        value="<%= users._id %>"
        name="id"
      >
        Modificar
      </button>

    <form action="/" method="get">
      <button type="submit" class="btn btn-secondary btn-block mt-2">Volver</button>
    </form>
    </form>
    </div>
    </form>
```

Si nos fijamos, vemos dos botones, **el de submit**, que **dispara la petición PUT** usando methodOverride y **el de volver**, que nos **devuelve a la página principal**.

## Página Web Completada

Listo, si todo ha ido como debe**, tenemos la página web totalmente funcional,** con su propia API, base de datos no relacional, servidor y endpoints, que nos permite tener a nuestros contactos organizados de la mejor manera.

Ha sido un largo camino, pero ha valido la pena. Amancio Ortiga está más que contento con la web, y contará con el equipo de Inventing Consulting para sus necesidades tecnológicas de aquí en adelante.
