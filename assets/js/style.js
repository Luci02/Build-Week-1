async function getQuestions(){
    let domande = await fetch('https://opentdb.com/api.php?amount=10&category=18').then(res => res.json()).then(res => res.results);

    console.log(domande);
}

getQuestions();