
async function getQuestions(){
    let domande = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    console.log(domande);


}

getQuestions();


//array vuoti e ciclo push
//timer
//far apparire la domanda con le 4 risposte
//domanda div create.element 1 
//4 buttoni con create.element 2
//variabile somma risposte


//timer : 
/*
let timeLeft = 0;
for (let i = 0; i <questions.lenght; i++) {
    if (questions[i].difficulty == "medium") {
        timeLeft = 60
    }else{
        timeLeft = 45
    }
} */ 
timeLeft = 60;
let timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft === 0) {
        clearInterval(timer);
    }    
}, 1000)
    
