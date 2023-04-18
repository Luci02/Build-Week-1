let sum = 0;

async function getQuestions() {
    let questions = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);
    
    console.dir(questions);
    
    //ciclo le domande una per una
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

        //stampo le domande
        for (let risposta of options) {

            //salvo la difficoltà in una variabile
            let difficulty = risposta.difficulty;
            let time = 0;

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

            //seleziono l'elemento con l'id #domanda e gli cambio il contenuto
            let domanda = document.querySelector('#domanda');
            domanda.textContent = question.question;

            let bottone = document.createElement('button');
            bottone.textContent = risposta;

            //AGGIUNGERE LE VARIE CLASSI AL BOTTONE
            let buttonContainer = document.querySelector('#button-container');
            // bottone.classList.add('');
            buttonContainer.append(bottone);

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