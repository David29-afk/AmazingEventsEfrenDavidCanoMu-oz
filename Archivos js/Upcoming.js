const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

let currentDate; // Variable para almacenar la fecha actual

function cargarDatosEventos() {
    fetch(apiUrl)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            currentDate = data.currentDate; // Guardar la fecha actual
            const eventos = data.events; // Obtener los eventos del JSON
            pintarTargetas(eventos); // Llamar a la función para pintar las tarjetas
            pintarCheckbox(eventos);
        })
        .catch(error => console.error('Error fetching data:', error)); // Manejar errores
}

// Llamar a la función para cargar los datos
cargarDatosEventos();

function pintarTargetas(eventos, filtroTexto = '') {

    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = ''; // Limpiar contenido anterior

    eventos.forEach(evento => {

        // Verificar si el evento es futuro y cumple con el filtro de texto
        if (currentDate <= evento.date && 
            (evento.name.toLowerCase().includes(filtroTexto.toLowerCase()) || 
             evento.description.toLowerCase().includes(filtroTexto.toLowerCase()))) {

            let targeta = document.createElement('div');
            targeta.className = "etiqueta1 card-group mb-4 col-lg-3 col-md-6";
            targeta.innerHTML = `<div class="card">
                                <img class="targetImg" src="${evento.image}" alt="...">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title nombre">${evento.name}</h5>
                                    <p class="card-text flex-grow-1 descripcion">${evento.description}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>Price: ${evento.price}</span>
                                        <a href="./Details.html?id=${evento._id}" class="btn btn-primary">Details</a>
                                    </div>
                                </div>
                            </div>`;

            contenedor.appendChild(targeta);
        }
    });
}


// pintarCheckbox(eventos);
// pintarTargetas(eventos)


function pintarCheckbox(eventos) {
    let categorias = [];
    let containercheck = document.getElementById("contenedorcheck");

    eventos.forEach(evento => {
        if (!categorias.includes(evento.category)) {
            categorias.push(evento.category);


            let checkboxDiv = document.createElement('div');
            checkboxDiv.className = "form-check form-check-inline";

            checkboxDiv.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${evento.category}" id="checkbox-${evento.category}">
                <label class="form-check-label" for="checkbox-${evento.category}">
                    ${evento.category}
                </label>
            `;

            checkboxDiv.querySelector('input').addEventListener('change', () => {

                let categoriasSeleccionadas = categorias.filter(cat => {
                    return document.getElementById(`checkbox-${cat}`).checked;
                });



                let eventosFiltrados = eventos.filter(evento => {
                    return categoriasSeleccionadas.includes(evento.category);
                });

                if (categoriasSeleccionadas.length === 0) {
                    eventosFiltrados = eventos;
                }

                let textoBusqueda = filtrobuscar.value.trim();
                pintarTargetas(eventosFiltrados, textoBusqueda);



            });



            containercheck.appendChild(checkboxDiv);
        }
    });

}

function mostrarMensajeSinResultados() {
    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = '<p class="text-muted">No se encontraron eventos que coincidan con la búsqueda.</p>';
}


let filtrobuscar = document.getElementById('buscador');

filtrobuscar.addEventListener('keyup', (e) => {
    let textoBusqueda = e.target.value.trim();
    console.log(textoBusqueda);
    actualizarVista(eventos, textoBusqueda);

});



function actualizarVista(eventos, textoBusqueda) {

    let eventosFiltrados = eventos.filter(evento => {
        return evento.name.toLowerCase().includes(textoBusqueda.toLowerCase()) || evento.description.toLowerCase().includes(textoBusqueda.toLowerCase());
    });

    if (eventosFiltrados.length > 0) {
        pintarTargetas(eventosFiltrados);
    } else {
        mostrarMensajeSinResultados();
    }
}