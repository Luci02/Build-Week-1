//Template in HTML
let primaPagina = document.getElementsByTagName('template')[0];
let templateQuiz = document.getElementsByTagName('template')[1];
let risultatiTest = document.getElementsByTagName('template')[2];
let feedback = document.getElementsByTagName('template')[3];

let contatore = 0;
let risposte = {
    giuste: 0,
    sbagliate: 0,
}

async function getQuestions() {
    let questions = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    const FULL_DASH_ARRAY = 283;
    let TIME_LIMIT = 0;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;

    //clono il contenuto, generando ogni volta un nuovo clone
    let clone = templateQuiz.content.cloneNode(true);

    //creo un array vuoto e pusho tutte le risposte
    let options = [];
    options.push(questions[contatore]["correct_answer"]);
    for (let element of questions[contatore]["incorrect_answers"]) {
        options.push(element);
    }

    //con la funzione shuffleArray() mescolo gli elementi contenuti nell'array
    shuffleArray(options);

    let buttonContainer = clone.querySelector('#button-container');

    //stampo i bottoni con le risposte
    for (let risposta of options) {
        //seleziono l'elemento contenitore della domanda e gli cambio il contenuto
        let domanda = clone.querySelector('.window2 h3');
        domanda.textContent = questions[contatore].question;

        let bottone = document.createElement('button');
        bottone.textContent = risposta;

        //AGGIUNGERE LE VARIE CLASSI AL BOTTONE
        // bottone.classList.add('bottone');
        buttonContainer.append(bottone);

        bottone.addEventListener('click', function () {
            if (this.textContent == questions[contatore]["correct_answer"]) {
                risposte.giuste++;
            } else {
                risposte.sbagliate++;
            }
        });
    }

    // Imposto il timer in base alla difficoltà delle domande
    switch (true) {
        case questions[contatore].difficulty == 'easy':
            TIME_LIMIT = 30;
            break;
        case questions[contatore].difficulty == 'medium':
            TIME_LIMIT = 50;
            break;
        case questions[contatore].difficulty == 'hard':
            TIME_LIMIT = 60;
            break;
        default:
            TIME_LIMIT = 5;
    }

    // Definisco un'area in cui inserire il clone
    let target = document.getElementById("target");

    // Inserisco il clone
    target.append(clone);

    // Seleziono l'elemento con l'id "app" e costruisco l'HTML del timer
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

    //faccio partire il timer
    startTimer();

    // QuerySelector per aggiornare dinamicamente il conteggio delle domande in basso nel quiz
    document.querySelector('#currentQuestion').innerHTML = contatore + 1;
    document.querySelector('#totalQuestions').innerHTML = questions.length;

    //funzioni relative al timer
    function onTimesUp() {
        clearInterval(timerInterval);
        risposte.sbagliate++;
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

        let targetTemp = document.getElementById('target');

        //controlla se ci sono domande rimanenti
        if (contatore < questions.length) {
            // Svuota il DIV con ID "target"
            targetTemp.innerHTML = '';
            //mostra le domande
            getQuestions();
        }
        else {
            // Svuota il DIV con ID "target"
            targetTemp.innerHTML = '';

            // Clona la pagina dei risultati del test
            let clone1 = risultatiTest.content.cloneNode(true);
            targetTemp.append(clone1);

            const myChart = document.querySelector('#my-chart');
            let corrette = document.querySelector('.esito');
            let errate = document.querySelector('.esito2');
            let percentualeCorrette = calcolaCorrette(risposte.giuste, questions.length);
            let percentualeSbagliate = calcolaSbagliate(risposte.sbagliate, questions.length);

            new Chart(myChart, {
                type: "doughnut",
                data: {
                    datasets: [{
                        data: [
                            percentualeSbagliate,
                            percentualeCorrette
                        ],
                        backgroundColor: [
                            '#D20094',
                            '#00FFFF'
                        ],
                        borderWidth: 0
                    }],
                    labels: [
                        'Risposte Sbagliate',
                        'Risposte Corrette'
                    ]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        }
                    },
                    responsive: true,
                    cutout: '70%'
                },
                plugins: []
            });

            corrette.innerHTML = `
            <h3>Correct <b>${percentualeCorrette} %</b></h3>
            <p> ${risposte.giuste}/${questions.length} questions </p>
            `;
            errate.innerHTML = `
            <h3>Wrong <b>${percentualeSbagliate} %</b></h3>
            <p> ${risposte.sbagliate}/${questions.length} questions </p>
            `;

            if (percentualeCorrette < 60) {
                let h4 = document.querySelector('.window3 #congratulations');
                 h4.innerHTML = `
                 <h4>We are Sorry!</h4>
                 <p> You didn't passed the exam. </p>
                 `
                 let coloraRosso = document.querySelector('.window3 #congratulations p');
                 coloraRosso.style.color = 'red';

                 let chartContainer = document.querySelector('#chart-container');

                 chartContainer.style.bottom = '190px';

                 console.dir(chartContainer);
            }else{
                let h4 = document.querySelector('.window3 #congratulations');
                 h4.innerHTML = `
                 <h4>Congratulations! <span> You passed the exam. </span></h4>
                 <p>We'll send you the certificate in few minutes. Check your email &lpar;including promotions / spam folder&rpar;</p>
                 `
            }

            document.querySelector('#bottone button').addEventListener('click', function () {
                target.innerHTML = '';
                clone1 = feedback.content.cloneNode(true);
                target.append(clone1);
                stelle();
            });
                 
            }

        }
    }
