

//CREAZIONE DELLE STELLE
function createStars() {
  let starsContainer = document.querySelector("#stars");
  for (let i = 0; i < 10; i++) {
    let star = document.createElement("span");
    star.classList.add("star");
    starsContainer.appendChild(star);
  }
}

//AGGIUNGERE HOVER SU TUTTE LE STELLE
function addHoverEffect() {
 let stars = document.querySelectorAll("#stars .star");
  stars.forEach((star) => {
    star.addEventListener("mouseover", highlight);
    star.addEventListener("mouseout", removeHighlight);
  });
}

//ADD HIGHLIGHT CLASS ON HOVER
function highlight() {
  let stars = document.querySelectorAll("#stars .star");
  let starIndex = Array.from(stars).indexOf(this);
  for (let i = 0; i <= starIndex; i++) {
    stars[i].classList.add("starHover");
  }
}

//REMOVE HIGHLIGHT CLASS ON MOUSEOUT
function removeHighlight() {
  const stars = document.querySelectorAll("#stars .star");
  stars.forEach((star) => {
    star.classList.remove("starHover");
  });
}

//FILL STARS UNTIL THE SELECTED STAR
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
let starsContainer = document.querySelector("#stars");
starsContainer.addEventListener("click", function(event) {
  if (event.target.matches(".star")) {
    fillStars(event.target);
  }
  
});

//INITIALIZE THE STARS
createStars();
addHoverEffect();
