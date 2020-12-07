const express = require("express");
const router = express.Router();

// importar express-validator
const { body } = require("express-validator");

const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = function() {

    router.get("/", authController.usuarioAutenticado, proyectosController.proyectosHome);
    router.get("/nuevo-proyecto", authController.usuarioAutenticado, proyectosController.formularioProyecto);
    router.post("/nuevo-proyecto", 
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar proyectos
    router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);

    // Actualizar proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
    router.post("/nuevo-proyecto/:id", 
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // eliminar proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);

    // Tareas
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);

    // Actualizar tarea
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    // Actualizar tarea
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

    // Crear cuenta
    router.get('/crear-cuenta', usuariosController.formularioCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formularioIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Cerrar sesión
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formResetPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);
    
    return router;
}; 