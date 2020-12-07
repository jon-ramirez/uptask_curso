const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");
//const Slug = require("slug");
//const slug = require("slug");

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    res.render('index', {
        nombrePagina: "Proyectos",
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    // console.log(req.body);

    // esta linea sería equivalente a const nombre = req.body.nombre;
    const {nombre} = req.body;

    let errores = [];

    if(!nombre) {
        errores.push({texto : 'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0) {
        res.render("nuevoProyecto", {
            nombrePagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    } else {
        // no hay errores
        // insertar en BD
        // Proyectos.create({nombre})
        //     .then(() => console.log("insertado correctamente"))
        //     .catch(error => console.log(error));
        
        // const url = slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect("/");
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({where: { usuarioId }});
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    })

    if(!proyecto) {
        return next();
    }

    res.render('tareas', {
        nombrePagina: 'Tareas del proyecto',
        proyectos,
        proyecto,
        tareas
    });
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto

    });
}

exports.actualizarProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});
    // console.log(req.body);

    // esta linea sería equivalente a const nombre = req.body.nombre;
    const {nombre} = req.body;

    let errores = [];

    if(!nombre) {
        errores.push({texto : 'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0) {
        res.render("nuevoProyecto", {
            nombrePagina: 'Nuevo Proyecto',
            proyectos,
            errores
        })
    } else {
        // no hay errores
        // insertar en BD
        // Proyectos.create({nombre})
        //     .then(() => console.log("insertado correctamente"))
        //     .catch(error => console.log(error));
        
        // const url = slug(nombre).toLowerCase();
        await Proyectos.update(
            { nombre: nombre },
            { where: { 
                id: req.params.id 
            } }
        );
        res.redirect("/");
    }
}

exports.eliminarProyecto = async (req, res, next) =>  {
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy( { where: {url: urlProyecto} });

    console.log(resultado);

    if(resultado<=0) {
        res.status(500).send('ha habido un error al borrar');
    }
    res.status(200).send('Proyecto eliminado correctamente');
}
