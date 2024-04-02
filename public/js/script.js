document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('surveyForm');
    const formLoadTime = new Date().toISOString();
    const totalGroups = document.querySelectorAll('form p').length;
    let answeredGroups = new Set();

    // Função para atualizar a barra de progresso
    function updateProgressBar() {
        const progress = (answeredGroups.size / totalGroups) * 100;
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = progress + '%';
        progressBar.textContent = `Progresso: ${Math.round(progress)}%`;
        progressBarColor(progress, progressBar);
    }

    function progressBarColor(progress, progressBar) {
        if (progress < 35) {
            progressBar.style.backgroundColor = 'red'; // Cor de fundo para progresso abaixo de 35%
        } else if (progress >= 35 && progress < 68) {
            progressBar.style.backgroundColor = '#ffc107'; // Cor de fundo para progresso entre 35% e 65%
        } else {
            progressBar.style.backgroundColor = 'green'; // Cor de fundo para progresso acima de 65%
        }
    }

    // Função para mostrar o pop-up depois de cada resposta
    function showRandomPopUp(content) {
        const randomStyleNumber = Math.floor(Math.random() * 5) + 1;

        // Cria um novo elemento de div para o pop-up
        const popup = document.createElement('div');
        popup.textContent = content;
  
        // Adiciona classe de estilo aleatória ao pop-up
        popup.classList.add('popup');
        popup.classList.add('popup-style-' + randomStyleNumber);

        // Define a posição do pop-up aleatoriamente na página sem tapar as perguntas   
        const position = {
        x: Math.floor((Math.random() * 300) + 700),
        y: Math.floor(Math.random() * 400)
        };
        popup.style.position = 'fixed';
        popup.style.top = position.y + 'px';
        popup.style.left = position.x + 'px';


        // Cria um elemento de imagem para o pop-up
        const img = document.createElement('img');

        // Define o caminho da imagem com base na classe de estilo aleatória
        switch (randomStyleNumber) {
        case 1:
            img.src = 'images/alright.png';
            img.style.height = "150px";
            break;
        case 2:
            img.src = 'images/like.png';
            img.style.height = "250px";
            break;
        case 3:
            img.src = 'images/yes.png';
            img.style.height = "150px";
            break;
        case 4:
            img.src = 'images/gift.png';
            img.style.height = "150px";
            break;
        case 5:
            img.src = 'images/correct.png';
            img.style.height = "150px";
            break;
        default:
            break;
    }

    // Adiciona a imagem ao pop-up
    popup.appendChild(img);


        // Adiciona o pop-up ao final do corpo do documento
        document.body.appendChild(popup);
    
        // Exibe o pop-up
        popup.style.display = 'block';

        // Define um temporizador para ocultar o pop-up após 3 segundos
        setTimeout(function() {
        popup.style.display = 'none';
        }, 2000);
    }   
    
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('click', function(event) {
            // Adiciona o nome do grupo ao conjunto de grupos respondidos
            answeredGroups.add(event.target.name);
            updateProgressBar();
            showRandomPopUp();
            // Atualiza a barra de progresso
        });
    });
    

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

  
        const formData = {
            first_name: document.getElementById('firstName') ? document.getElementById('firstName').value : '',
            last_name: document.getElementById('lastName') ? document.getElementById('lastName').value : '',
            form_loaded_at: formLoadTime
        };

        showPopup("Muito bem, +10 Pontos!");

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.text(); // Ou response.json() se o servidor responder com JSON
        })
        .then(data => {
            console.log('Sucesso:', data);
            // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
    });
});
