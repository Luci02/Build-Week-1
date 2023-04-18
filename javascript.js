let sum = 0;
let options = []
let time
async function getQuestions() {
    let response = await fetch('https://opentdb.com/api.php?amount=10&category=18');
    let domande = await response.json();
    
    

    console.log(domande);

    //ciclo le domande una per una
    for (let question of domande.results) {
        
        //creo un array vuoto e pusho tutte le domande
        options = [];
        options.push(question["correct_answer"]);
        for (let element of question["incorrect_answers"]) {
            options.push(element);
        }

        //salvo in una variabile la risposta corretta
        let correctAnswer = question["correct_answer"];

        //con la funzione shuffleArray() mescolo gli elementi contenuti nell'array
        shuffleArray(options);

        //stampo le domande
        for (let risposta of options) {
            console.log(risposta);
            //salvo la difficoltà in una variabile
            let difficulty = risposta.difficulty;
            time = 0;

            switch (true) {
                case difficulty == 'easy':
                    time = 16;
                    break;
                case difficulty == 'medium':
                    time = 40;
                    break;
                case difficulty == 'hard':
                    time = 60;
                    break;
                    
            }
            console.log(difficulty)
            //seleziono l'elemento con l'id #domanda e gli cambio il contenuto
            // let domanda = document.querySelector('#domanda');
            // domanda.textContent = question.question;

            // let bottone = document.createElement('button');
            // bottone.textContent = risposta;

            //AGGIUNGERE LE VARIE CLASSI AL BOTTONE
            // let buttonContainer = document.querySelector('#button-container');
            // bottone.classList.add('');
            // buttonContainer.append(bottone);

        }

    }


//funzione per mescolare gli elementi di un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


console.log(options)
console.log(time)

const FULL_DASH_ARRAY = 283;
let TIME_LIMIT = time;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;


function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = (TIME_LIMIT - timePassed);
        document.getElementById("base-timer-label").innerHTML = `<p class="seconds">Seconds</p> 
        ${formatTime(timeLeft)}
        <p class="remaining">Remaining</p>`;
        setCircleDasharray();
        
        
        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    
    return `${seconds}`;
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    }
    
    startTimer();
    
    
    document.getElementById("app").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">
      <p class="seconds">Seconds</p>
      ${formatTime(timeLeft)}
      <p class="remaining">Remaining</p>
      </span>
    </div>
    `;
    
}


getQuestions() 










