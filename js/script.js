//CREAZIONE DELLE STELLE

function creatStars() {
    let stars = document.querySelector("#stars");
    for(let i =0; i < 10; i++){
      let star = document.createElement("span");
      star.classList.add("star");
      stars.appendChild(star);
    }
    
    }
    
      //SELEZIONARE LE STELLE
      function highlight() {
        let stars = document.querySelectorAll("#stars .star");
        for(let i =0; i < stars.length; i++){
          stars[i].classList.add("starHover");
        }
        console.log(stars);
      }
      creatStars()
      
      
      let hover = document.querySelector("#stars");
      hover.addEventListener("mouseover", highlight)