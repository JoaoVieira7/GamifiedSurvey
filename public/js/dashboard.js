async function fetchData() {
    try {
        const response = await fetch('/data');
    const data = await response.json();

    document.getElementById('number-of-answers').textContent = data.length;
            // Calcular o tempo médio de resposta
            let totalResponseTime = 0;
            data.forEach(entry => {
                const formLoadedAt = new Date(entry.form_loaded_at);
                const formSubmittedAt = new Date(entry.form_submitted_at);
                const responseTime = formSubmittedAt - formLoadedAt; // em milissegundos
                totalResponseTime += responseTime;
            });
    
            const averageResponseTime = totalResponseTime / data.length;
            const averageResponseTimeInSeconds = averageResponseTime / 1000; // converter para segundos
    
            // Exibir o tempo médio de resposta
            document.getElementById('average-time').textContent = averageResponseTimeInSeconds.toFixed(2) + ' seconds';
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }



}


async function fetchRetentionData() {
    try {
        const response = await fetch('/retention-data');
    const data = await response.json();

    document.getElementById('unfinished-answers').textContent = data.length;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    
}
}

    // Buscar dados ao carregar a página
    window.onload = function() {
        fetchData();
        fetchRetentionData();
    };