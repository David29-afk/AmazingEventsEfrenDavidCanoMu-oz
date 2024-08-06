import { pintarTargetas, pintarCheckbox, mostrarMensajeSinResultados } from '../Modules/FunctionModules.js';

const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';
let eventos = []; // Variable global para almacenar eventos

function cargarDatosEventos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            eventos = data.events; // Obtener los eventos del JSON y almacenarlos en la variable global
            pintarTargetas(eventos); // Pintar las tarjetas con todos los eventos
            pintarCheckbox(eventos, actualizarVista); // Pintar los checkboxes de las categorías
        })
        .catch(error => console.error('Error fetching data:', error)); // Manejar errores
}

// Llamar a la función para cargar los datos
cargarDatosEventos();

let filtrobuscar = document.getElementById('buscador');

function actualizarVista(eventosFiltrados) {
    let textoBusqueda = filtrobuscar.value.trim().toLowerCase();

    eventosFiltrados = eventosFiltrados.filter(evento => {
        return evento.name.toLowerCase().includes(textoBusqueda) || 
               evento.description.toLowerCase().includes(textoBusqueda);
    });

    if (eventosFiltrados.length > 0) {
        pintarTargetas(eventosFiltrados);
    } else {
        mostrarMensajeSinResultados();
    }
}

filtrobuscar.addEventListener('keyup', () => {
    let textoBusqueda = filtrobuscar.value.trim().toLowerCase();
    let eventosFiltrados = eventos.filter(evento => 
        evento.name.toLowerCase().includes(textoBusqueda) || 
        evento.description.toLowerCase().includes(textoBusqueda)
    );

    actualizarVista(eventosFiltrados);
});
