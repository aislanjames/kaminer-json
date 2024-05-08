document.addEventListener('DOMContentLoaded', function() {
    const endpoints = {
        categoria: '/api/produtosPorCategoria',
        ativosInativos: '/api/produtosAtivosInativos',
        empresaFreq: '/api/frequenciaDeRegistrosPorEmpresa',
        vencimentoSituacao: '/api/correlacaoVencimentoSituacao'
    };

    const createChart = (canvasId, title, data) => {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: title,
                    data: Object.values(data),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    Object.entries(endpoints).forEach(([key, url]) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                createChart(`${key}Chart`, `Número de ${key}`, data);
            })
            .catch(error => console.error('Error loading the data: ', error));
    });
});
