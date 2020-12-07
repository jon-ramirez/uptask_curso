const Usuarios = require("../models/Usuarios");
const enviarEmail = require('../handlers/email');

exports.formularioCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    });
}

exports.formularioIniciarSesion = (req, res) => {
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesión en UpTask',
        error: res.locals.mensajes.error
    });
}

exports.crearCuenta = async (req, res) => {
    // leer los datos
    const email = req.body.email;
    const password = req.body.password;

    try {
        // crear el usuario
        // esto antes iba con un .then, pero al poner el await ya no es necesario
        await Usuarios.create({
            email,
            password
        });

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email: email
        };

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Usuario',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
    
        req.flash('correcto', 'Se ha enviado un correo electronico. Confirma tu cuenta');

        res.redirect('/iniciar-sesion');
        
    } catch(error) {
        console.log(error);
        
        // el .map se recorre todo el errors y dentro del parámetro recoge solo el message
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email: email,
            password: password
        })
    }
}

exports.formResetPassword = (req, res) =>  {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

// cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) =>  {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;

    console.log(usuario);
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}