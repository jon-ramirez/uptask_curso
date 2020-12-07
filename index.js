// como el import de Java. en la variable express tengo el objeto de la librería express
const express = require("express");
const expressValidator = require("express-validator");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
require('dotenv').config({path: 'variables.env'});

// Crear la conexión de base de datos
const db = require('./config/db');

const helpers = require("./helpers");
const { nextTick } = require("process");

require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log("conectado a la base de datos"))
    .catch(error => console.log(error));

// crea el objeto de Express
const app = express();

// donde cargar los archivos estáticos
app.use(express.static('public'));

// habilitamos PUG, el template engine de esto
app.set("view engine", "pug");

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}));

// aquí deberia ir el express-validator...
// pero ahora el express-validator funciona de manera diferente, con lo que tendré que tirar de google para ver como funciona...

// Añadir la carpeta de las vistas
app.set("views", path.join(__dirname, "./views"));

app.use(flash());

app.use(cookieParser());

// Activar gestión de sesión
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

// la clave del usuario de mysql es root
// no lo tengo que arranque el servicio automáticamente, con lo que hay que ir a "servicios" y buscar "MySQL57" e iniciarlo
// el comando para gestionar la BBDD es mysql -u root -p

app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log("el servidor está funcionando");
});

