const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

function fetchAndRenderStats() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const events = data.events;
            const currentDate = new Date(data.currentDate);

            // Filtrar eventos futuros y pasados
            const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
            const pastEvents = events.filter(event => new Date(event.date) <= currentDate);

            // Calcular estadísticas
            const stats = {
                highestAttendance: getHighestAttendance(pastEvents),
                lowestAttendance: getLowestAttendance(pastEvents),
                largestCapacity: getLargestCapacity(events),
                upcomingByCategory: getCategoryStats(upcomingEvents, 'estimate'),
                pastByCategory: getCategoryStats(pastEvents, 'assistance')
            };

            renderStats(stats);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function getHighestAttendance(events) {
    return events.reduce((highest, event) => {
        const attendance = event.assistance || event.estimate || 0;
        const percentage = (attendance / event.capacity) * 100;
        return percentage > (highest.percentage || 0) ? { ...event, percentage } : highest;
    }, { percentage: 0 });
}

function getLowestAttendance(events) {
    return events.reduce((lowest, event) => {
        const attendance = event.assistance || event.estimate || 0;
        const percentage = (attendance / event.capacity) * 100;
        return percentage < (lowest.percentage || Infinity) ? { ...event, percentage } : lowest;
    }, { percentage: Infinity });
}

function getLargestCapacity(events) {
    return events.reduce((largest, event) => event.capacity > (largest.capacity || 0) ? event : largest, {});
}

function getCategoryStats(events, attendanceField) {
    const categories = {};

    events.forEach(event => {
        if (!categories[event.category]) {
            categories[event.category] = { revenue: 0, assistance: 0, capacity: 0 };
        }

        const attendance = event[attendanceField] || 0;
        categories[event.category].revenue += event.price * attendance;
        categories[event.category].assistance += attendance;
        categories[event.category].capacity += event.capacity;
    });

    for (let category in categories) {
        const stats = categories[category];
        stats.percentage = stats.capacity > 0 ? (stats.assistance / stats.capacity) * 100 : 0;
    }

    return categories;
}

function renderStats(stats) {
    const eventsStatsBody = document.getElementById('events-stats');
    const upcomingEventsCategoryBody = document.getElementById('upcoming-events-category');
    const pastEventsCategoryBody = document.getElementById('past-events-category');

    // Renderizar eventos con mayor y menor porcentaje de asistencia
    eventsStatsBody.innerHTML = `
        <tr>
            <td>${stats.highestAttendance.name || 'N/A'} (${(stats.highestAttendance.percentage || 0).toFixed(2)}%)</td>
            <td>${stats.lowestAttendance.name || 'N/A'} (${(stats.lowestAttendance.percentage || 0).toFixed(2)}%)</td>
            <td>${stats.largestCapacity.name || 'N/A'} (${(stats.largestCapacity.capacity || 0)})</td>
        </tr>
    `;

    // Renderizar estadísticas de eventos futuros por categoría
    upcomingEventsCategoryBody.innerHTML = Object.entries(stats.upcomingByCategory).map(([category, stats]) => `
        <tr>
            <td>${category}</td>
            <td>$${stats.revenue.toFixed(2)}</td>
            <td>${stats.percentage.toFixed(2)}%</td>
        </tr>
    `).join('');

    // Renderizar estadísticas de eventos pasados por categoría
    pastEventsCategoryBody.innerHTML = Object.entries(stats.pastByCategory).map(([category, stats]) => `
        <tr>
            <td>${category}</td>
            <td>$${stats.revenue.toFixed(2)}</td>
            <td>${stats.percentage.toFixed(2)}%</td>
        </tr>
    `).join('');
}

// Llamar a la función para obtener y renderizar las estadísticas
fetchAndRenderStats();



