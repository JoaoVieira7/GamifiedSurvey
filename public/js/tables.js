        // Função para buscar dados do servidor
        async function fetchData() {
            try {
                const response = await fetch('/data');
                const data = await response.json();

                const tableBody = document.getElementById('table-body');
                tableBody.innerHTML = '';
                

                data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }

        //Função para buscar dados da retenção dos utilizadores

        async function fetchRetentionData() {
            try {
                const retention_response = await fetch('/retention-data');
                const retention_data = await retention_response.json();

                const tableBodyRetention = document.getElementById('table-body-retention');
                tableBodyRetention.innerHTML = '';

                retention_data.forEach(row => {
                    const tr = document.createElement('tr');
                    Object.values(row).forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tableBodyRetention.appendChild(tr);
                });
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }

        // Buscar dados ao carregar a página
        window.onload = function() {
    fetchData();
    fetchRetentionData();
};