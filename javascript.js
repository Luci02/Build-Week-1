
async function getQuestions(){
    let domande = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    console.log(domande);


}

getQuestions();


let timeLeft = 60
let timer = setInterval(() => {
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;
  if (timeLeft === 0) {
  clearInterval(timer);
}
}, 1000);
 


/*
let timeLeft = 0;
for (let i = 0; i <questions.lenght; i++) {
    if (questions[i].difficulty == "medium") {
        timeLeft = 60
    }else{
        timeLeft = 45
    }
} 
*/