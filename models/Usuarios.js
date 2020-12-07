const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcryptjs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un email válido'
            },
            notEmpty: {
                msg: 'Debe introducir un email'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        } 
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Debe introducir un password'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: {
        type: Sequelize.STRING
    },
    expiracion: {
        type: Sequelize.DATE
    }
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;