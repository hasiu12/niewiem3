// Zmienne globalne
let currentQuestion = 0; // Indeks aktualnego pytania
let userAnswer; // Wybrana przez u�ytkownika odpowied�
let answerChecked = false; // Czy odpowied� zosta�a sprawdzona
let correctAnswers = 0; // Liczba poprawnych odpowiedzi
let wrongAnswers = 0; // Liczba b��dnych odpowiedzi
let quizData; // Dane z pliku JSON
let initialDataLoaded = false; // Czy dane zosta�y ju� wczytane
let isLastAnswerNone = false;
const noneOfTheAboveOption = '�adne z powy�szych';
const numberOfQuestions = 15;
let odpowiedzi = [];
let userAnswers = new Array(numberOfQuestions).fill(null);
let devMode = false; // Zmienna przechowuj�ca stan trybu deweloperskiego


// Funkcja pobieraj�ca dane z pliku JSON
async function fetchData() {
    console.log('Fetching quiz data...');
    if (!initialDataLoaded) {
        // Pobierz dane z pliku JSON
        const response = await fetch('quiz_data.json');
        quizData = await response.json();
        initialDataLoaded = true;
    }



    displayQuestion();
}


document.getElementById('startQuiz').addEventListener('click', function () {
    answerChecked = false;
    updateStats(false, false);
    updateStatsDisplay();
    document.getElementById('quiz-stats').style.display = 'none';

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
            // Usu� event listener na zdarzenie 'keydown' przed wy�wietleniem alertu
            document.removeEventListener('keydown', handleNumericKeyPress);

            alert('Wybierz odpowied� przed sprawdzeniem!'); // Wy�wietl ostrze�enie, je�li nie zaznaczono �adnej odpowiedzi

            // Dodaj ponownie event listener na zdarzenie 'keydown' po zamkni�ciu alertu
            document.addEventListener('keydown', (event) => handleNumericKeyPress(event, answersCopy));
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
    quizData[currentQuestion].userAnswer = userAnswer; // Zapisz odpowied� u�ytkownika w quizData

    const isCompleted = true; // Quiz zawsze zostanie uko�czony, gdy wywo�asz t� funkcj�
    const isPassed = (correctAnswers /numberOfQuestions) >= 0.65;
    updateStats(isCompleted, isPassed);
    updateStatsDisplay();
    
    const quizStats = document.getElementById('quiz-stats');
    const bilsko = document.getElementById('bilsko');
    const kox = document.getElementById('kox');


    if (isPassed === true) {
        kox.style.display = 'block';
        kox.style.margin = 'auto';
    }
    else {
        bilsko.style.display = 'block';
        bilsko.style.margin = 'auto';
    }

    quizStats.style.display = 'block';

    document.getElementById('quizContent').style.display = 'none'; // Ukryj zawarto�� quizu
    document.getElementById('results').style.display = 'block'; // Wy�wietl wyniki
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('score-text');
    scoreElement.innerHTML = `Poprawne odpowiedzi: ${correctAnswers}<br><br> B\u0142\u0119dne odpowiedzi: ${wrongAnswers}<br><br>`;
    scoreElement.style.textAlign = 'center'; // Wy�wietl liczb� poprawnych i b��dnych odpowiedzi

 
    document.getElementById('showResults').style.display = 'block';
    document.getElementById('newQuiz').style.display = 'block'; // Wy�wietl przycisk "Nowy quiz"
    
});

document.getElementById('showResults').addEventListener('click', function () {
    showAllAnswers();

});



document.getElementById('newQuiz').addEventListener('click', function () {

    restartQuiz();

});

document.addEventListener("keydown", (event) => {
    // Sprawd�, czy naci�ni�te zosta�y klawisze Ctrl, Shift i N
    if (event.ctrlKey && event.shiftKey && event.code === "KeyN") {
        toggleDevMode(); // Prze��cz tryb deweloperski
        event.preventDefault(); // Zapobiegnij domy�lnemu zachowaniu przegl�darki
    }
});