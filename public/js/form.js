document.addEventListener('DOMContentLoaded', function () {
    var progressbar = document.getElementById("progressbar");
    var answeredGroups = new Set();
    var totalGroups = document.querySelectorAll('.question').length;
    var formLoadedAt = new Date().toISOString();

    function gifAppears() {
        const gif = document.createElement('div');
        gif.classList.add('party');
      
        const gifImage = document.createElement('img');
        gifImage.src = '/images/best-gif.gif'; // Substitua por sua URL do gif
        gif.appendChild(gifImage);
      
        document.body.appendChild(gif); // Ajuste o elemento pai se necessário
        setTimeout(() => { document.body.removeChild(gif) }, 4000);
        var audiofinal = new Audio('/audio/Finished.mp3');
        audiofinal.play();
    }

    function updateProgressBar() {
        var progress = (answeredGroups.size / totalGroups) * 100;
        progressbar.style.width = progress + '%';

        if (progress < 35) {
            progressbar.style.backgroundColor = '#538052';
        } else if (progress >= 35 && progress < 66) {
            progressbar.style.backgroundColor = '#238D12';
        } else if (progress >= 66 && progress < 99) {
            progressbar.style.backgroundColor = '#2DB517';
        } else {
            progressbar.style.backgroundColor = '#1DCF00';
            gifAppears();
        }
    }

    function playSound() {
        var audio1 = new Audio('/audio/duolingo-correct.mp3');
        var audio2 = new Audio('/audio/correct-choice.mp3');
        Math.floor(Math.random() * 2) + 1;
        if (Math.floor(Math.random() * 2) + 1 == 1) {
            audio1.play();
        } else {
            audio2.play();
        }
    }

    document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.addEventListener('click', function (event) {
            answeredGroups.add(event.target.name);
            updateProgressBar();
            playSound();
        });
    });

    document.querySelector('.survey-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log('Formulário submetido!');

        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.form_loaded_at = formLoadedAt;
        const formSubmittedAtInput = document.getElementById('submit-btn');
        formSubmittedAtInput.value = new Date().toISOString(); // Captura o tempo de envio no cliente

        console.log('Dados do formulário:', data);

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Resposta do servidor:', response);

            if (!response.ok) {
                throw new Error('Erro na resposta da rede.');
            }

            const responseData = await response.json();
            console.log('Dados da resposta:', responseData);
            alert(responseData.message);

            if (responseData.redirectUrl) {
                window.location.href = responseData.redirectUrl;
            }
        } catch (error) {
            console.error('Erro ao submeter o formulário:', error);
            alert('Ocorreu um erro ao submeter o formulário.');
        }
    });

    // Registrar tentativa de saída da página
    window.addEventListener('beforeunload', async (event) => {
        const formSubmittedAt = new Date().toISOString();
        const data = {
            form_loaded_at: formLoadedAt,
            form_submitted_at: formSubmittedAt
        };

        try {
            await fetch('/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                keepalive: true // Mantém a requisição viva mesmo após a navegação
            });
        } catch (error) {
            console.error('Erro ao registrar dados de saída:', error);
        }
    });
});
