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

        if (progress >= 50 && progress < 65) {
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
        }
    }

    // Reattach event listeners after dynamic content is loaded
    function attachEventListeners() {
        document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
            radio.addEventListener('click', handleInputEvent);
        });

        document.querySelectorAll('textarea').forEach(function (textarea) {
            textarea.addEventListener('blur', handleInputEvent);
        });

        document.querySelectorAll('select').forEach(function (select) {
            select.addEventListener('change', handleInputEvent);
        });
    }

    // Função para atualizar o input hidden com a ordem das frutas
    function updateSortedList(questionNumber) {
        var sortedIDs = $(`#sortable${questionNumber}`).sortable("toArray", { attribute: "data-id" });
        $(`#sortedList${questionNumber}`).val(sortedIDs.join(","));
        const questionElement = document.getElementById(`question${questionNumber}`);
        answeredGroups.add(questionElement.id);
        updateProgressBar();
        playSound();
        addShakeAnimation(questionElement);
    }

    // Tornar a lista ordenável usando jQuery UI
    function initializeSortable(questionNumber) {
        $(`#sortable${questionNumber}`).sortable({
            update: function (event, ui) {
                updateSortedList(questionNumber);
            }
        }).disableSelection();
    }

    // Fetch questions and initialize everything
    fetch('/get_survey')
        .then(response => response.json())
        .then(data => {
            const questionsContainer = document.getElementById('response-form');
            Object.keys(data).forEach(key => {
                if (key.startsWith('question') && !key.includes('_option')) {
                    const questionNumber = key.replace('question', '');
                    const questionText = data[key];
                    const questionType = data[`type${questionNumber}`];
                    const questionDiv = document.createElement('div');
                    questionDiv.classList.add('question');
                    questionDiv.id = `question${questionNumber}`;
                    questionDiv.innerHTML = `
                        <p>${questionText}</p>
                        ${getQuestionInput(questionNumber, questionType, data)}
                    `;
                    questionsContainer.appendChild(questionDiv);
                }
            });

            // Update total groups and reattach event listeners
            totalGroups = document.querySelectorAll('.question').length;
            attachEventListeners();

            // Initialize sortable lists
            Object.keys(data).forEach(key => {
                if (key.startsWith('question') && data[`type${key.replace('question', '')}`] === 'ordering') {
                    initializeSortable(key.replace('question', ''));
                }
            });
        });

    function getQuestionInput(questionNumber, questionType, data) {
        switch (questionType) {
            case 'multiple':
                return getMultipleChoiceInput(questionNumber, data);
            case 'ordering':
                return getOrderingInput(questionNumber, data);
            case 'select':
                return getSelectInput(questionNumber, data);
            case 'text':
                return getTextInput(questionNumber);
            default:
                return '';
        }
    }

    function getMultipleChoiceInput(questionNumber, data) {
        let optionsHtml = '';
        Object.keys(data).forEach(key => {
            if (key.startsWith(`question${questionNumber}_option`)) {
                optionsHtml += `
                    <div class="radio-container">
                        <input type="radio" id="${key}" name="question${questionNumber}" value="${data[key]}">
                        <label for="${key}">${data[key]}</label>
                    </div>
                `;
            }
        });
        return optionsHtml;
    }

    function getOrderingInput(questionNumber, data) {
        let optionsHtml = `<ul class="ui-sortable" id="sortable${questionNumber}">`;
        Object.keys(data).forEach(key => {
            if (key.startsWith(`question${questionNumber}_option`)) { 
                optionsHtml += `
                    <li class="ui-state-default" data-id="${key}">${data[key]}</li>
                `;
            }
        });
        optionsHtml += '</ul>';
        optionsHtml += `<input type="hidden" id="sortedList${questionNumber}" name="question${questionNumber}_sortedList">`;
        return optionsHtml;
    }

    function getSelectInput(questionNumber, data) {
        let optionsHtml = `<select class="form-control" name="question${questionNumber}">`;
        Object.keys(data).forEach(key => {
            if (key.startsWith(`question${questionNumber}_option`)) {
                optionsHtml += `<option value="${data[key]}">${data[key]}</option>`;
            }
        });
        optionsHtml += '</select>';
        return optionsHtml;
    }

    function getTextInput(questionNumber) {
        return `<textarea class="form-control" name="question${questionNumber}" rows="4" cols="50" placeholder="Escreve aqui..."></textarea>`;
    }

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

    // Aplica a cor de fundo dinâmica
    function applyBackgroundColors() {
        document.querySelectorAll('.question').forEach(function (question, index) {
            var questionNumber = index + 1; // Convertendo índice baseado em 0 para número baseado em 1

            if (questionNumber % 3 === 0 && questionNumber % 5 === 0) {
                question.style.backgroundColor = '#FF5733'; // Cor para perguntas divisíveis por 3 e 5
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
    }

    // Reaplicar as cores após carregar as perguntas
    fetch('/get_survey')
        .then(response => response.json())
        .then(data => {
            applyBackgroundColors();
        });

});
