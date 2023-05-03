document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.code === 'KeyD') {
        openDeveloperMode();
    }
});

function openDeveloperMode() {
    // Stwórz okienko z trybem deweloperskim
    const developerWindow = window.open('', 'DeveloperMode', 'width=800,height=600');

    // Dodaj zawartoœæ do okienka
    developerWindow.document.write('<h1>Tryb deweloperski</h1>');
    developerWindow.document.write('<input type="text" id="searchQuestion" placeholder="Wyszukaj pytanie..." />');
    developerWindow.document.write('<pre id="jsonDisplay"></pre>');

    // Dodaj event listener do pola wyszukiwania
    const searchInput = developerWindow.document.getElementById('searchQuestion');
    searchInput.addEventListener('input', (event) => {
        const searchId = parseInt(event.target.value.trim());
        if (searchId) {
            const foundQuestion = quizData.find((questionData) => questionData.id === searchId);
            if (foundQuestion) {
                developerWindow.document.getElementById('jsonDisplay').textContent = JSON.stringify(foundQuestion, null, 2);

                // Usuñ istniej¹ce elementy pytania i odpowiedzi
                const existingQuestionElement = developerWindow.document.querySelector('.question-container');
                const existingAnswersElement = developerWindow.document.querySelector('.answers-container');
                if (existingQuestionElement) existingQuestionElement.remove();
                if (existingAnswersElement) existingAnswersElement.remove();

                // Wyœwietl pytanie i odpowiedzi w trybie deweloperskim
                displayQuestionInDeveloperMode(developerWindow, foundQuestion);
            } else {
                developerWindow.document.getElementById('jsonDisplay').textContent = 'Nie znaleziono pytania.';
            }
        } else {
            developerWindow.document.getElementById('jsonDisplay').textContent = '';
        }
    });
}

function displayQuestionInDeveloperMode(developerWindow, questionData) {
    const questionElement = developerWindow.document.createElement('div');
    const answersElement = developerWindow.document.createElement('ul');

    questionElement.classList.add('question-container');
    answersElement.classList.add('answers-container');

    questionElement.innerHTML = `Pytanie ${questionData.id}: ${questionData.question}`;
    answersElement.innerHTML = '';

    questionData.answers.forEach((answer, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${answer}`;
        answersElement.appendChild(li);
    });

    developerWindow.document.body.appendChild(questionElement);
    developerWindow.document.body.appendChild(answersElement);
}
