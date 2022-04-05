// -- readline boilerplate --
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}
// -- end readline boilerplate --

// VARIABLES -- for and guess #
let min = 0
let guessAttempt = 0;

// FUNCTION -- NEED TO ASK FOR RANGE OF GAME (MAX)
async function chooseRange() {
  console.log("Let's play a guessing game.\n\nMaybe you'll do the impossible and beat me.\n\n\nThen, and only then, will I let you live.");
  // create variable - ask for the range of the game
  let selectedRange = await ask(`How large of a game would you like to play? There is no limit on the maximum number, but the minimum will always be 0.\n_`);
  // set max to the variable value
  max = parseInt(selectedRange);
  // CALL GAME FUNCTION
  chooseGame();
}
// CALL RANGE FUNCTION
chooseRange();

// FUNCTION -- OPTION TO REVERSE GAME
async function chooseGame() {
  let choice = await ask ("How would you like to play? Would you like to guess, or shall I?\nSay 'me' or 'pc'\n_");
  if (choice === 'me'){
    reverseGame();
  } else if(choice === 'pc') {
    start();
  }
}


// FUNCTION -- using readline to create async/await function "start"
async function start() {
  // create var "secretNumber" which is the response of the PC asking user for secret Number
  let answer = await ask("What is your secret number?\nI won't peek, I promise...\n_");
  let secretNumber = parseInt(answer);
  console.log("You entered: " + secretNumber);
  console.log(" ");
  console.log("Guessing...");
  console.log(" ");
  console.log("    ...");

  // FUNCTION -- ask about guess, receive input, adjust min/max, and guess the average #
  async function gaming() {
    // let min = 0
    let randomNum = Math.floor(Math.random() * (max - min + min));
    let guess = parseInt(randomNum);
    let checkGuess = await ask(`Is your number ${guess}? Write 'C' for correct, 'H' for higher, 'L' for lower.\n_`);
    
    // FUNCTION -- handle if/else statements (had to nest to handle cheating functionality where first guess has already been established)
    async function scoring() {
      console.log(guess)
      // IF/ELSE --
      if (checkGuess === "C" && guess !== secretNumber) {
        console.log(`Liar! Cheat! I've released your name to the FBI watch list. Your number was ${secretNumber}.\nThis is why I have to ask. Beings like you just can't resist deception. Let's try again. I'll pretend I forgot your crimes. Maybe you can redeem yourself.\nThis time, be honest.`);
        start();        
      } else if (checkGuess === "C" && guess === secretNumber) {
          if (guessAttempt >= 6){
            // ask if player wants to start again or end game
            let gameFinish = await ask ("Finally! I knew I could figure it out as long as I didn't give up. Point to me!\n\nWant to play again?\n (Y) or (N)\n_");
            // IF/ELSE to handle responses for starting again or ending game.
            if(gameFinish === "Y"){
              chooseRange();
            } else {
            // exit the program                    
            process.exit();
            }
          } else if (guessAttempt <= 6) {
            gameFinish = await ask ("You're no match for me. Thanks for the reminder of how great I am.\n\nWant to play again?\n (Y) or (N)\n_");
            if(gameFinish === "Y"){
              chooseRange();
            } else {
            // exit the program
            process.exit();
          }
        }
      } else if (checkGuess !== "C") {
        console.log("wrongGuess")
        wrongGuess();
      }

      async function wrongGuess() {
        //update guessAttempt
        guessAttempt += 1;
        console.log(`guessAttempt is ${guessAttempt}`);

        // IF/ELSE for H or L
        if (checkGuess === "H" && secretNumber > guess) {
          console.log("Hm...noted. I'll do better this time.");
          // shrink range by removing all #s below and including guess #
          min = guess;
          // update guess variable to guess mean of min and max
          guess = Math.floor((min + max) / 2);
          console.log(`What's higher than ${min}?`);
          //need an await ask here
          checkGuess = await ask(`hm...\n\n What about ${guess}?\n_`);
          scoring();
        } else if (checkGuess === "H" && secretNumber <= guess){
            console.log(`Liar! Cheat! I've released your name to the FBI watch list. Your number was ${secretNumber}.\nThis is why I have to ask. Beings like you just can't resist deception. Let's try again. I'll pretend I forgot your crimes. Maybe you can redeem yourself.\nThis time, be honest.`);
            start();      
        } else if (checkGuess === "L" && secretNumber < guess) {
          // shrink range by removing all #s above and including guess #
          max = guess;
          // update guess variable to guess mean of min and max
          guess = Math.floor((min + max) / 2);
          console.log(`Okay, fine. I'll do better this time.\nWhat's lower than ${max}? hm...`);
          //need an await ask here
          checkGuess = await ask(`hm...\n\n What about ${guess}?\n_`);
          scoring();
        } else if (checkGuess === "L" && secretNumber >= guess){
            console.log(`Liar! Cheat! I've released your name to the FBI watch list. Your number was ${secretNumber}.\nThis is why I have to ask. Beings like you just can't resist deception. Let's try again. I'll pretend I forgot your crimes. Maybe you can redeem yourself.\nThis time, be honest.`);
            start();      
        }
      }
  }
    scoring();
  }
  // call the gaming functiong to run
  gaming();
}

// FUNCTION - REVERSE GAME FUNCTIONALITY
async function reverseGame(){
  // computer guesses random number within range
  // let min = 0
  let randomNum = Math.floor(Math.random() * (max - min + min));
  let pcNumber = parseInt(randomNum);
  console.log("I am choosing a secret Number for you to guess.");
    async function reverseScoring() {
    // computer asks human to guess
    let requestGuess = await ask ("Go ahead and tell me your guess.\n_");
    let humanGuess = parseInt(requestGuess);
    // computer guides "Higher", "Lower", "Correct"
    if(humanGuess === pcNumber){
      let gameFinish = await ask ("Holy shit, you did it. Alright well......play again?\n(Y)es or (N)o\n_");
      if(gameFinish === "Y"){
        chooseRange();
      } else {
      // exit the program                    
      process.exit();
      }
    } else if (humanGuess !== pcNumber){
      if (pcNumber > humanGuess){
        console.log("whoops, my number is higher than your guess. Try again.");
        reverseScoring();
      } else if (pcNumber < humanGuess){
        console.log("whoops, my number is lower than your guess. Try again.");
        reverseScoring();
    }
    }
  }
  reverseScoring();
}
