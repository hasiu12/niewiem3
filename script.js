// Zmienne globalne
let currentQuestion = 0; // Indeks aktualnego pytania
let userAnswer; // Wybrana przez u�ytkownika odpowied�
let answerChecked = false; // Czy odpowied� zosta�a sprawdzona
let correctAnswers = 0; // Liczba poprawnych odpowiedzi
let wrongAnswers = 0; // Liczba b��dnych odpowiedzi
let quizData; // Dane z pliku JSON
let initialDataLoaded = false; // Czy dane zosta�y ju� wczytane
let isLastAnswerNone = false;

// Funkcja pobieraj�ca dane z pliku JSON
 async function fetchData() {
    console.log('Fetching quiz data...');
     if (!initialDataLoaded) {

        // Pobierz dane z pliku JSON

        const response = await fetch('quiz_data.json');
        quizData = await response.json();
        initialDataLoaded = true;

     }
     // Przemieszaj pytania
     shuffleArray(quizData);

    displayQuestion();
}


document.getElementById('startQuiz').addEventListener('click', function () {
    document.getElementById('startQuiz').style.display = 'none'; // Ukryj przycisk "Rozpocznij quiz"
    document.getElementById('quizContent').style.display = 'block'; // Wy�wietl zawarto�� quizu
    document.getElementById('instructions1').style.display = 'none';
    document.getElementById('instructions2').style.display = 'none';
    fetchData(); // Pobierz dane z pliku JSON
});

document.getElementById('submit').addEventListener('click', function () {
    if (!answerChecked) {
        // Pobierz zaznaczon� odpowied�
        const checkedAnswer = document.querySelector('input[name="answer"]:checked');

        if (checkedAnswer) {
            userAnswer = parseInt(checkedAnswer.value); // Przekszta�� warto�� zaznaczonej odpowiedzi na liczb�
            checkAnswer(); // Sprawd� odpowied�
            answerChecked = true;
        } else {
            alert('Wybierz odpowied� przed sprawdzeniem!'); // Wy�wietl ostrze�enie, je�li nie zaznaczono �adnej odpowiedzi
        }
    }
});

document.getElementById('endQuiz').addEventListener('click', function () {

    // Sprawdzanie ostatniej odpowiedzi
    if (!answerChecked) {
        const checkedAnswer = document.querySelector('input[name="answer"]:checked');
        if (checkedAnswer) {
            userAnswer = parseInt(checkedAnswer.value);
            const correctAnswer = quizData[currentQuestion].correctAnswer;

            if (userAnswer === correctAnswer) {
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
            answerChecked = true;
        } else {
            alert('Wybierz odpowied� przed zako�czeniem quizu!');
            return;
        }
    }

    document.getElementById('quizContent').style.display = 'none'; // Ukryj zawarto�� quizu
    document.getElementById('results').style.display = 'block'; // Wy�wietl wyniki
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('score-text');
    scoreElement.innerHTML = `Poprawne odpowiedzi: ${correctAnswers}<br><br> B\u0142\u0119dne odpowiedzi: ${wrongAnswers}<br>`;
    scoreElement.style.textAlign = 'center'; // Wy�wietl liczb� poprawnych i b��dnych odpowiedzi
    document.getElementById('newQuiz').style.display = 'block'; // Wy�wietl przycisk "Nowy quiz"
});

document.getElementById('newQuiz').addEventListener('click', function () {
    document.getElementById('results').style.display = 'none'; // Ukryj wyniki
    document.getElementById('quizContent').style.display = 'block'; // Wy�wietl zawarto�� quizu
    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczb� poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczb� b��dnych odpowiedzi
    console.log('Displaying newQuiz...');
    displayQuestion(); // Wy�wietl pytanie
});


// Funkcja tworz�ca element HTML z odpowiedzi�
function createAnswerElement(answer, index, shuffledIndex) {
    const li = document.createElement('li'); // Stw�rz element listy
    const input = document.createElement('input'); // Stw�rz element input
    const label = document.createElement('label'); // Stw�rz element label



    // Ustaw atrybuty dla elementu input
    input.type = 'radio';
    input.name = 'answer';
    input.value = index;
    input.id = `answer-${index}`;

    // Ustaw atrybuty dla elementu label
    label.htmlFor = `answer-${index}`;
    label.textContent = answer;

    // Dodaj elementy input i label do elementu listy
    li.appendChild(input);
    li.appendChild(label);

    label.htmlFor = `answer-${index}`;
    label.textContent = answer;
    label.classList.add('answer-text'); // Dodaj klas� 'answer-text'

    return li; // Zwr�� element listy z odpowiedzi�
}


// Funkcja sprawdzaj�ca odpowied� i zliczaj�ca wyniki
function checkAnswer() {
    const resultElement = document.getElementById('result'); // Pobierz element wy�wietlaj�cy wynik
    const correctAnswer = quizData[currentQuestion].correctAnswer; // Pobierz poprawn� odpowied� z danych

    // Je�li odpowied� u�ytkownika to "�adne z powy�szych" i losowo (30% szans) zamieniona odpowied� jest poprawna, zwi�ksz liczb� poprawnych odpowiedzi
    if (userAnswer === -1 && Math.random() < 0.3) {
        correctAnswers++;
    } else if (userAnswer === correctAnswer) { // Je�li odpowied� u�ytkownika jest poprawna, zwi�ksz liczb� poprawnych odpowiedzi
        correctAnswers++;
    } else { // W przeciwnym przypadku zwi�ksz liczb� b��dnych odpowiedzi
        wrongAnswers++;
    }

    currentQuestion++; // Przejd� do nast�pnego pytania

    // Je�li istnieje kolejne pytanie, wy�wietl je po kr�tkiej przerwie
    if (currentQuestion < quizData.length) {
        setTimeout(() => {
            displayQuestion(); // Wy�wietl pytanie
            resetAnswer(); // Zresetuj zaznaczenie odpowiedzi
        }, 10);
    }
}

// Funkcja wy�wietlaj�ca pytanie i odpowiedzi na stronie
async function displayQuestion() {
    const questionElement = document.getElementById('question'); // Pobierz element z pytaniem
    const answersElement = document.getElementById('answers'); // Pobierz element z odpowiedziami

    // Ustaw tekst pytania
    questionElement.textContent = quizData[currentQuestion].question;
    answersElement.innerHTML = '';

    // Utw�rz kopi� odpowiedzi i przetasuj je
    const answersCopy = quizData[currentQuestion].answers.map((answer, index) => ({ answer, index }));
    shuffleArray(answersCopy);

    // Wy�wietl odpowiedzi na stronie
    answersCopy.forEach(({ answer, index }) => {
        const li = createAnswerElement(answer, index);
        answersElement.appendChild(li);
    });

    // Zamie� ostatni� odpowied� na "�adne z powy�szych" z 30% szansami
    if (Math.random() < 0.3) {
        replaceLastAnswerWithNone(answersElement);
    }

    //Obs�uga zdarze� klawisza "keydown"
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
        if (currentQuestion === quizData.length - 1) {
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
    if (currentQuestion === quizData.length - 1) {
        document.getElementById('submit').style.display = 'none';
        document.getElementById('endQuiz').style.display = 'block';
    } else {
        document.getElementById('submit').style.display = 'block';
        document.getElementById('endQuiz').style.display = 'none';
    }
}