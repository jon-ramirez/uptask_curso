import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        // este proyectoUrl, en el parámetro HTML es data-proyecto-url. Elimina el data y hace camelCase de proyecto-url
        const urlProyecto = e.target.dataset.proyectoUrl;

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
            // enviar petición para borrar
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            if(result.isConfirmed) {
                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta) {
                        console.log(respuesta);
                        if(result.value) {
                            Swal.fire(
                                'Borrado!',
                                respuesta.data,
                                'success'
                            )
            
                            // redireccionar al inicio
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 3000);
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar un proyecto'
                        })
                    }
                )
            }

        })
    })
}

export default btnEliminar;