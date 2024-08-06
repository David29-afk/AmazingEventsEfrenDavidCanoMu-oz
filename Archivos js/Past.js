import { pintarTargetas, pintarCheckbox, mostrarMensajeSinResultados } from '../Modules/FunctionModules.js';

const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';
let currentDate; // Variable para almacenar la fecha actual
let eventos = []; // Array global para almacenar los eventos

function cargarDatosEventos() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            currentDate = data.currentDate; // Guardar la fecha actual
            eventos = data.events.filter(evento => currentDate > evento.date); // Filtrar solo eventos pasados
            pintarTargetas(eventos, '', currentDate); // Pintar las tarjetas con eventos pasados
            pintarCheckbox(eventos, (eventosFiltrados) => pintarTargetas(eventosFiltrados, filtrobuscar.value.trim(), currentDate)); // Pintar los checkboxes de las categorías
        })
        .catch(error => console.error('Error fetching data:', error)); // Manejar errores
}

// Llamar a la función para cargar los datos
cargarDatosEventos();

let filtrobuscar = document.getElementById('buscador');

filtrobuscar.addEventListener('keyup', () => {
    let textoBusqueda = filtrobuscar.value.trim();
    actualizarVista(textoBusqueda);
});

function actualizarVista(textoBusqueda) {
    let eventosFiltrados = eventos.filter(evento => {
        return (evento.name.toLowerCase().includes(textoBusqueda.toLowerCase()) || 
                evento.description.toLowerCase().includes(textoBusqueda.toLowerCase()));
    });

    if (eventosFiltrados.length > 0) {
        pintarTargetas(eventosFiltrados, textoBusqueda, currentDate); // Pasar textoBusqueda y currentDate
    } else {
        mostrarMensajeSinResultados();
    }
}

