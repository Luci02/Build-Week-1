//seleziono il template che ho fatto in html
let templateQuiz = document.getElementsByTagName('template')[0];
let contatore = 0;
let risposte = {
    giuste: 0,
    sbagliate: 0,
    "risposte date": [],
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
    let clone = templateQuiz.content.cloneNode(true);

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
            risposte["risposte date"].push(this.textContent);
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
        risposte.sbagliate++;
        contatore++;
        clearTarget();
        risposte["risposte date"].push('Risposta non data');
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

        let targetTemp = document.getElementById('target');

        //controlla se ci sono domande rimanenti
        if (contatore < questions.length) {
            targetTemp.innerHTML = '';

            //mostra le domande
            getQuestions();
        } else {

            //se non ci sono domande mostra il punteggio
            targetTemp.innerHTML = `
            <p>Giuste: ${risposte.giuste}</p>
            <p>Sbagliate: ${risposte.sbagliate}</p>
            <p>Le tue risposte:</p>
            <ol id="lista">
            <ol>
            `;
            for (let elemento of risposte["risposte date"]) {
                document.getElementById('lista').innerHTML += `<li>${elemento}</li>`;
            }
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


//funzione per stampare le 10 stelle per il feedback
function stelle(){

    let stelle = document.querySelector('#stelle');

    for (let index = 1; index <= 10; index++) {

        stelle.innerHTML += `<label aria-label="${index} stars" class="rating__label" for="rating-${index}"><svg class="rating__icon--star" width="47" height="46" viewBox="0 0 47 46" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2044 1.55551C22.6143 0.569963 24.0104 0.569964 24.4203 1.55552L29.9874 14.9402C30.1602 15.3557 30.5509 15.6396 30.9994 15.6756L45.4494 16.834C46.5134 16.9193 46.9448 18.2471 46.1341 18.9415L35.1248 28.3722C34.7831 28.6649 34.6338 29.1242 34.7382 29.5619L38.1018 43.6626C38.3494 44.7009 37.2199 45.5215 36.309 44.9651L23.9379 37.4089C23.5538 37.1743 23.0709 37.1743 22.6868 37.4089L10.3157 44.9651C9.40478 45.5215 8.27528 44.7009 8.52295 43.6626L11.8865 29.5619C11.9909 29.1242 11.8416 28.6649 11.4999 28.3722L0.490575 18.9415C-0.320069 18.2471 0.111362 16.9193 1.17535 16.834L15.6253 15.6756C16.0738 15.6396 16.4645 15.3557 16.6374 14.9402L22.2044 1.55551Z"/>
                </svg>
                </label>
                <input class="rating__input" name="rating" id="rating-${index}" value="${index}" 
            type="radio">
            `
    }

}