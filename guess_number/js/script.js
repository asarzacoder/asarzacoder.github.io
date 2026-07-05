// Event listeners
// These tell the buttons what function to run when they get clicked
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);


// Global variables
// These are outside the functions because different parts of the game need to use them
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;


// This starts the game when the page first loads
initializeGame();


function initializeGame() {
    // Creating a random number from 1 to 99 for the player to guess
    randomNumber = Math.floor(Math.random() * 99) + 1;

    // Testing the random number in the console so we can see it while developing
    console.log("randomNumber: " + randomNumber);

    // Resetting attempts back to 0 for a fresh round
    attempts = 0;

    // Showing the Guess button again in case it was hidden after a win/loss
    document.querySelector("#guessBtn").style.display = "inline-block";

    // Hiding the Reset button until the player wins or loses
    document.querySelector("#resetBtn").style.display = "none";

    // Clearing the textbox so the player starts fresh
    document.querySelector("#playerGuess").value = "";

    // Clearing old feedback messages
    document.querySelector("#feedback").textContent = "";

    // Clearing the previous guesses from the last round
    document.querySelector("#previousGuesses").textContent = "";

    // Resetting attempts left back to 7
    document.querySelector("#attemptsLeft").textContent = 7;

    // Putting the cursor inside the textbox so the player can type right away
    document.querySelector("#playerGuess").focus();
}


function checkGuess() {
    // Grabbing the player's guess from the textbox
    let playerGuess = Number(document.querySelector("#playerGuess").value);

    // Grabbing the feedback area so we can display messages on the page
    let feedback = document.querySelector("#feedback");

    // Making sure old messages do not stay there forever
    feedback.textContent = "";

    // Checking if the player typed something that is not a number
    if (isNaN(playerGuess)) {
        feedback.textContent = "Please enter a valid number.";
        feedback.style.color = "red";
        return;
    }

    // Checking if the number is outside the allowed range
    if (playerGuess < 1 || playerGuess > 99) {
        feedback.textContent = "Enter a number between 1 and 99.";
        feedback.style.color = "red";
        return;
    }

    // If the guess is valid, we count it as an attempt
    attempts++;

    // Showing this guess in the previous guesses list
    document.querySelector("#previousGuesses").textContent += playerGuess + " ";

    // Updating how many attempts the player has left
    document.querySelector("#attemptsLeft").textContent = 7 - attempts;

    // Checking if the player guessed the number correctly
    if (playerGuess === randomNumber) {
        feedback.textContent = "You got it! It took you " + attempts + " attempt(s).";
        feedback.style.color = "green";

        // Adding 1 to the total wins
        wins++;

        // Updating the wins on the page
        document.querySelector("#wins").textContent = wins;

        // Ending the round because the player won
        gameOver();
    }

    // Checking if the player ran out of attempts
    else if (attempts === 7) {
        feedback.textContent = "You lost! The number was " + randomNumber + ".";
        feedback.style.color = "red";

        // Adding 1 to the total losses
        losses++;

        // Updating the losses on the page
        document.querySelector("#losses").textContent = losses;

        // Ending the round because the player lost
        gameOver();
    }

    // If the guess is too low, tell the player to go higher
    else if (playerGuess < randomNumber) {
        feedback.textContent = "Too low. Try a higher number.";
        feedback.style.color = "blue";
    }

    // If the guess is too high, tell the player to go lower
    else {
        feedback.textContent = "Too high. Try a lower number.";
        feedback.style.color = "blue";
    }

    // Clearing the textbox after each guess so it is easier to type the next one
    document.querySelector("#playerGuess").value = "";

    // Putting the cursor back in the textbox
    document.querySelector("#playerGuess").focus();
}


function gameOver() {
    // Hiding the Guess button so the player cannot keep guessing after the round ends
    document.querySelector("#guessBtn").style.display = "none";

    // Showing the Reset button so the player can start a new round
    document.querySelector("#resetBtn").style.display = "inline-block";
}