// Funkcja tworz¹ca element HTML z odpowiedzi¹
function createAnswerElement(answer, index, shuffledIndex) {
    const li = document.createElement('li'); // Stwórz element listy
    const input = document.createElement('input'); // Stwórz element input
    const label = document.createElement('label'); // Stwórz element label
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
        // SprawdŸ, czy input nie jest ju¿ zaznaczony
        if (!input.checked) {
            // Jeœli nie, zaznacz go
            input.checked = true;
        }
    });

    // Dodaj zdarzenie click do elementu input
    input.addEventListener('click', (event) => {
        // Zapobiegaj podwójnemu wywo³aniu zdarzenia click
        event.stopPropagation();
    });


    answerContainer.classList.add('answer-container');
    answerContainer.appendChild(input);

    // Dodaj elementy input i label do elementu listy
    answerContainer.appendChild(label);
    li.appendChild(answerContainer);

    label.htmlFor = `answer-${index}`;
    label.textContent = answer;
    label.classList.add('answer-text'); // Dodaj klasê 'answer-text'

    return li; // Zwróæ element listy z odpowiedzi¹
}

// Funkcja sprawdzaj¹ca odpowiedŸ i zliczaj¹ca wyniki
function checkAnswer() {
    const correctAnswer = quizData[currentQuestion].correctAnswer;

 if (userAnswer === correctAnswer) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }

    quizData[currentQuestion].userAnswer = userAnswer; // Zapisz odpowiedŸ u¿ytkownika w quizData

    currentQuestion++;

    if (currentQuestion < numberOfQuestions) {
        setTimeout(() => {
            displayQuestion();
            resetAnswer();
        }, 10);
    }
}


// Funkcja wyœwietlaj¹ca pytanie i odpowiedzi na stronie
async function displayQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');

    // Poprawiony napis "Pytanie x/numberOfQuestions1"
    questionElement.innerHTML = `Pytanie ${currentQuestion + 1}/${numberOfQuestions}:<br> ${quizData[currentQuestion].question}`;

    answersElement.innerHTML = '';

    const answersCopy = quizData[currentQuestion].answers.map((answer, index) => ({ answer, index }));
    const shuffledAnswers = shuffleArray1(answersCopy);
    odpowiedzi[currentQuestion] = shuffledAnswers;
 

    answersCopy.forEach(({ answer, index }) => {
        const li = createAnswerElement(answer, index);
        answersElement.appendChild(li);
    });

    // Zamieñ ostatni¹ odpowiedŸ na "¿adne z powy¿szych" z 30% szansami
  //  if (Math.random() < 0.3 && !checkIfNoneExists(quizData[currentQuestion].answers)) {
   //     replaceLastAnswerWithNone(answersElement);
   //}

    // Obs³uga zdarzeñ klawisza "keydown"
    document.addEventListener('keydown', (event) => handleNumericKeyPress(event, answersCopy));

    questionElement.classList.add('question-text');


    // Jeœli jesteœmy przy ostatnim pytaniu, ukryj przycisk "Nastêpne pytanie" i wyœwietl przycisk "Zakoñcz quiz"
    updateButtonsVisibility();
    resetAnswer();
}


// Funkcja zamieniaj¹ca ostatni¹ odpowiedŸ na "¿adne z powy¿szych"
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

// Funkcja mieszaj¹ca elementy tablicy
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

// Funkcja resetuj¹ca zaznaczenie odpowiedzi
function resetAnswer() {
    const checkedAnswer = document.querySelector('input[name="answer"]:checked'); // Pobierz zaznaczon¹ odpowiedŸ
    if (checkedAnswer) {
        checkedAnswer.checked = false; // Odznacz zaznaczon¹ odpowiedŸ
    }
    answerChecked = false; // Ustaw, ¿e odpowiedŸ nie zosta³a sprawdzona
}


function handleNumericKeyPress(event, answersCopy) {
    const key = event.key;
    const numericKeys = ['1', '2', '3', '4', '5'];
    const noneAnswerIndex = quizData[currentQuestion].answers.length - 1;
    const isNoneAnswer = answersCopy[noneAnswerIndex].answer === '¿adne z powy¿szych';

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
        event.preventDefault(); // Zapobiegamy domyœlnemu dzia³aniu spacji (przewijanie strony)
        if (currentQuestion === numberOfQuestions - 1) {
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
    if (currentQuestion === numberOfQuestions - 1) {
        document.getElementById('submit').style.display = 'none';
        document.getElementById('endQuiz').style.display = 'block';
    } else {
        document.getElementById('submit').style.display = 'block';
        document.getElementById('endQuiz').style.display = 'none';
    }
}

function checkIfNoneExists(answers) {
    for (const answer of answers) {
        if (answer.toLowerCase() === '¿adne z powy¿szych') {
            return true;
        }
    }
    return false;
}
function checkIfAllExists(answers) {
    for (const answer of answers) {
        if (answer.toLowerCase() === 'wszystkie powy¿sze') {
            return true;
        }
    }
    return false;
}

function showAllAnswers() {
    kblisko();

    const answersContainer = document.getElementById('allAnswers');
    answersContainer.innerHTML = '';
    odpowiedzi = odpowiedzi.slice(0, numberOfQuestions);
    quizData.forEach((data, index) => {
        if (!odpowiedzi[index]) {
            return;
        }

        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<h3>Pytanie ${index + 1}: ${data.question}</h3>`;

        if (odpowiedzi[index].length > 0) {
            const correctAnswerIndex = data.correctAnswer;

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
                answerElement.classList.add('answer-container');
                answerElement.style.cursor = 'default';
            });
        }

        answersContainer.appendChild(questionElement);
    });


    document.getElementById('allAnswers').style.display = 'block';
}






function restartQuiz() {
    visualResetQuizz();

    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczbê poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczbê b³êdnych odpowiedzi

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

function podzielPytaniaNaQuizy(pytania, liczbaQuizow, pytaniaNaQuiz) {
    const podzielonePytania = [];

    shuffle(pytania);

    for (let i = 0; i < liczbaQuizow; i++) {
        const start = i * pytaniaNaQuiz;
        const koniec = start + pytaniaNaQuiz;
        const quiz = pytania.slice(start, koniec);
        podzielonePytania.push(quiz);
    }

    return podzielonePytania;
}

function generateQuizzes(allQuestions) {
    const numberOfQuizzes = 9;
    const questionsPerQuiz = 15;

    for (let i = 0; i < numberOfQuizzes; i++) {
        const startIndex = i * questionsPerQuiz;
        const endIndex = startIndex + questionsPerQuiz;
        const quizQuestions = allQuestions.slice(startIndex, endIndex);
        quizzes.push(quizQuestions);
    }
}



function startSelectedQuiz(quizIndex) {
    if (quizzes[quizIndex]) {
        // Resetowanie stanu quizu
        currentQuestion = 0;
        score = 0;
        answeredQuestions = 0;
        correctAnswers = [];
        odpowiedzi = [];
        quizData = quizzes[quizIndex];
        visualNewQuizz()
        displayQuestion();
        variant = true;
    }
}
function handleQuizButtonClick(event) {
    const quizIndex = event.target.dataset.quizIndex;
    if (quizIndex !== undefined) {
        startSelectedQuiz(parseInt(quizIndex));
    }
}