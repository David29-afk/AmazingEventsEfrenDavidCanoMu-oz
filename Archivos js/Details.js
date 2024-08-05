const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');
console.log(eventId);

// URL de los eventos
const dataeventsUrl = `https://aulamindhub.github.io/amazing-api/events.json`;

fetch(dataeventsUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verifica la estructura aquí
        
        // Acceder a la propiedad `events` que contiene el array de eventos
        const eventos = data.events;

        // Buscar el evento que coincide con el ID
        const evento = eventos.find(e => e._id === parseInt(eventId, 10)); // Convertir eventId a entero

        if (!evento) {
            console.error('Evento no encontrado.');
            return;
        }

        // Mostrar los detalles del evento
        const detallesContainer = document.getElementById('event-details');
        detallesContainer.innerHTML = `
            <div class="card border-light shadow-sm">
                <img src="${evento.image || './images/default-image.png'}" class="card-img-top" alt="${evento.name}" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${evento.name || 'Nombre no disponible'}</h6>
                    <p class="card-text">${evento.description || 'Descripción no disponible'}</p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Fecha:</strong> ${evento.date || 'No disponible'}</li>
                        <li class="list-group-item"><strong>Lugar:</strong> ${evento.place || 'No disponible'}</li>
                        <li class="list-group-item"><strong>Capacidad:</strong> ${evento.capacity + ' personas' || 'No disponible'}</li>
                        <li class="list-group-item"><strong>Precio:</strong> $${evento.price || 'No disponible'}</li>
                    </ul>
                </div>
            </div>
        `;
    })
    .catch(error => console.error('Error fetching data:', error));
