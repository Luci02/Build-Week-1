

//CREAZIONE DELLE STELLE
function createStars() {
  let contenitoreStelle = document.querySelector("#stars");
  for (let i = 0; i < 10; i++) {
    let star = document.createElement("span");
    star.classList.add("star");
    contenitoreStelle.appendChild(star);
  }
}

//AGGIUNGERE HOVER SU TUTTE LE STELLE
function aggiungiHover() {
 let stars = document.querySelectorAll("#stars .star");
  stars.forEach(function(questeStelle){
    questeStelle.addEventListener("mouseover",illumina);
    questeStelle.addEventListener("mouseout", togliIllumina);
  });
}
//La funzione aggiungiHover va a selezionare tutte le stelle create con la classe "star", le cicla e per ogni stella "forEach" attiva un event listener che quando 
// ci passo il mouse sopra attiva la funzione "illumina", quando rimuovo il mouse attiva la funzione "togliIllumina"



//ADD HIGHLIGHT CLASS ON HOVER
function illumina() {
  let seleziona = document.querySelectorAll("#stars .star");
  let starIndex = Array.from(seleziona).indexOf(this);
  for (let i = 0; i <= starIndex; i++) {
    seleziona[i].classList.add("starHover");
  }
}

// La funzione "illumina" = il variabile "starIndex"  (che a sua volta è stata selezionata da "seleziona"), attiva il metodo "Array.from" che sempre con il ciclo divide le stelle
// una volta alla volta e con "indexOf(this)" cioè seleziona "QUESTO-THIS"  cioe l'elemento su cui si trova il mouse in quel preciso momento.
// poi per ogni stella aggiunge la classe starHover definito in css prima.


//TOGLIERE LA FUNZIONE ILLUMINA 
function togliIllumina() {
  const stars = document.querySelectorAll("#stars .star");
  stars.forEach(function(star) {
    star.classList.add("starHover");
  });
}




//RIEMPIRE LE STELLE FINCHE QUELLA DESIDERATA NON VIENE CLICCATA
function fillStars(target) {
  let activeStarClass = "starActive";
  let inactiveStarClass = "starInactive";
  let stars = document.querySelectorAll("#stars .star");
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




//ADD CLICK EVENT LISTENER TO STARS CONTAINER
let contenitoreStelle = document.querySelector("#stars");
contenitoreStelle.addEventListener("click", function(event) {
  if (event.target.matches(".star")) {
    fillStars(event.target);
  }
  
});

//INITIALIZE THE STARS
createStars();
aggiungiHover();
