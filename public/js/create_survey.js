document.addEventListener('DOMContentLoaded', function () {
    let questionCount = 1;

    document.getElementById('add-question').addEventListener('click', function () {
        questionCount++;
        const questionsContainer = document.getElementById('questions-container');
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('question');
        newQuestion.innerHTML = `
            <label for="question${questionCount}">Question ${questionCount}</label>
            <input type="text" class="form-control" id="question${questionCount}" name="question${questionCount}" placeholder="Enter your question">
            <label for="type${questionCount}">Question Type</label>
            <select class="form-control question-type" id="type${questionCount}" name="type${questionCount}">
                <option value="multiple">Multiple Choice</option>
                <option value="ordering">Ordering</option>
                <option value="select">Select</option>
                <option value="text">Text Box</option>
            </select>
            <div class="options-container" id="options-container${questionCount}">
                <!-- Options will be added here dynamically -->
            </div>
            <button type="button" class="btn btn-secondary add-option" data-question-id="${questionCount}">Add Option</button>
        `;
        questionsContainer.appendChild(newQuestion);
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-option')) {
            const questionId = event.target.getAttribute('data-question-id');
            const optionsContainer = document.getElementById(`options-container${questionId}`);
            const optionCount = optionsContainer.children.length + 1;
            const newOption = document.createElement('div');
            newOption.classList.add('form-group');
            newOption.innerHTML = `
                <label for="question${questionId}_option${optionCount}">Option ${optionCount}</label>
                <input type="text" class="form-control" id="question${questionId}_option${optionCount}" name="question${questionId}_option${optionCount}" placeholder="Enter option text">
            `;
            optionsContainer.appendChild(newOption);
        }
    });

    document.getElementById('survey-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const surveyData = {};
        formData.forEach((value, key) => {
            surveyData[key] = value;
        });
        fetch('/create_survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Survey created successfully!');
                } else {
                    alert('Failed to create survey');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while creating the survey');
            });
    });
});