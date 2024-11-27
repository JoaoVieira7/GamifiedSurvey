document.addEventListener('DOMContentLoaded', function () {
    var progressbar = document.getElementById("progressbar");
    var progressMessage = document.getElementById("progressMessage");
    var answeredGroups = new Set();
    var totalGroups = document.querySelectorAll('.question').length;
    var formLoadedAt = new Date().toISOString();
    
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
        }

        if (progress >= 50 && progress < 60) {
            progressMessage.textContent = "Estás quase lá!";
            progressMessage.style.display = 'block';
        } else if (progress === 70 ) {
            progressMessage.textContent = "Estás na reta final!";
            progressMessage.style.display = 'block';
        } else if (progress === 100) {
            progressMessage.textContent = "Parabéns Conseguiste!";
            progressMessage.style.display = 'block';
        } else {
            progressMessage.style.display = 'none'; // Ocultar mensagem se não atingir 50%, 70% ou 100%
        }
    }

        // Aplica a cor de fundo dinâmica
        document.querySelectorAll('.question').forEach(function (question, index) {
            var questionNumber = index + 1; // Convertendo índice baseado em 0 para número baseado em 1
            
            if (questionNumber % 3 === 0 && questionNumber % 5 === 0) {
                question.style.backgroundColor = '#3f9a3f'; // Cor para perguntas divisíveis por 3 e 5
            } else if (questionNumber % 3 === 0) {
                question.style.backgroundColor = '#40A578'; // Cor para perguntas divisíveis por 3
            } else if (questionNumber % 5 === 0) {
                question.style.backgroundColor = '#76B345'; // Cor para perguntas divisíveis por 5
            } else if (questionNumber % 2 === 0) {
                question.style.backgroundColor = '#538052'; // Cor para perguntas divisíveis por 2
            } else {
                question.style.backgroundColor = '#77A969'; // Cor para outras perguntas
            }
        });

    function playSound() {
        var audio1 = new Audio('/audio/duolingo-correct.mp3');
        var audio2 = new Audio('/audio/correct-choice.mp3');
        var randomChoice = Math.floor(Math.random() * 2) + 1;
        if (randomChoice == 1) {
            audio1.play();
        } else {
            audio2.play();
        }
    }

    function addShakeAnimation(questionElement) {
        questionElement.classList.add('shake');
        setTimeout(() => {
            questionElement.classList.remove('shake');
        }, 500); // A duração da animação é 0.5s
    }

    function handleInputEvent(event) {
        const questionElement = event.target.closest('.question');
    
        if (questionElement) {
            answeredGroups.add(questionElement.id);
            updateProgressBar();
            playSound();
            addShakeAnimation(questionElement);
    
            // Navegar para a próxima pergunta
            const nextQuestion = questionElement.nextElementSibling;
            if (nextQuestion && nextQuestion.classList.contains('question')) {
                nextQuestion.classList.add('active');      // Adiciona 'active' à próxima
    
                // Scroll automático para a próxima pergunta
                setTimeout(() => {
                    nextQuestion.scrollIntoView({ behavior: 'smooth' });
                }, 750);
            }
        }
    }
    

    document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.addEventListener('click', handleInputEvent);
    });

    document.querySelectorAll('textarea').forEach(function (textarea) {
        textarea.addEventListener('blur', handleInputEvent);
    });

    document.querySelectorAll('select').forEach(function (select) {
        select.addEventListener('change', handleInputEvent);
    });

    // Função para atualizar o input hidden com a ordem das frutas
    function updateSortedList() {
        var sortedIDs = $("#sortable").sortable("toArray", { attribute: "data-id" });
        $("#sortedList").val(sortedIDs.join(","));
        const questionElement = document.getElementById('question11');
        answeredGroups.add(questionElement.id);
        updateProgressBar();
        playSound();
        addShakeAnimation(questionElement);
    }

    // Tornar a lista ordenável usando jQuery UI
    $("#sortable").sortable({
        update: function (event, ui) {
            updateSortedList();
        }
    }).disableSelection();

    // Inicializar a lista ordenada no carregamento da página
    updateSortedList();

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
