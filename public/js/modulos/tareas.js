import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {

    tareas.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            // esto me parece chapuza a fecha de 23 de Noviembre, pero no voy a criticar el curso...
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, {idTarea})
                .then(function(respuesta) {
                    if(respuesta.status === 200) {
                        // este método lo que hace es alternar la clase completo. Si la tiene se la quita y si no la tiene se la pone...
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                }
            )
        } else if(e.target.classList.contains('fa-trash')) {
            // no es algo que me guste usar, pero para que quede constancia de este tipo de asignaciones de variables
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;


            Swal.fire({
                title: 'Está seguro?',
                text: 'No podrá deshacer esta opción',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: "#d33",
                confirmButtonText: 'Si, borralo',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                console.log(result);
                if(result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    axios.delete(url, {params: {idTarea}})
                        .then(function(respuesta) {
                            if(respuesta.status === 200) {
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();
                            }
                        }
                    );
                }
            });
        
        }

    });

}

export default tareas;