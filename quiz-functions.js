// Funkcja tworz�ca element HTML z odpowiedzi�
function createAnswerElement(answer, index, shuffledIndex) {
    const li = document.createElement('li'); // Stw�rz element listy
    const input = document.createElement('input'); // Stw�rz element input
    const label = document.createElement('label'); // Stw�rz element label
    const answerContainer = document.createElement('div');


    // Ustaw atrybuty dla elementu input
    input.type = 'radio';
    input.name = 'answer';
    input.value = index;
    input.id = `answer-${index}`;

    // Ustaw atrybuty dla elementu label
    label.htmlFor = `answer-${index}`;
    label.textContent = answer;

    // Dodaj zdarzenie click do elementu answerContainer
    answerContainer.addEventListener('click', () => {
        // Sprawd�, czy input nie jest ju� zaznaczony
        if (!input.checked) {
            // Je�li nie, zaznacz go
            input.checked = true;
        }
    });

    // Dodaj zdarzenie click do elementu input
    input.addEventListener('click', (event) => {
        // Zapobiegaj podw�jnemu wywo�aniu zdarzenia click
        event.stopPropagation();
    });


    answerContainer.classList.add('answer-container');
    answerContainer.appendChild(input);

    // Dodaj elementy input i label do elementu listy
    answerContainer.appendChild(label);
    li.appendChild(answerContainer);

    label.htmlFor = `answer-${index}`;
    label.textContent = answer;
    label.classList.add('answer-text'); // Dodaj klas� 'answer-text'

    return li; // Zwr�� element listy z odpowiedzi�
}

// Funkcja sprawdzaj�ca odpowied� i zliczaj�ca wyniki
function checkAnswer() {
    const correctAnswer = quizData[currentQuestion].correctAnswer;

 if (userAnswer === correctAnswer) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    quizData[currentQuestion].userAnswer = userAnswer; // Zapisz odpowied� u�ytkownika w quizData

    currentQuestion++;

    if (currentQuestion < numberOfQuestions) {
        setTimeout(() => {
            displayQuestion();
            resetAnswer();
        }, 10);
    }
}


// Funkcja wy�wietlaj�ca pytanie i odpowiedzi na stronie
async function displayQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');

    // Poprawiony napis "Pytanie x/numberOfQuestions1"
    questionElement.innerHTML = `Pytanie ${currentQuestion + 1}/${numberOfQuestions1}: ${quizData[currentQuestion].question}`;

    answersElement.innerHTML = '';

    const answersCopy = quizData[currentQuestion].answers.map((answer, index) => ({ answer, index }));
    const shuffledAnswers = shuffleArray1(answersCopy);
    odpowiedzi[currentQuestion] = shuffledAnswers;

    answersCopy.forEach(({ answer, index }) => {
        const li = createAnswerElement(answer, index);
        answersElement.appendChild(li);
    });

    // Zamie� ostatni� odpowied� na "�adne z powy�szych" z 30% szansami
    if (Math.random() < 0.3 && !checkIfNoneExists(quizData[currentQuestion].answers)) {
        replaceLastAnswerWithNone(answersElement);
    }

    // Obs�uga zdarze� klawisza "keydown"
    document.addEventListener('keydown', (event) => handleNumericKeyPress(event, answersCopy));

    questionElement.classList.add('question-text');


    // Je�li jeste�my przy ostatnim pytaniu, ukryj przycisk "Nast�pne pytanie" i wy�wietl przycisk "Zako�cz quiz"
    updateButtonsVisibility();
    resetAnswer();
}


// Funkcja zamieniaj�ca ostatni� odpowied� na "�adne z powy�szych"
function replaceLastAnswerWithNone(answersElement) {
    // Pobierz ostatni element odpowiedzi
    const lastAnswer = answersElement.lastChild;
    const input = lastAnswer.querySelector('input');
    const label = lastAnswer.querySelector('label');

    // Ustaw atrybuty dla ostatniej odpowiedzi
    input.value = -1;
    input.id = 'answer-none';
    label.htmlFor = 'answer-none';
    label.textContent = '\u017badne z powy\u017cszych';
    isLastAnswerNone = true;
}

// Funkcja mieszaj�ca elementy tablicy
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Zamienia miejscami elementy i oraz j w tablicy
    }
}

function shuffleArray1(array) {
    if (!checkIfNoneExists(quizData[currentQuestion].answers)) {
        for (let i = array.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [array[i], array[j]] = [array[j], array[i]];
        }
    } else {
        [array[array.length - 1], array[noneOfTheAboveIndex]] = [array[noneOfTheAboveIndex], array[array.length - 1]];
    }
    return array;
}

