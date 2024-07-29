const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3001;

const pool = new Pool({
    host: 'postgres',
    user: 'user',
    database: 'votes',
    password: 'password',
    port: 5432,
});

// Servir les fichiers statiques (CSS et images)
app.use(express.static(path.join(__dirname)));

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT choice, COUNT(*) as count FROM votes GROUP BY choice');
        const totalVotes = result.rows.reduce((acc, row) => acc + parseInt(row.count), 0);

        const choices = result.rows.map(row => row.choice);
        const counts = result.rows.map(row => row.count);

        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Résultats des Votes</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <link href="/style.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <div class="container mt-5">
                <h1 class="text-center">Résultats des Votes</h1>
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Statistiques Générales</h5>
                                <canvas id="votesChart"></canvas>
                                <p class="card-text">Total des votes: ${totalVotes}</p>
        `;
        result.rows.forEach(row => {
            const percentage = ((row.count / totalVotes) * 100).toFixed(2);
            html += `<p class="card-text">${row.choice}: ${row.count} votes (${percentage}%)</p>`;
        });
        html += `
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mt-4 mt-md-0">
                            <div class="card-body">
                                <h5 class="card-title">Détails des Votes</h5>
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Choix</th>
                                            <th>Nombre de Votes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;
        result.rows.forEach(row => {
            html += `
                                        <tr>
                                            <td>${row.choice}</td>
                                            <td>${row.count}</td>
                                        </tr>
            `;
        });
        html += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            <script>
                const ctx = document.getElementById('votesChart').getContext('2d');
                const votesChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ${JSON.stringify(choices)},
                        datasets: [{
                            label: 'Nombre de Votes',
                            data: ${JSON.stringify(counts)},
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Distribution des Votes'
                            }
                        }
                    },
                });
            </script>
        </body>
        </html>
        `;
        res.send(html);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
