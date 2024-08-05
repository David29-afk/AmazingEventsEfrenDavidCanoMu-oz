const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

let eventos = []; // Variable global para almacenar eventos

function cargarDatosEventos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            eventos = data.events; // Obtener los eventos del JSON y almacenarlos en la variable global
            pintarTargetas(eventos); // Pintar las tarjetas con todos los eventos
            pintarCheckbox(eventos); // Pintar los checkboxes de las categorías
        })
        .catch(error => console.error('Error fetching data:', error)); // Manejar errores
}

// Llamar a la función para cargar los datos
cargarDatosEventos();

function pintarTargetas(eventos) {
    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = ''; // Limpiar contenido anterior

    if (eventos.length === 0) {
        mostrarMensajeSinResultados();
        return;
    }

    eventos.forEach(evento => {
        let targeta = document.createElement('div');
        targeta.className = "etiqueta1 card-group mb-4 col-lg-3 col-md-6";
        targeta.innerHTML = `
            <div class="card">
                <img class="targetImg" src="${evento.image}" alt="...">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title nombre">${evento.name}</h5>
                    <p class="card-text flex-grow-1 descripcion">${evento.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Price: $${evento.price.toFixed(2)}</span>
                        <a href="./Details.html?id=${evento._id}" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>`;
        contenedor.appendChild(targeta);
    });
}

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

            checkboxDiv.querySelector('input').addEventListener('change', actualizarVista);

            containercheck.appendChild(checkboxDiv);
        }
    });
}

function mostrarMensajeSinResultados() {
    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = '<p class="text-muted">No se encontraron eventos que coincidan con la búsqueda.</p>';
}

let filtrobuscar = document.getElementById('buscador');

filtrobuscar.addEventListener('keyup', actualizarVista);

function actualizarVista() {
    let textoBusqueda = filtrobuscar.value.trim().toLowerCase();
    
    // Obtener categorías seleccionadas
    let categoriasSeleccionadas = Array.from(document.querySelectorAll('#contenedorcheck input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    // Filtrar eventos basado en categorías seleccionadas y texto de búsqueda
    let eventosFiltrados = eventos.filter(evento => {
        // Verificar si el evento coincide con las categorías seleccionadas (o si no hay categorías seleccionadas)
        let coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(evento.category);
        // Verificar si el evento coincide con el texto de búsqueda
        let coincideBusqueda = evento.name.toLowerCase().includes(textoBusqueda) || evento.description.toLowerCase().includes(textoBusqueda);
        return coincideCategoria && coincideBusqueda;
    });

    // Actualizar la vista con los eventos filtrados
    if (eventosFiltrados.length > 0) {
        pintarTargetas(eventosFiltrados);
    } else {
        mostrarMensajeSinResultados();
    }
}
