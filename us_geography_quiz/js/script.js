// This makes the button run the gradeQuiz function when it gets clicked
document.querySelector("button").addEventListener("click", gradeQuiz);


// Global score variable
// Each correct answer is worth 10 points
let score = 0;


// Getting the total attempts from localStorage
// This lets the browser remember how many times the quiz was taken
let attempts = localStorage.getItem("total_attempts");


// If nothing is saved yet, start attempts at 0
if (attempts === null) {
    attempts = 0;
} else {
    // localStorage stores values as text, so this changes it back into a number
    attempts = Number(attempts);
}


// Showing the saved total attempts when the page loads
document.querySelector("#totalAttempts").textContent = `Total Times Quiz Was Taken: ${attempts}`;


// Displaying the randomized choices for question 9 when the page loads
displayQ9Choices();


function shuffleArray(array) {
    // This loop shuffles the array so the choices are not always in the same order
    for (let i = array.length - 1; i > 0; i--) {

        // Picking a random index from 0 to i
        let j = Math.floor(Math.random() * (i + 1));

        // Swapping the current item with the random item
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function displayQ9Choices() {
    // These are the choices for question 9
    let q9ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];

    // Shuffling the choices before showing them
    shuffleArray(q9ChoicesArray);

    // Grabbing the place where the choices will be added
    let choicesContainer = document.querySelector("#q9Choices");

    // Clearing the container first just in case
    choicesContainer.textContent = "";

    // Creating one radio button and label for each choice
    for (let choice of q9ChoicesArray) {

        // Creating the radio button
        let input = document.createElement("input");
        input.type = "radio";
        input.name = "q9";
        input.id = choice.replace(" ", "");
        input.value = choice;
        input.className = "form-check-input ms-2";

        // Creating the label for the radio button
        let label = document.createElement("label");
        label.htmlFor = choice.replace(" ", "");
        label.textContent = choice;
        label.className = "form-check-label me-3";

        // Adding the radio button and label to the page
        choicesContainer.appendChild(input);
        choicesContainer.appendChild(label);
    }
}


function isFormValid() {
    // Starting off assuming everything is answered
    let isValid = true;

    // Grabbing the validation message area
    let validationFdbk = document.querySelector("#validationFdbk");

    // Clearing old validation messages
    validationFdbk.textContent = "";

    // Getting the selected radio button for question 9
    let selectedQ9 = document.querySelector("input[name=q9]:checked");

    // Checking each question to make sure it was answered
    if (document.querySelector("#q1").value.trim() === "") {
        isValid = false;
        validationFdbk.textContent = "Question 1 was not answered";
    } else if (document.querySelector("#q2").value === "") {
        isValid = false;
        validationFdbk.textContent = "Question 2 was not answered";
    } else if (!document.querySelector("#Jackson").checked &&
               !document.querySelector("#Franklin").checked &&
               !document.querySelector("#Jefferson").checked &&
               !document.querySelector("#Roosevelt").checked) {
        isValid = false;
        validationFdbk.textContent = "Question 3 was not answered";
    } else if (document.querySelector("#q4").value.trim() === "") {
        isValid = false;
        validationFdbk.textContent = "Question 4 was not answered";
    } else if (document.querySelector("#q5").value === "") {
        isValid = false;
        validationFdbk.textContent = "Question 5 was not answered";
    } else if (document.querySelector("#q6").value === "") {
        isValid = false;
        validationFdbk.textContent = "Question 6 was not answered";
    } else if (document.querySelector("#q7").value === "") {
        isValid = false;
        validationFdbk.textContent = "Question 7 was not answered";
    } else if (!document.querySelector("#Superior").checked &&
               !document.querySelector("#Michigan").checked &&
               !document.querySelector("#Tahoe").checked &&
               !document.querySelector("#Erie").checked) {
        isValid = false;
        validationFdbk.textContent = "Question 8 was not answered";
    } else if (selectedQ9 === null) {
        isValid = false;
        validationFdbk.textContent = "Question 9 was not answered";
    } else if (document.querySelector("#q10").value.trim() === "") {
        isValid = false;
        validationFdbk.textContent = "Question 10 was not answered";
    }

    // Returning true or false so the quiz knows whether to keep grading
    return isValid;
}


function setMarkImage(index, imageName, altText) {
    // Grabbing the correct image spot based on the question number
    let markContainer = document.querySelector(`#markImg${index}`);

    // Clearing the old image so images do not stack up
    markContainer.textContent = "";

    // Creating the image element
    let img = document.createElement("img");

    // Setting up the image file and alt text
    img.src = `img/${imageName}`;
    img.alt = altText;
    img.className = "mark-img";

    // Putting the image on the page
    markContainer.appendChild(img);
}


function rightAnswer(index) {
    // Grabbing the feedback area for this question
    let feedback = document.querySelector(`#q${index}Feedback`);

    // Showing correct feedback
    feedback.textContent = "Correct!";
    feedback.className = "feedback bg-success text-white rounded";

    // Showing checkmark image
    setMarkImage(index, "checkmark.png", "Checkmark");

    // Adding 10 points for this correct answer
    score += 10;
}


function wrongAnswer(index) {
    // Grabbing the feedback area for this question
    let feedback = document.querySelector(`#q${index}Feedback`);

    // Showing incorrect feedback
    feedback.textContent = "Incorrect!";
    feedback.className = "feedback bg-warning text-dark rounded";

    // Showing X mark image
    setMarkImage(index, "xmark.png", "X mark");
}


function gradeQuiz() {
    // Clearing old messages before grading again
    document.querySelector("#validationFdbk").textContent = "";
    document.querySelector("#congratsMessage").textContent = "";

    // If the form is not valid, stop the function here
    if (!isFormValid()) {
        return;
    }

    // Resetting score every time the quiz is submitted
    score = 0;

    // Grabbing all answers from the page
    let q1Response = document.querySelector("#q1").value.trim().toLowerCase();
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("#q4").value.trim().toLowerCase();
    let q5Response = document.querySelector("#q5").value;
    let q6Response = Number(document.querySelector("#q6").value);
    let q7Response = document.querySelector("#q7").value;
    let selectedQ9 = document.querySelector("input[name=q9]:checked");
    let q10Response = document.querySelector("#q10").value.trim().toLowerCase();

    // Checking question 1
    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // Checking question 2
    if (q2Response === "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // Checking question 3
    // Correct answers are Jefferson and Roosevelt only from this list
    if (document.querySelector("#Jefferson").checked &&
        document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked &&
        !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // Checking question 4
    if (q4Response === "pacific" || q4Response === "pacific ocean") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Checking question 5
    if (q5Response === "fl") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // Checking question 6
    if (q6Response === 50) {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // Checking question 7
    if (q7Response === "az") {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // Checking question 8
    // Superior, Michigan, and Erie are Great Lakes, Tahoe is not
    if (document.querySelector("#Superior").checked &&
        document.querySelector("#Michigan").checked &&
        document.querySelector("#Erie").checked &&
        !document.querySelector("#Tahoe").checked) {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    // Checking question 9
    if (selectedQ9 !== null && selectedQ9.value === "Rhode Island") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // Checking question 10
    if (q10Response === "washington dc" ||
        q10Response === "washington d.c." ||
        q10Response === "washington, dc" ||
        q10Response === "washington, d.c.") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    // Grabbing the total score area
    let totalScore = document.querySelector("#totalScore");

    // Showing the final score
    totalScore.textContent = `Total Score: ${score} / 100`;

    // Making the score red if it is below 80, green otherwise
    if (score < 80) {
        totalScore.className = "text-danger";
    } else {
        totalScore.className = "text-success";
    }

    // Showing a congratulatory message if the score is above 80
    if (score > 80) {
        let congratsMessage = document.querySelector("#congratsMessage");
        congratsMessage.textContent = "Congratulations! You scored above 80!";
        congratsMessage.className = "text-success mt-3";
    }

    // Adding 1 attempt after a valid quiz submission
    attempts++;

    // Showing the updated attempts on the page
    document.querySelector("#totalAttempts").textContent = `Total Times Quiz Was Taken: ${attempts}`;

    // Saving the attempts in localStorage so it stays after reload
    localStorage.setItem("total_attempts", attempts);
}