let sum = 0;

let template = document.getElementsByTagName("template")[0];
async function getQuestions() {
    let questions = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);


    console.dir(questions);
    
    //ciclo le domande una per una
    let questionIndex = 0;
    displayQuestion(questionIndex)
    
    function displayQuestion(index) {
        if (index >= questions.length) {
            return;
        }
    
        let question = questions[index];
        let clone = template.content.cloneNode(true);

        for (let question of questions) {
        

        
        //creo un array vuoto e pusho tutte le domande
        let options = [];
        options.push(question["correct_answer"]);
        for (let element of question["incorrect_answers"]) {
            options.push(element);
        }

        //salvo in una variabile la risposta corretta
        let correctAnswer = question["correct_answer"];
        
        //con la funzione shuffleArray() mescolo gli elementi contenuti nell'array
        shuffleArray(options);

        //stampo i bottoni con le risposte
        for (let risposta of options) {
            //seleziono l'elemento con l'id #domanda e gli cambio il contenuto
            let domanda = clone.querySelector('#domanda');
            domanda.textContent = question.question;

            let bottone = document.createElement('button');
            bottone.textContent = risposta;

            bottone.addEventListener('click', () => {
                clearInterval(timerInterval);
                target.innerHTML = '';
                displayQuestion(index + 1);
            });
            //AGGIUNGERE LE VARIE CLASSI AL BOTTONE
            let buttonContainer = clone.querySelector('#button-container');
            // bottone.classList.add('');
            buttonContainer.append(bottone);
            
        }

        let tempo = 0;
        //salvo la difficoltà in una variabile
        let difficulty = question.difficulty;

            switch (true) {
                case difficulty == 'easy':
                    tempo = 16;
                    break;
                case difficulty == 'medium':
                    tempo = 40;
                    break;
                case difficulty == 'hard':
                    tempo = 60;
                    break;
                default:
                    tempo = 5;
            }

        //faccio partire il timer
        const FULL_DASH_ARRAY = 283;
        let TIME_LIMIT = tempo;
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;

        clone.getElementById("app").innerHTML = `
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

        startTimer();

        function onTimesUp() {
            clearInterval(timerInterval);
        }
        
        function startTimer() {
            timerInterval = setInterval(() => {
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
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


        let target = document.getElementById("target")
        target.appendChild(clone);
        console.log(target)
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

}


//eseguo la funzione getQuestions
getQuestions()