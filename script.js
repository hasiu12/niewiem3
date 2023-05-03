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
const numberOfQuestions = 3;
const allOfTheAboveOption = 'wszystkie powy�sze';
let odpowiedzi = [];
let userAnswers = new Array(numberOfQuestions).fill(null);
let quizzes = [];
let variant = false;



// Funkcja pobieraj�ca dane z pliku JSON
async function fetchData() {
    console.log('Fetching quiz data...');
    if (!initialDataLoaded) {
        // Pobierz dane z pliku JSON
        const response = await fetch('/quiz_data.json');
        quizData = await response.json(); // Pobierz wszystkie pytania
        const allQuestions = quizData.slice(); // Stw�rz kopi� wszystkich pyta�

        initialDataLoaded = true;
        generateQuizzes(allQuestions);
    }
    if (variant === false) {
        shuffleArray(quizData);
    }
     
    displayQuestion();
    
}

document.getElementById('startQuiz').addEventListener('click', function () {
    
    answerChecked = false;
    updateStats(false, false);
    updateStatsDisplay();
    visualNewQuizz()
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

           // alert('Wybierz odpowied� przed sprawdzeniem!'); // Wy�wietl ostrze�enie, je�li nie zaznaczono �adnej odpowiedzi

            // Dodaj ponownie event listener na zdarzenie 'keydown' po zamkni�ciu alertu
            document.addEventListener('keydown', (event) => handleNumericKeyPress(event, answersCopy));
        }
    }
});

document.getElementById('endQuiz').addEventListener('click', function () {
    endQuiz();
});

document.getElementById('showResults').addEventListener('click', function () {
    showAllAnswers();

});

document.getElementById('menu').addEventListener('click', function () {
    currentQuestion = 0; // Zresetuj indeks pytania
    correctAnswers = 0; // Zresetuj liczb� poprawnych odpowiedzi
    wrongAnswers = 0; // Zresetuj liczb� b��dnych odpowiedzi
    variant = false;
    visualMenu();

});

document.addEventListener('DOMContentLoaded', () => {
    
    const quizButtons = document.querySelectorAll('.quiz-btn');
    quizButtons.forEach((button) => {
        button.addEventListener('click', handleQuizButtonClick);
    });
    fetchData();
});

document.getElementById('newQuiz').addEventListener('click', function () {

    restartQuiz();

});

