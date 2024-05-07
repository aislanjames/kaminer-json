document.addEventListener('DOMContentLoaded', function() {
    fetch('https://meuapp.vercel.app/data')
        .then(response => response.json())
        .then(data => {
            const categorias = {};
            data.forEach(item => {
                categorias[item.Categoria] = (categorias[item.Categoria] || 0) + 1;
            });

            const ctx = document.getElementById('produtoChart').getContext('2d');
            const produtoChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(categorias),
                    datasets: [{
                        label: 'Número de Produtos por Categoria',
                        data: Object.values(categorias),
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
        });
});
