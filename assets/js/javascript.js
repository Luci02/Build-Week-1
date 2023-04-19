//seleziono il template che ho fatto in html
let template = document.getElementsByTagName('template')[0];
let contatore = 0;
let risposte = {
    giuste: 0,
    sbagliate: 0,
}

async function getQuestions() {
    let questions = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    console.dir(questions);

    const FULL_DASH_ARRAY = 283;
    let TIME_LIMIT = 0;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;

    //clono il contenuto, generando ogni volta un nuovo clone
    let clone = template.content.cloneNode(true);

    //creo un array vuoto e pusho tutte le domande
    let options = [];
    options.push(questions[contatore]["correct_answer"]);
    for (let element of questions[contatore]["incorrect_answers"]) {
        options.push(element);
    }

    //con la funzione shuffleArray() mescolo gli elementi contenuti nell'array
    shuffleArray(options);

    let buttonContainer = clone.querySelector('#button-container');
    console.log(options);

    //stampo i bottoni con le risposte
    for (let risposta of options) {
        //seleziono l'elemento con l'id #domanda e gli cambio il contenuto
        let domanda = clone.querySelector('#domanda');
        domanda.textContent = questions[contatore].question;

        let bottone = document.createElement('button');
        bottone.textContent = risposta;

        //AGGIUNGERE LE VARIE CLASSI AL BOTTONE
        // bottone.classList.add('');
        buttonContainer.append(bottone);
    }

    //aggiungo l'evento click ed aumento l'indice
    for (let bottone of buttonContainer.children) {
        bottone.addEventListener('click', function () {
            if (this.textContent == questions[contatore]["correct_answer"]) {
                risposte.giuste++;
            } else {
                risposte.sbagliate++;
            }
        });
    }

    switch (true) {
        case questions[contatore].difficulty == 'easy':
            TIME_LIMIT = 3;
            break;
        case questions[contatore].difficulty == 'medium':
            TIME_LIMIT = 5;
            break;
        case questions[contatore].difficulty == 'hard':
            TIME_LIMIT = 6;
            break;
        default:
            TIME_LIMIT = 5;
    }


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

    //faccio partire il timer
    startTimer();


    //definisco un'area in cui inserire il clone
    let target = document.getElementById("target");

    //inserisco il clone
    target.append(clone);

    //funzioni relative al timer
    function onTimesUp() {
        clearInterval(timerInterval);
        contatore++;
        clearTarget();
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
        for (let bottone of buttonContainer.children) {
            bottone.addEventListener('click', function () {
                clearInterval(timerInterval);
                contatore++;
                clearTarget();
            });
        }
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

    function clearTarget() {
        //controlla se ci sono domande rimanenti
        if (contatore < questions.length) {
            document.getElementById('target').innerHTML = '';

            //mostra le domande
            getQuestions();
        } else {

            //se non ci sono domande mostra il punteggio
            document.getElementById('target').innerHTML = `
            <p>Giuste: ${risposte.giuste}</p>
            <p>Sbagliate: ${risposte.sbagliate}</p>
            `;
        }
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

//eseguo la funzione getQuestions
getQuestions();