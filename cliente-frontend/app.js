const API_URL = 'http://localhost:3000/api/recursos';

async function cargarDatos() {
    const res = await fetch(API_URL);
    const libros = await res.json();
    const tbody = document.querySelector('#tabla tbody');
    tbody.innerHTML = '';

    const anios = {};
    const autores = {};

    libros.forEach(l => {
        tbody.innerHTML += `<tr><td>${l.id}</td><td>${l.nombre}</td><td>${l.autor}</td><td>${l.anio}</td></tr>`;
        anios[l.anio] = (anios[l.anio]||0)+1;
        autores[l.autor] = (autores[l.autor]||0)+1;
    });

    new Chart(document.getElementById('miGrafica'), {
        type: 'bar',
        data: { labels: Object.keys(anios), datasets: [{ label: 'Libros por año', data: Object.values(anios), backgroundColor: '#3498db' }] }
    });

    new Chart(document.getElementById('miGraficaPie'), {
        type: 'pie',
        data: { labels: Object.keys(autores), datasets: [{ data: Object.values(autores), backgroundColor: ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6'] }] }
    });
}
cargarDatos();