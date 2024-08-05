const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

function fetchAndRenderStats() {
    fetch(apiUrl)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            const events = data.events; // Obtener los eventos del JSON
            const currentDate = new Date(data.currentDate);
            console.log('Current Date:', currentDate);
            console.log('All Events:', events); // Verifica si los eventos están correctos

            const stats = calculateStats(events, currentDate);
            renderStats(stats);
        })
        .catch(error => console.error('Error fetching data:', error)); // Manejar errores
}

function calculateStats(events, currentDate) {
    // Filtra eventos futuros y pasados
    let upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
    let pastEvents = events.filter(event => new Date(event.date) <= currentDate);

    console.log('Upcoming Events:', upcomingEvents);
    console.log('Past Events:', pastEvents);

    const stats = {
        highestAttendance: getEventWithHighestPercentageAttendance(pastEvents),
        lowestAttendance: getEventWithLowestPercentageAttendance(pastEvents),
        largestCapacity: getEventWithLargestCapacity(events),
        upcomingByCategory: getStatisticsByCategory(upcomingEvents),
        pastByCategory: getStatisticsByCategory(pastEvents)
    };

    return stats;
}

function getEventWithHighestPercentageAttendance(events) {
    if (events.length === 0) return null;

    return events.reduce((max, event) => {
        const percentage = (event.assistance / event.capacity) * 100;
        return percentage > max.percentage ? { ...event, percentage } : max;
    }, { percentage: 0 });
}

function getEventWithLowestPercentageAttendance(events) {
    if (events.length === 0) return null;

    return events.reduce((min, event) => {
        const percentage = (event.assistance / event.capacity) * 100;
        return percentage < min.percentage ? { ...event, percentage } : min;
    }, { percentage: Infinity });
}

function getEventWithLargestCapacity(events) {
    if (events.length === 0) return null;

    return events.reduce((max, event) => (event.capacity > max.capacity ? event : max), events[0]);
}

function getStatisticsByCategory(events) {
    let categories = {};

    events.forEach(event => {
        if (!categories[event.category]) {
            categories[event.category] = { revenue: 0, assistance: 0, capacity: 0, count: 0 };
        }

        categories[event.category].revenue += event.price * event.assistance;
        categories[event.category].assistance += event.assistance;
        categories[event.category].capacity += event.capacity;
        categories[event.category].count += 1;
    });

    for (let category in categories) {
        const categoryStats = categories[category];
        // Total capacity should be the sum of capacities of all events in that category
        const totalCapacity = categoryStats.capacity;
        categoryStats.percentage = totalCapacity > 0 ? (categoryStats.assistance / totalCapacity) * 100 : 0;
    }

    return categories;
}

function renderStats(stats) {
    const eventsStatsBody = document.getElementById('events-stats');
    const upcomingEventsCategoryBody = document.getElementById('upcoming-events-category');
    const pastEventsCategoryBody = document.getElementById('past-events-category');

    // Eventos con mayor y menor porcentaje de asistencia solo para eventos pasados
    eventsStatsBody.innerHTML = `
        <tr>
            <td>${stats.highestAttendance ? `${stats.highestAttendance.name} (${stats.highestAttendance.percentage.toFixed(2)}%)` : 'N/A'}</td>
            <td>${stats.lowestAttendance ? `${stats.lowestAttendance.name} (${stats.lowestAttendance.percentage.toFixed(2)}%)` : 'N/A'}</td>
            <td>${stats.largestCapacity ? `${stats.largestCapacity.name} (${stats.largestCapacity.capacity})` : 'N/A'}</td>
        </tr>
    `;

    // Estadísticas de eventos futuros por categoría
    upcomingEventsCategoryBody.innerHTML = Object.entries(stats.upcomingByCategory).map(([category, stats]) => `
        <tr>
            <td>${category}</td>
            <td>$${stats.revenue.toFixed(2)}</td>
            <td>${stats.percentage.toFixed(2)}%</td>
        </tr>
    `).join('');

    // Estadísticas de eventos pasados por categoría
    pastEventsCategoryBody.innerHTML = Object.entries(stats.pastByCategory).map(([category, stats]) => `
        <tr>
            <td>${category}</td>
            <td>$${stats.revenue.toFixed(2)}</td>
            <td>${stats.percentage.toFixed(2)}%</td>
        </tr>
    `).join('');
}

fetchAndRenderStats();

