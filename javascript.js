
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

let timeLeft = 0;
for (let i = 0; i <questions.lenght; i++) {
    if (questions[i].difficulty == "medium") {
        timeLeft = 60
    }else{
        timeLeft = 45
    }
} 

let timer = setInterval(() => {
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;
  let degrees = (timeLeft / 60) * 360 - 90;
  document.getElementById('timer').style.transform = `rotate(${degrees}deg)`;
  let opacity = timeLeft / 60;
  document.getElementById('timer').style.borderColor = `rgba(0, 0, 255, ${opacity})`;
  if (timeLeft === 0) {
    clearInterval(timer);
  }
}, 1000);
