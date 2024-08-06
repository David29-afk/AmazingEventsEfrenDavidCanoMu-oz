
export function pintarTargetas(eventos, filtroTexto = '', currentDate) {
    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = ''; // Limpiar contenido anterior

    // Filtrar eventos en función de la fecha y el texto de búsqueda
    let eventosFiltrados = eventos.filter(evento => 
        (evento.name.toLowerCase().includes(filtroTexto.toLowerCase()) || 
         evento.description.toLowerCase().includes(filtroTexto.toLowerCase()))
    );

    if (eventosFiltrados.length === 0) {
        mostrarMensajeSinResultados();
        return;
    }

    eventosFiltrados.forEach(evento => {
        let tarjeta = document.createElement('div');
        tarjeta.className = "etiqueta1 card-group mb-4 col-lg-3 col-md-6";
        tarjeta.innerHTML = `
            <div class="card">
                <img class="targetImg" src="${evento.image}" alt="...">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title nombre">${evento.name}</h5>
                    <p class="card-text flex-grow-1 descripcion">${evento.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>Price: $${evento.price}</span>
                        <a href="./Details.html?id=${evento._id}" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>`;
        contenedor.appendChild(tarjeta);
    });
}

export function mostrarMensajeSinResultados() {
    let contenedor = document.getElementById("card1");
    contenedor.innerHTML = '<p class="text-muted">No se encontraron eventos que coincidan con la búsqueda.</p>';
}

export function pintarCheckbox(eventos, callback) {
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

                callback(eventosFiltrados);
            });

            containercheck.appendChild(checkboxDiv);
        }
    });
}
