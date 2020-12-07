const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require('crypto');
const Sequelize = require("sequelize");
const bcrypt = require('bcryptjs');
const enviarEmail = require('../handlers/email');

const Op = Sequelize.Op

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Función para comprobar si el usuario está logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    
    // si el usuario está autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }

    // si no está autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Función para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesión, se redirige a la pantalla principal
    });
}

// enviar token si el usuario es válido
exports.enviarToken = async (req, res) =>  {
    // verificar que el usuario existe
    const usuario = await Usuarios.findOne({where: {email: req.body.email }});

    // el usuario no existe
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // el usuario existe
    usuario.token = bcrypt.genSaltSync(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // guardamos el token y la expiración en base de datos
    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'Te hemos enviado un correo con las instrucciones para reestablecer la password');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) =>  {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // el usuario no existe, el token no existe
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // el usuario es válido
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // el usuario no existe, el token no existe o ha expirado
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // hashear en nuevo password
    usuario.token = null;
    usuario.expiracion = null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    await usuario.save();

    req.flash('correcto', 'tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}