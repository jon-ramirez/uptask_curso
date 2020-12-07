const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) =>  {
    // obtenemos el proyecto
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    // const {tarea} = req.body;
    const tarea = req.body.tarea;
    const estado = 0;
    const proyectoId = proyecto.id;

    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado) {
        next();
    }

    res.redirect(`/proyectos/${req.params.url}`); 
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const id = req.params.id;
    
    const tarea = await Tareas.findOne({where: {id: id}});

    // tirando a pr0, pero bueno, lo vamos a aceptar...
    let estado = 0;
    if(tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if(resultado<=0) {
        res.status(500).send('ha habido un error al actualizar el estado');
    }
    res.status(200).send('estado actualizado');
}

exports.eliminarTarea = async (req, res) => {

    const id = req.params.id;

    // Eliminar tarea
    const resultado = await Tareas.destroy({where: {id: id}});

    if(resultado <=0) {
        res.status(500).send("ha habido un error al borrar la tarea");
    }
    res.status(200).send('tarea eliminada correctamente');
}