// Funkcja resetuj�ca zaznaczenie odpowiedzi
function resetAnswer() {
    const checkedAnswer = document.querySelector('input[name="answer"]:checked'); // Pobierz zaznaczon� odpowied�
    if (checkedAnswer) {
        checkedAnswer.checked = false; // Odznacz zaznaczon� odpowied�
    }
    answerChecked = false; // Ustaw, �e odpowied� nie zosta�a sprawdzona
}


function handleNumericKeyPress(event, answersCopy) {
    const key = event.key;
    const numericKeys = ['1', '2', '3', '4', '5'];
    const noneAnswerIndex = quizData[currentQuestion].answers.length - 1;
    const isNoneAnswer = answersCopy[noneAnswerIndex].answer === '�adne z powy�szych';

    if (numericKeys.includes(key)) {
        let answerIndex = parseInt(key) - 1;
        if (isNoneAnswer && answerIndex >= noneAnswerIndex) {
            answerIndex--;
        }
        const answerInput = document.getElementById(`answer-${answersCopy[answerIndex].index}`);
        if (answerInput) {
            answerInput.checked = true;
        }
    } else if (key === ' ') {
        event.preventDefault(); // Zapobiegamy domy�lnemu dzia�aniu spacji (przewijanie strony)
        if (currentQuestion === numberOfQuestions1 - 1) {
            if (answerChecked === false) {
                document.getElementById('endQuiz').click();
            }
        } else {
            document.getElementById('submit').click();
        }
        updateButtonsVisibility();
    }
}

function updateButtonsVisibility() {
    if (currentQuestion === numberOfQuestions1 - 1) {
        document.getElementById('submit').style.display = 'none';
        document.getElementById('endQuiz').style.display = 'block';
    } else {
        document.getElementById('submit').style.display = 'block';
        document.getElementById('endQuiz').style.display = 'none';
    }
}

function checkIfNoneExists(answers) {
    for (const answer of answers) {
        if (answer.toLowerCase() === '�adne z powy�szych') {
            return true;
        }
    }
    return false;
}


function showAllAnswers() {
    const answersContainer = document.getElementById('allAnswers');
    answersContainer.innerHTML = '';

    quizData.forEach((data, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<h3>Pytanie ${index + 1}: ${data.question}</h3>`;

        const correctAnswerIndex = data.correctAnswer;
        const correctAnswer = odpowiedzi[index][correctAnswerIndex].answer;
        const userAnswerIndex = odpowiedzi[index].findIndex(answer => answer.index === data.userAnswer);


        odpowiedzi[index].forEach((answer, answerIndex) => {
            const answerElement = document.createElement('p');

            if (answer.index === data.userAnswer) {
                answerElement.style.color = 'red';
            }
            if (answer.index === correctAnswerIndex) {
                answerElement.style.color = 'green';
            }

            answerElement.innerHTML = `${answerIndex + 1}. ${answer.answer}`;
            questionElement.appendChild(answerElement);
        });

        answersContainer.appendChild(questionElement);
    });

    document.getElementById('allAnswers').style.display = 'block';
}




function restartQuiz() {
    document.getElementById('results').style.display = 'none'; // Ukryj wyniki
    document.getElementById('quizContent').style.display = 'block'; // Wy�wietl zawarto�� quizu

    document.getElementById('allAnswers').style.display = 'none'; // Ukryj wszystkie odpowiedzi
    document.getElementById('results').style.display = 'block'; // Wy�wietl wyniki

    document.getElementById('showResults').style.display = 'none';
    document.getElementById('newQuiz').style.display = 'none';
    results.style.display = "none";

    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczb� poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczb� b��dnych odpowiedzi



    fetchData(); // Pobierz dane z pliku JSON
}   

function updateStats(isCompleted, isPassed) {
    const attempts = parseInt(localStorage.getItem('attempts') || '0') + 1;
    const completed = parseInt(localStorage.getItem('completed') || '0') + (isCompleted ? 1 : 0);
    const passed = parseInt(localStorage.getItem('passed') || '0') + (isPassed ? 1 : 0);

    localStorage.setItem('attempts', attempts);
    localStorage.setItem('completed', completed);
    localStorage.setItem('passed', passed);
} 

function updateStatsDisplay() {
    document.getElementById('attempts').textContent = localStorage.getItem('attempts') || '0';
    document.getElementById('completed').textContent = localStorage.getItem('completed') || '0';
    document.getElementById('passed').textContent = localStorage.getItem('passed') || '0';
}