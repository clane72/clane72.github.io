/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb',
          ];

//Initiate game

 function initGame(){
   var deck = document.querySelector('.deck');
   var cardHTML = shuffle(cards).map(function(card){
     return generateCard(card);
   });
   deck.innerHTML = cardHTML.join('');
 }

//function that generates the cards using temporal literals
function generateCard(card){
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

initGame();
// Shuffle function from http://stackoverflow.com/a/2450976

function refreshClick() {
  location.reload();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Global Variables//
let allCards = document.querySelectorAll('.card'); //array to hold all cards
let openCards = []; //array of open cards
let moves = 0; //moves counter begins at 0
let movesCounter = document.querySelector('.moves');
let restartGame = document.querySelector('.fa-repeat'); //"fa-repeat" icon
let interval; //timer
let displayMinutes = document.querySelector('.minutes');  //minutes section of HTML stopwatch
let displaySeconds = document.querySelector('.seconds'); //seconds section of HTML stopwatch
let milliseconds = 0; //variable for elapsed milliseconds
let matched = 0; //variable to track matched cards to evaluate if game has been won
const winningPairs = 8; //need 8 pairs to win the game
const modal = document.querySelector('.modal'); //selects modal window
const yesButton = document.querySelector('.play-again'); //selects the yes button
const noButton = document.querySelector('.no-play-again'); //selects the no button
let isFirstClick = true; // First Click Indicator
const three = document.querySelector('.three');
const two = document.querySelector('.two');
const one = document.querySelector('.one');

restartGame.addEventListener('click', function(e) {  //event listener for restart game button
  stopTimer();
//clear classes from cards
  allCards.forEach(function(card){
    card.classList.remove('open', 'show', 'match');
     });
     refreshClick();
   //reset(); - tried this did not work - would not shuffle
  // initGame(); - tried this did not work - cards no longer clickable - why?
});

function reset() {
    moves = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    matched = 0;
    movesCounter.innerText = moves;
    displayMinutes.innerHTML = minutes;
    displaySeconds.innerHTML = seconds;
    isFirstClick = true;
    three.style.display =""; //Reset Stars
    two.style.display =""; //Reset Stars
    one.style.display =""; //Reset Stars
    resetCards();
    shuffle();
    //initGame(); - tried this did not work - cards no longer clickable - why?
}


function resetCards(){

  const cards = document.querySelectorAll('.deck li')
  for (let card of cards){
    card.className = 'card';
  }
}
//***tried this function too to reset/shuffle but didn't work either - froze the cards***//
// function newDeck(){
//   deck = document.querySelector('.deck');
//   cardHTML = shuffle(cards).map(function(card){
//     return generateCard(card);
//   });
//   //deck.innerHTML = cardHTML.join('');
//   resetCards();
// }

//game timer function
 function startTimer() {
      interval = setInterval(function() {
      milliseconds++;
      convertSeconds(Math.floor(milliseconds));
    }, 1000);
 }

//convert milliseconds to seconds and minutes to be displayed
 function convertSeconds(milliseconds) {
   let minutes = Math.floor(((milliseconds % 864000) % 3600) / 60);
   let seconds = ((milliseconds % 86400) % 3600) % 60;
   displayMinutes.innerHTML = minutes;
   if(seconds < 10) {
      displaySeconds.innerHTML = "0" + seconds;
 } else {
      displaySeconds.innerHTML = seconds;
    }
 }

 function stopTimer() {
   clearInterval(interval);
}

//function to check how many moves have been made & change star rating
function starRating() {

  if (moves === 10) {
    three.style.display = 'none';
    console.log('moves = 10');
  } else if (moves === 15) {
    two.style.display = 'none';
    console.log('moves = 15')
  } else if (moves === 20) {
    one.style.display = 'none';
    console.log('moves = 20')
  }
}

allCards.forEach(function(card){
 card.addEventListener('click',function(e){
   //check to see if first click then start timer
   if(isFirstClick) {
       startTimer();
       isFirstClick = false; // change FirstClick indicator's value
     }

   if(card.classList.contains('open') || !card.classList.contains('show') || !card.classList.contains('match')){
     openCards.push(card); //push current card into array
     card.classList.add('open','show');

//Check if match
     if (openCards.length == 2) {
       if (openCards[0].dataset.card == openCards[1].dataset.card){
         openCards[0].classList.add('match');
         openCards[0].classList.add('open');
         openCards[0].classList.add('show');

         openCards[1].classList.add('match');
         openCards[1].classList.add('open');
         openCards[1].classList.add('show');

         openCards = [];//empty out array if match so when no match will work going forward

         matched++;
         //Check to see if all matched
         if (matched === winningPairs){
           console.log ("You win!");
           //moves +=1;
           finalStats();
           stopTimer();
         }

       }else {
        //If no match hide
          setTimeout(function(){
            openCards.forEach(function(card){
              card.classList.remove('open', 'show');
            });
              openCards = []; //hide cards
          }, 1000);
        }
      moves+=1;
      movesCounter.innerText = moves;
    }
    starRating();
   }
 });
});

// get stats for results
function finalStats() {
  const officialTime = document.querySelector('.official-time');
  const officialMoves = document.querySelector('.official-moves');
  const officialStars = document.querySelector('.official-stars');
  const officialMinutes = document.querySelector('.minutes').innerHTML;
  const officialSeconds = document.querySelector('.seconds').innerHTML;
  const stars = starCount();

  officialTime.innerHTML = `Time: ${officialMinutes}:${officialSeconds}`;
  officialMoves.innerHTML = `Moves: ${moves}`;

  function starCount() {
    findStars = document.querySelectorAll('.stars li');
    finalStars = 0;
    for (findStar of findStars) {
      if (findStar.style.display !== 'none') {
        finalStars++;
        officialStars.innerHTML = `Stars: ${finalStars}`;
        console.log(finalStars);
      }
    }
  }

//displays modal window
  modal.style.display = "block";
}

//event listener for play again button
yesButton.addEventListener('click', function(e) {
  modal.style.display = 'none';
  console.log('Reinitiate game');
  resetCards();
  refreshClick();
});


//event listener for don't play again button
noButton.addEventListener('click', function(e) {
modal.style.display = 'none';
});
