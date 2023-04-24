// Zmienne globalne
let currentQuestion = 0; // Indeks aktualnego pytania
let userAnswer; // Wybrana przez u¿ytkownika odpowiedŸ
let answerChecked = false; // Czy odpowiedŸ zosta³a sprawdzona
let correctAnswers = 0; // Liczba poprawnych odpowiedzi
let wrongAnswers = 0; // Liczba b³êdnych odpowiedzi
let quizData; // Dane z pliku JSON
let initialDataLoaded = false; // Czy dane zosta³y ju¿ wczytane
let isLastAnswerNone = false;

// Funkcja pobieraj¹ca dane z pliku JSON
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
    document.getElementById('quizContent').style.display = 'block'; // Wyœwietl zawartoœæ quizu
    document.getElementById('instructions1').style.display = 'none';
    document.getElementById('instructions2').style.display = 'none';
    fetchData(); // Pobierz dane z pliku JSON
});

document.getElementById('submit').addEventListener('click', function () {
    if (!answerChecked) {
        // Pobierz zaznaczon¹ odpowiedŸ
        const checkedAnswer = document.querySelector('input[name="answer"]:checked');

        if (checkedAnswer) {
            userAnswer = parseInt(checkedAnswer.value); // Przekszta³æ wartoœæ zaznaczonej odpowiedzi na liczbê
            checkAnswer(); // SprawdŸ odpowiedŸ
            answerChecked = true;
        } else {
            alert('Wybierz odpowiedŸ przed sprawdzeniem!'); // Wyœwietl ostrze¿enie, jeœli nie zaznaczono ¿adnej odpowiedzi
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
            alert('Wybierz odpowiedŸ przed zakoñczeniem quizu!');
            return;
        }
    }

    document.getElementById('quizContent').style.display = 'none'; // Ukryj zawartoœæ quizu
    document.getElementById('results').style.display = 'block'; // Wyœwietl wyniki
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('score-text');
    scoreElement.innerHTML = `Poprawne odpowiedzi: ${correctAnswers}<br><br> B\u0142\u0119dne odpowiedzi: ${wrongAnswers}<br>`;
    scoreElement.style.textAlign = 'center'; // Wyœwietl liczbê poprawnych i b³êdnych odpowiedzi
    document.getElementById('newQuiz').style.display = 'block'; // Wyœwietl przycisk "Nowy quiz"
});

document.getElementById('newQuiz').addEventListener('click', function () {
    document.getElementById('results').style.display = 'none'; // Ukryj wyniki
    document.getElementById('quizContent').style.display = 'block'; // Wyœwietl zawartoœæ quizu
    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczbê poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczbê b³êdnych odpowiedzi
    console.log('Displaying newQuiz...');
    displayQuestion(); // Wyœwietl pytanie
});


// Funkcja tworz¹ca element HTML z odpowiedzi¹
function createAnswerElement(answer, index, shuffledIndex) {
    const li = document.createElement('li'); // Stwórz element listy
    const input = document.createElement('input'); // Stwórz element input
    const label = document.createElement('label'); // Stwórz element label



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
    label.classList.add('answer-text'); // Dodaj klasê 'answer-text'

    return li; // Zwróæ element listy z odpowiedzi¹
}


// Funkcja sprawdzaj¹ca odpowiedŸ i zliczaj¹ca wyniki
function checkAnswer() {
    const resultElement = document.getElementById('result'); // Pobierz element wyœwietlaj¹cy wynik
    const correctAnswer = quizData[currentQuestion].correctAnswer; // Pobierz poprawn¹ odpowiedŸ z danych

    // Jeœli odpowiedŸ u¿ytkownika to "¿adne z powy¿szych" i losowo (30% szans) zamieniona odpowiedŸ jest poprawna, zwiêksz liczbê poprawnych odpowiedzi
    if (userAnswer === -1 && Math.random() < 0.3) {
        correctAnswers++;
    } else if (userAnswer === correctAnswer) { // Jeœli odpowiedŸ u¿ytkownika jest poprawna, zwiêksz liczbê poprawnych odpowiedzi
        correctAnswers++;
    } else { // W przeciwnym przypadku zwiêksz liczbê b³êdnych odpowiedzi
        wrongAnswers++;
    }

    currentQuestion++; // PrzejdŸ do nastêpnego pytania

    // Jeœli istnieje kolejne pytanie, wyœwietl je po krótkiej przerwie
    if (currentQuestion < quizData.length) {
        setTimeout(() => {
            displayQuestion(); // Wyœwietl pytanie
            resetAnswer(); // Zresetuj zaznaczenie odpowiedzi
        }, 10);
    }
}

// Funkcja wyœwietlaj¹ca pytanie i odpowiedzi na stronie
async function displayQuestion() {
    const questionElement = document.getElementById('question'); // Pobierz element z pytaniem
    const answersElement = document.getElementById('answers'); // Pobierz element z odpowiedziami

    // Ustaw tekst pytania
    questionElement.textContent = quizData[currentQuestion].question;
    answersElement.innerHTML = '';

    // Utwórz kopiê odpowiedzi i przetasuj je
    const answersCopy = quizData[currentQuestion].answers.map((answer, index) => ({ answer, index }));
    shuffleArray(answersCopy);

    // Wyœwietl odpowiedzi na stronie
    answersCopy.forEach(({ answer, index }) => {
        const li = createAnswerElement(answer, index);
        answersElement.appendChild(li);
    });

    // Zamieñ ostatni¹ odpowiedŸ na "¿adne z powy¿szych" z 30% szansami
    if (Math.random() < 0.3) {
        replaceLastAnswerWithNone(answersElement);
    }

    //Obs³uga zdarzeñ klawisza "keydown"
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
    const isNoneAnswer = answersCopy[noneAnswerIndex].answer === '¯adne z powy¿szych';

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