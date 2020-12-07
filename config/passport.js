const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// referencia del modelo utilizado para autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propias (usuario - password)

passport.use(
    new LocalStrategy(
        {
            // por defecto, este objeto espera que los campos para validar se llamen username y password, sobreescribimos
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where:  {
                        email: email,
                        activo: 1
                    }
                });

                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'La clave es incorrecta'
                    });
                }

                // llegados a este punto, la validación es correcta. Devolvemos el usuario. Todo OK
                return done(null, usuario);
            } catch(error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }

        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;