//}

// Funzione per mescolare gli elementi di un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Clono il contenuto, generando ogni volta un nuovo clone
let clone1 = primaPagina.content.cloneNode(true);

// Definisco un'area in cui inserire il clone
let target = document.getElementById("target");

// Inserisco il clone
target.append(clone1);

// Seleziono il bottone per procedere con il quiz dalla schermata
let proceed = document.querySelector('#botton .bottone1');

// Al click del bottone PROCEED si svuota la pagina corrente
proceed.addEventListener('click', function () {

    let accetta = document.querySelector('#accept');
    if (!accetta.checked) {
        alert("checkbox is not checked");
        location.reload();
    } else {
        target.innerHTML = '';
        getQuestions();
    }

})

// Funzione per calcolare la percentuale di risposte corrette
function calcolaCorrette(giuste, totale) {
    let total = (giuste / totale) * 100;
    if (total % 2 != 0) {
        total = total.toFixed(2);
    }
    return total;
}

// Funzione per calcolare la percentuale di risposte sbagliate
function calcolaSbagliate(sbagliate, totale) {
    let total = (sbagliate / totale) * 100;
    if (total % 2 != 0) {
        total = total.toFixed(2);
    }
    return total;
}

// Funzione per stampare le 10 stelle per il feedback
function stelle() {

    // Seleziono il DIV contenitore delle stelle
    let stelleDiv = document.querySelector('#stelle');

    // Creo le 10 stelle
    for (let index = 1; index <= 10; index++) {

        stelleDiv.innerHTML += `<svg width="47" height="46" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2044 1.55551C22.6143 0.569963 24.0104 0.569964 24.4203 1.55552L29.9874 14.9402C30.1602 15.3557 30.5509 15.6396 30.9994 15.6756L45.4494 16.834C46.5134 16.9193 46.9448 18.2471 46.1341 18.9415L35.1248 28.3722C34.7831 28.6649 34.6338 29.1242 34.7382 29.5619L38.1018 43.6626C38.3494 44.7009 37.2199 45.5215 36.309 44.9651L23.9379 37.4089C23.5538 37.1743 23.0709 37.1743 22.6868 37.4089L10.3157 44.9651C9.40478 45.5215 8.27528 44.7009 8.52295 43.6626L11.8865 29.5619C11.9909 29.1242 11.8416 28.6649 11.4999 28.3722L0.490575 18.9415C-0.320069 18.2471 0.111362 16.9193 1.17535 16.834L15.6253 15.6756C16.0738 15.6396 16.4645 15.3557 16.6374 14.9402L22.2044 1.55551Z"/>
        </svg>`
    }

    // AGGIUNGERE HOVER SU TUTTE LE STELLE
    function aggiungiHover() {
        let stelle = document.querySelectorAll('#stelle svg');
        stelle.forEach(function (questeStelle) {
            questeStelle.addEventListener("mouseover", illumina);
            questeStelle.addEventListener("mouseout", togliIllumina);
        });
    }

    // ADD HIGHLIGHT CLASS ON HOVER
    function illumina() {
        let seleziona = document.querySelectorAll("#stelle svg");
        let starIndex = Array.from(seleziona).indexOf(this);
        for (let i = 0; i <= starIndex; i++) {
            seleziona[i].classList.add("starActive");
        }
    }

    // La funzione "illumina" = il variabile "starIndex"  (che a sua volta è stata selezionata da "seleziona"), attiva il metodo "Array.from" che sempre con il ciclo divide le stelle
    // una volta alla volta e con "indexOf(this)" cioè seleziona "QUESTO-THIS"  cioe l'elemento su cui si trova il mouse in quel preciso momento.
    // poi per ogni stella aggiunge la classe starActive definito in css prima.

    // TOGLIERE LA FUNZIONE ILLUMINA 
    function togliIllumina() {
        let stars = document.querySelectorAll("#stelle svg");
        stars.forEach(function (star) {
            star.classList.remove("starActive");
        });
    }

    // RIEMPIRE LE STELLE FINCHE QUELLA DESIDERATA NON VIENE CLICCATA
    function fillStars(target) {
        let activeStarClass = "starActive";
        let inactiveStarClass = "starInactive";
        let stars = document.querySelectorAll("#stelle svg path");
        let starIndex = Array.from(stars).indexOf(target);
        for (let i = 0; i <= starIndex; i++) {
            stars[i].classList.add(activeStarClass);
            stars[i].classList.remove(inactiveStarClass);
        }
        for (let i = starIndex + 1; i < stars.length; i++) {
            stars[i].classList.remove(activeStarClass);
            stars[i].classList.add(inactiveStarClass);
        }
    }

    // ADD CLICK EVENT LISTENER TO STARS CONTAINER
    stelleDiv.addEventListener("click", function (event) {
        fillStars(event.target);
    });

    aggiungiHover();

}