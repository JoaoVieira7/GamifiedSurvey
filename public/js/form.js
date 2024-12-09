document.addEventListener('DOMContentLoaded', function () {
    var progressbar = document.getElementById("progressbar");
    var progressMessage = document.getElementById("progressMessage");
    var answeredGroups = new Set();
    var totalGroups = document.querySelectorAll('.question').length;
    let formSubmitted = false; 
    var formLoadedAt = new Date().toISOString();

    const funfacts = [
        "Sabias que pessoas que escrevem as suas metas têm 42% mais chances de alcançá-las? (Fonte: Dominican University of California, 2015)",
        "O ser humano toma cerca de 35.000 decisões por dia! (Fonte: Cornell University, 2007)",
        "Inquéritos com design responsivo têm 50% mais chances de serem completados em dispositivos móveis. (Fonte: Pew Research Center, 2021)",
        "Sabias que 60% das pessoas preferem responder a questionários gamificados do que tradicionais? (Fonte: Harms et al., 2015)",
        "O cérebro humano processa imagens 60.000 vezes mais rápido do que texto. (Fonte: 3M Corporation, 2001)",
        "Apresentar um tempo estimado de resposta pode reduzir o abandono em 40%. (Fonte: Parsons, 2007)",
        "O primeiro emoji foi criado no Japão, em 1999, por Shigetaka Kurita. (Fonte: Emojipedia)",
        "Mais de 70% dos inquéritos online hoje são respondidos em dispositivos móveis. (Fonte: SurveyMonkey, 2020)",
        "Sabias que a gamificação pode aumentar em 87% o engajamento numa tarefa? (Fonte: Hamari et al., 2014)",
        "Barra de progresso nos inquéritos aumenta a taxa de conclusão em até 18%. (Fonte: Parsons, 2007)",
        "Sabias que o maior inquérito já realizado teve 17 milhões de participantes? Ocorreu na Índia. (Fonte: Guinness World Records)",
        "Questionários interativos aumentam a participação de jovens em até 30%. (Fonte: Keusch & Zhang, 2017)",
        "A primeira pesquisa online foi realizada em 1994 pela empresa Market Facts. (Fonte: Market Research Association)",
        "Cerca de 25% das pessoas admitem já ter mentido ao responder a inquéritos. (Fonte: Harms et al., 2015)",
        "Recompensas simbólicas, como troféus virtuais, ativam os mesmos circuitos cerebrais que o chocolate! (Fonte: Psychology Today, 2017)",
        "Sabias que inquéritos mais curtos têm 85% mais chances de serem concluídos? (Fonte: SurveyMonkey, 2020)",
        "O design de um inquérito pode influenciar diretamente a qualidade das respostas. (Fonte: Dillman, 2000)",
        "Sabias que 80% das pessoas preferem responder a perguntas fechadas? (Fonte: ResearchGate, 2019)",
        "Em média, uma pessoa passa 2 horas e 31 minutos por dia em redes sociais. (Fonte: Global Web Index, 2022)",
        "O uso de gamificação em inquéritos aumenta a precisão das respostas em 15%. (Fonte: Harms et al., 2015)",
        "Cerca de 90% dos dados do mundo foram criados nos últimos dois anos. (Fonte: Forbes, 2020)",
        "A Terra recebe cerca de 1.000 toneladas de poeira cósmica todos os anos. (Fonte: NASA, 2019)",
        "Curiosidades ou factos divertidos durante um inquérito reduzem o abandono em 15%. (Fonte: Keusch & Zhang, 2017)",
        "Sabias que 90% das pessoas que começam um questionário gamificado chegam até ao final? (Fonte: Bailey et al., 2015)",
        "Mensagens motivacionais durante o progresso aumentam a retenção em até 25%. (Fonte: Harms et al., 2015)"
    ];
    
    function showFunFact() {
    const factContainer = document.getElementById("funFact");
    const randomFact = funfacts[Math.floor(Math.random() * funfacts.length)];
    factContainer.textContent = randomFact;
    const balaoFala = document.getElementById("balaoDeFala");

    // Mostrar o fun fact com uma transição
    factContainer.style.opacity = 0.9;
    balaoFala.style.opacity = 0.9;
    setTimeout(() => {
        factContainer.style.opacity = 0; // Esconder após 5 segundos
        balaoFala.style.opacity = 0;
    }, 7000);
}

    
    function updateProgressBar() {
        console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
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
        
        // Verifica se o input é checkbox, radio ou select
        const isCheckbox = event.target.type === 'checkbox';
        
        const checkboxes = questionElement.querySelectorAll('input[type="checkbox"]');
        
        let checkedCount = 0;
        
        if (isCheckbox) {
            // Conta o número de checkboxes marcados
            checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
            
            // A função só deve avançar se houver 3 opções marcadas
            if (checkedCount === 3) {
                proceedToNextQuestion();
            }
        } else {
                proceedToNextQuestion();
            }
        }
    
    
    // Função para navegar para a próxima pergunta e ativar o scroll
    function proceedToNextQuestion() {
        const questionElement = event.target.closest('.question');
        answeredGroups.add(questionElement.id);
        updateProgressBar();
        playSound();
        addShakeAnimation(questionElement);
    
        // Navegar para a próxima pergunta
        const nextQuestion = questionElement.nextElementSibling;
        if (nextQuestion && nextQuestion.classList.contains('question')) {
            // Scroll automático para a próxima pergunta
            setTimeout(() => {
                nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 700);
    
            showFunFact();  // Exibe o próximo fato interessante
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

    document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', handleInputEvent);
    });

    document.querySelector('.survey-form').addEventListener('submit', async (event) => {
        formSubmitted = true; // Marca como submetido para desativar o beforeunload

        event.preventDefault(); // Previne o envio padrão do formulário
        console.log('Formulário submetido!');
    
        const formData = new FormData(event.target);
        const data = {};
    
        // Captura todos os valores do formulário
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });
    
        // Converte os arrays de checkboxes para strings separadas por vírgulas
        const groupCheckboxValues = (key) => {
            if (Array.isArray(data[key])) {
                data[key] = data[key].join(', '); // Junta os valores num string
            }
        };
    
        groupCheckboxValues('medidas_equilibrio');
        groupCheckboxValues('falhas_curso');
        groupCheckboxValues('mudancas_curriculo');
        groupCheckboxValues('melhorias_universidade');
        groupCheckboxValues('sugestoes_experiencia');
    
        data.form_loaded_at = formLoadedAt;
        data.form_submitted_at = new Date().toISOString();
    
        console.log('Dados antes de enviar:', data);
    
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Resposta do servidor:', responseData);
            
                if (responseData.redirectUrl) {
                    window.location.href = responseData.redirectUrl; // Redireciona para a página final
                } else {
                    alert('Formulário submetido com sucesso!');
                }
            } else {
                throw new Error(`Erro do servidor: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao submeter o formulário:', error);
            alert('Ocorreu um erro ao submeter o formulário. Por favor, tente novamente.');
        }
    });
    

    
    
    // Registrar tentativa de saída da página
    window.addEventListener('beforeunload', async (event) => {
        if (formSubmitted) return; // Não faz nada se o formulário já foi submetido

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
