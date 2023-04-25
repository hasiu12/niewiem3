// Zmienne globalne
let currentQuestion = 0; // Indeks aktualnego pytania
let userAnswer; // Wybrana przez u¿ytkownika odpowiedŸ
let answerChecked = false; // Czy odpowiedŸ zosta³a sprawdzona
let correctAnswers = 0; // Liczba poprawnych odpowiedzi
let wrongAnswers = 0; // Liczba b³êdnych odpowiedzi
let quizData; // Dane z pliku JSON
let initialDataLoaded = false; // Czy dane zosta³y ju¿ wczytane
let isLastAnswerNone = false;
const noneOfTheAboveOption = '¿adne z powy¿szych';
const numberOfQuestions = 15;
let odpowiedzi = new Array(numberOfQuestions);
let userAnswers = new Array(numberOfQuestions).fill(null);


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

     numberOfQuestions1 = Math.min(quizData.length, numberOfQuestions);


    displayQuestion();
}


document.getElementById('startQuiz').addEventListener('click', function () {
    answerChecked = false;
    updateStats(false, false);
    updateStatsDisplay();
    document.getElementById('quiz-stats').style.display = 'none';

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
            // Usuñ event listener na zdarzenie 'keydown' przed wyœwietleniem alertu
            document.removeEventListener('keydown', handleNumericKeyPress);

            alert('Wybierz odpowiedŸ przed sprawdzeniem!'); // Wyœwietl ostrze¿enie, jeœli nie zaznaczono ¿adnej odpowiedzi

            // Dodaj ponownie event listener na zdarzenie 'keydown' po zamkniêciu alertu
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
            alert('Wybierz odpowiedŸ przed zakoñczeniem quizu!');
            return;
        }
    }
    const isCompleted = true; // Quiz zawsze zostanie ukoñczony, gdy wywo³asz tê funkcjê
    const isPassed = (correctAnswers / quizData.length) >= 0.75;
    updateStats(isCompleted, isPassed);
    updateStatsDisplay();
    document.getElementById('quiz-stats').style.display = 'block';


    document.getElementById('quizContent').style.display = 'none'; // Ukryj zawartoœæ quizu
    document.getElementById('results').style.display = 'block'; // Wyœwietl wyniki
    const scoreElement = document.getElementById('score');
    scoreElement.classList.add('score-text');
    scoreElement.innerHTML = `Poprawne odpowiedzi: ${correctAnswers}<br><br> B\u0142\u0119dne odpowiedzi: ${wrongAnswers}<br>`;
    scoreElement.style.textAlign = 'center'; // Wyœwietl liczbê poprawnych i b³êdnych odpowiedzi
    document.getElementById('showResults').style.display = 'inline-block';
    document.getElementById('newQuiz').style.display = 'block'; // Wyœwietl przycisk "Nowy quiz"
});

document.getElementById('showResults').addEventListener('click', function () {
   
    showAllAnswers();
});



document.getElementById('newQuiz').addEventListener('click', function () {

    restartQuiz();

});

