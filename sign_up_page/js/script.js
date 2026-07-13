// Calling loadStates directly when the script loads
// Since the script tag is at the bottom of the HTML, the page elements already exist
loadStates();


// This waits for the user to change the zip code box
// After they click away from the textbox, displayCity will run
document.querySelector("#zip").addEventListener("change", displayCity);


// This waits for the user to select a state
// When the state changes, the county menu gets updated
document.querySelector("#state").addEventListener("change", loadCounties);


// This waits for the user to change the username box
// After they click away, checkUsername will run
document.querySelector("#username").addEventListener("change", checkUsername);


// This shows a suggested password when the user clicks inside the password box
document.querySelector("#password").addEventListener("focus", displaySuggestedPassword);


// This checks the form before it gets submitted
// It lets us stop the form if the username or password has problems
document.querySelector("#signupForm").addEventListener("submit", validateForm);


async function displayCity() {
    try {
        // Getting the zip code the user typed
        let zipCode = document.querySelector("#zip").value;

        // Grabbing the zip error message spot
        let zipError = document.querySelector("#zipError");

        // Clearing old messages before checking again
        zipError.textContent = "";
        document.querySelector("#city").textContent = "";
        document.querySelector("#latitude").textContent = "";
        document.querySelector("#longitude").textContent = "";

        // Building the API URL using the zip code
        let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

        // Asking the API for city information
        let response = await fetch(url);

        // Turning the API response into JavaScript data
        let data = await response.json();

        // The API returns false if the zip code is not found
        if (data === false) {
            zipError.textContent = "Zip code not found";
            zipError.style.color = "red";
            return;
        }

        // Showing the city returned by the API
        document.querySelector("#city").textContent = data.city;

        // Showing the latitude returned by the API
        document.querySelector("#latitude").textContent = data.latitude;

        // Showing the longitude returned by the API
        document.querySelector("#longitude").textContent = data.longitude;

    } catch (error) {
        // If something goes wrong, show a simple message and log the real error
        document.querySelector("#zipError").textContent = "Unable to retrieve city";
        document.querySelector("#zipError").style.color = "red";

        console.error(error);
    }
}


async function loadStates() {
    // Grabbing the state dropdown menu
    let stateMenu = document.querySelector("#state");

    // Clearing out the temporary "Loading states..." option
    stateMenu.textContent = "";

    // Creating the default option at the top of the dropdown
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select One";
    stateMenu.appendChild(defaultOption);

    try {
        // API that gives us all states and their abbreviations
        let url = "https://csumb.space/api/allStatesAPI.php";

        // Asking the API for the state list
        let response = await fetch(url);

        // Turning the API response into JavaScript data
        let data = await response.json();

        // Looping through every state returned by the API
        for (let item of data) {
            // Creating one option for each state
            let option = document.createElement("option");

            // The value stores the two-letter state abbreviation
            option.value = item.usps;

            // The visible text shows the full state name
            option.textContent = item.state;

            // Adding the option to the dropdown
            stateMenu.appendChild(option);
        }

    } catch (error) {
        // If the API fails, show an error option in the dropdown
        console.error(error);

        stateMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load states";
        stateMenu.appendChild(errorOption);
    }
}


async function loadCounties() {
    // Getting the selected state abbreviation
    let state = document.querySelector("#state").value;

    // Grabbing the county dropdown
    let countyMenu = document.querySelector("#county");

    // Clearing the old county list
    countyMenu.textContent = "";

    // If no state is selected, show a simple default option
    if (state === "") {
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a state first";
        countyMenu.appendChild(defaultOption);
        return;
    }

    try {
        // Building the county API URL with the selected state abbreviation
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;

        // Asking the API for the county list
        let response = await fetch(url);

        // Turning the response into JavaScript data
        let data = await response.json();

        // Adding a default option
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select One";
        countyMenu.appendChild(defaultOption);

        // Creating one option for each county
        for (let county of data) {
            let option = document.createElement("option");
            option.value = county.county;
            option.textContent = county.county;
            countyMenu.appendChild(option);
        }

    } catch (error) {
        // If the API fails, show a useful message in the dropdown
        console.error(error);

        countyMenu.textContent = "";

        let errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Unable to load counties";
        countyMenu.appendChild(errorOption);
    }
}


async function checkUsername() {
    // Getting the username the user typed
    let username = document.querySelector("#username").value;

    // Grabbing the span where the message will show
    let usernameError = document.querySelector("#usernameError");

    // Checking if the username box is empty
    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        return false;
    }

    try {
        // Building the API URL with the username
        let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;

        // Asking the API if the username is available
        let response = await fetch(url);

        // Turning the API response into JavaScript data
        let data = await response.json();

        // If available is true, the username is good to use
        if (data.available) {
            usernameError.textContent = "Username available!";
            usernameError.style.color = "green";
            return true;
        } else {
            usernameError.textContent = "Username taken";
            usernameError.style.color = "red";
            return false;
        }

    } catch (error) {
        // If the API fails, let the user know something went wrong
        usernameError.textContent = "Unable to check username";
        usernameError.style.color = "red";

        console.error(error);
        return false;
    }
}


async function displaySuggestedPassword() {
    try {
        // API that gives us a suggested password
        let url = "https://csumb.space/api/suggestedPassword.php?length=8";

        // Asking the API for a password suggestion
        let response = await fetch(url);

        // Turning the response into JavaScript data
        let data = await response.json();

        // Showing the suggested password next to the password box
        document.querySelector("#suggestedPassword").textContent = `Suggested password: ${data.password}`;
        document.querySelector("#suggestedPassword").style.color = "blue";

    } catch (error) {
        // If the API has an issue, show a basic message
        document.querySelector("#suggestedPassword").textContent = "Unable to suggest password";
        document.querySelector("#suggestedPassword").style.color = "red";

        console.error(error);
    }
}


async function validateForm(event) {
    // Stopping the form from submitting right away
    // This gives JavaScript time to check the username and passwords first
    event.preventDefault();

    // Starting off assuming the form is valid
    let isValid = true;

    // Grabbing username and password values
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;

    // Grabbing the error message areas
    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    // Clearing old error messages before checking again
    usernameError.textContent = "";
    passwordError.textContent = "";

    // Checking if the username is blank
    if (username.length === 0) {
        usernameError.textContent = "Username required";
        usernameError.style.color = "red";
        isValid = false;
    } else {
        // Checking the username API before allowing the form to submit
        let usernameAvailable = await checkUsername();

        if (usernameAvailable === false) {
            isValid = false;
        }
    }

    // Checking if the password is too short
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Checking if both password boxes match
    else if (password !== passwordAgain) {
        passwordError.textContent = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    // If everything passed, submit the form and go to welcome.html
    if (isValid) {
        document.querySelector("#signupForm").submit();
    }
}