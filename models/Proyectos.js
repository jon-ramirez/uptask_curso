const Sequelize = require("sequelize");
const slug = require("slug");
const shortid = require("shortid");

const db = require('../config/db');

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

    }, 
    nombre: Sequelize.STRING(60),
    url: Sequelize.STRING
}, {
    hooks: {
        beforeCreate(proyecto) {
            console.log("antes de insertar en base de datos");
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

// esta instrucción es para que esto sea accesible desde el resto del código
module.exports = Proyectos;