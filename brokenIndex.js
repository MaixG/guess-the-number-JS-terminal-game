// -- readline boilerplate --
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}
// -- end readline boilerplate --

// VARIABLES -- for min #, max #, and guess #
let min = 1;
let max = 100;
let guess = Math.floor(Math.random() * (max - min + min));
let guessAttempt = 0;

// FUNCTION -- using readline to create async/await function "start"
async function start() {
  console.log(
    "Let's play a game where you (human) make up a number and I (computer) try to guess it."
  );
  // create var "secretNumber" which is the response of the PC asking user for secret Number
  let secretNumber = await ask(
    "What is your secret number?\nI won't peek, I promise...\n_"
  );
  console.log("You entered: " + secretNumber);
  console.log(" ");
  console.log("Guessing...");
  console.log(" ");
  console.log("    ...");

  // FUNCTION -- ask about guess, receive input, adjust min/max, and guess the average #
  async function gaming() {
    let checkGuess = await ask(
      `Is your number ${guess}? Write 'C' for correct, 'H' for higher, 'L' for lower.\n_`
    );

    // FUNCTION -- handle if/else statements (had to nest to handle cheating functionality where first guess has already been established)
    async function scoring() {
      // IF/ELSE --
      if (checkGuess === "C" && guess !== secretNumber) { 
        checkGuess = await ask ("Liar!! Tell me the truth.\n_");
        wrongGuess();
      } else if (checkGuess === "C" && guess === secretNumber) {
        if (guessAttempt <= 7) {
        console.log("You're no match for me. Thanks for the reminder of how great I am");
        // exit the program                    !!!! can update to await "play again?" !!!!
        process.exit();
        } else if (guessAttempt >= 7) {
          console.log("Finally! I knew I could figure it out as long as I didn't give up. Point to me!");
          // exit the program                    !!!! can update to await "play again?" !!!!
          process.exit();
      } else if (checkGuess !== "C") {
        wrongGuess();
      }
    }
      async function wrongGuess() {
        //update guessAttempt
        guessAttempt += 1;
        console.log(`guessAttempt is ${guessAttempt}`);

        // IF/ELSE for H or L
        if (checkGuess === "H") {
          console.log("Hm...noted. I'll do better this time.");
          // shrink range by removing all #s below and including guess #
          min = guess + 1;
          // update guess variable to guess mean of min and max
          guess = Math.floor((min + max) / 2);
          console.log(`What's higher than ${min}?`);
          //need an await ask here
          checkGuess = await ask(`hm...\n\n What about ${guess}?`);
          scoring();
        } else if (checkGuess === "L") {
          // shrink range by removing all #s above and including guess #
          max = guess - 1;
          // update guess variable to guess mean of min and max
          guess = Math.floor((min + max) / 2);
          console.log(
            `Okay, fine. I'll do better this time.\nWhat's lower than ${max}? hm...`
          );
          //need an await ask here
          checkGuess = await ask(`hm...\n\n What about ${guess}?`);
          scoring();
        }
      }
    }
    scoring();
  }
  // call the gaming functiong to run
  gaming();

  // calling start function to run
}
start();