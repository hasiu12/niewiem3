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

    // Dodaj klas� 'answer-container' do elementu answerContainer
    answerContainer.classList.add('answer-container');
    // Dodaj element input do answerContainer
    answerContainer.appendChild(input);

    // Dodaj elementy input i label do elementu listy
    answerContainer.appendChild(label);
    li.appendChild(answerContainer);

    // Aktualizacja atrybut�w elementu label
    label.htmlFor = `answer-${index}`;
    label.textContent = answer;
    label.classList.add('answer-text'); // Dodaj klas� 'answer-text'

    return li; // Zwr�� element listy z odpowiedzi�
}

function endQuiz() {
    // Sprawdzanie ostatniej odpowiedzi
    if (!answerChecked) {
        const checkedAnswer = document.querySelector('input[name="answer"]:checked');
        if (checkedAnswer) {
            const checkedValue = parseInt(checkedAnswer.value);
            if (checkedValue === -1) {
                userAnswer = '�adne z powy�szych';
            } else {
                userAnswer = checkedValue;
            }
            const correctAnswer = quizData[currentQuestion].correctAnswer;

            if (userAnswer === correctAnswer) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
            answerChecked = true;
        } else {
            // alert('Wybierz odpowied� przed zako�czeniem quizu!');
            return;
        }
    }
    quizData[currentQuestion].userAnswer = userAnswer; // Zapisz odpowied� u�ytkownika w quizData

    const isCompleted = true; // Quiz zawsze zostanie uko�czony, gdy wywo�asz t� funkcj�
    const isPassed = (correctAnswers / numberOfQuestions) >= 0.65;
    updateStats(isCompleted, isPassed);
    updateStatsDisplay();
    visualEndQuiz(isPassed);
}


// Funkcja zamieniaj�ca ostatni� odpowied� na "�adne z powy�szych"
function replaceLastAnswerWithNone(answersElement, answers) {
    const noneExists = checkIfNoneExists(answers);
    const allExists = checkIfAllExists(answers);

    if (!noneExists && !allExists) {
        const lastIndex = answers.length - 1;

        // Pobierz ostatni element odpowiedzi
        const lastAnswer = answersElement.children[lastIndex];
        const input = lastAnswer.querySelector('input');
        const label = lastAnswer.querySelector('label');

        // Zaktualizuj atrybuty dla ostatniej odpowiedzi
        input.value = -1;
        input.id = `answer-${lastIndex}`;
        label.htmlFor = `answer-${lastIndex}`;
        label.textContent = '\u017badne z powy\u017cszych';

        // Zaktualizuj list� odpowiedzi
        answers[lastIndex].answer = '�adne z powy�szych';
    }
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

    if (numericKeys.includes(key)) {
        let answerIndex = parseInt(key) - 1;
        const answerInput = document.getElementById(`answer-${answersCopy[answerIndex].index}`);
        if (answerInput) {
            answerInput.checked = true;
        }
    } else if (key === ' ') {
        event.preventDefault(); // Zapobiegamy domy�lnemu dzia�aniu spacji (przewijanie strony)
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

function checkIfNoneExists(answers) {
    for (const answer of answers) {
        if (answer.toLowerCase() === '�adne z powy�szych') {
            return true;
        }
    }
    return false;
}

function checkIfAllExists(answers) {
    for (const answer of answers) {
        if (answer.toLowerCase() === 'wszystkie powy�sze') {
            return true;
        }
    }
    return false;
}

function showAllAnswers() {
    kblisko();
    document.getElementById('menu').style.display = 'block'; // Wy�wietl wyniki
    const answersContainer = document.getElementById('allAnswers');
    answersContainer.innerHTML = '';
    odpowiedzi = odpowiedzi.slice(0, numberOfQuestions);
    quizData.forEach((data, index) => {
        if (!odpowiedzi[index]) {
            return;
        }

        const questionElement = document.createElement('div');

        // Dodaj warunek sprawdzaj�cy warto�� zmiennej "variant"
        if (variant) {
            const explainButton = document.createElement('button');
            explainButton.textContent = 'Wyja�nij';
            explainButton.addEventListener('click', () => {
                // Dodaj funkcj�, kt�ra b�dzie wykonywana po klikni�ciu przycisku Wyja�nij
                explainAnswer(index);
            });
            questionElement.appendChild(explainButton);
        }

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

function explainAnswer(questionIndex) {
    const explanation = quizData[questionIndex].explanation;
    alert(explanation);
}

function restartQuiz() {
    visualResetQuizz();
    variant = false;
    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczb� poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczb� b��dnych odpowiedzi

    fetchData(); // Pobierz dane z pliku JSON
}   
