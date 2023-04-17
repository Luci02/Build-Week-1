let sum = 0;

async function getQuestions(){
    let questions = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    console.dir(questions);

    //ciclo le domande una per una
    for ( let question of questions) {
        //seleziono l'elemento con l'id #domanda e gli cambio il contenuto
        // let domanda = document.querySelector('#domanda');
        // domanda.textContent = question.question;

        //creo un array vuoto e pusho tutte le domande
        let answerList = [];
        answerList.push(question["correct_answer"]);
        for(let element of question["incorrect_answers"]){
            answerList.push(element);
        }

        //con la funzione shuffleArray() mescolo gli elementi contenuti nell'array
        shuffleArray(answerList);
        console.log(answerList);

        //stampo le domande
        for (let answer of answerList) {
            
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

getQuestions();