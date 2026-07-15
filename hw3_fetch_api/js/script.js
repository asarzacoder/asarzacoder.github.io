// This makes the search button run the searchCharacters function when clicked
document.querySelector("#searchBtn").addEventListener("click", searchCharacters);


async function searchCharacters() {
    // Getting the name typed by the user
    let characterName = document.querySelector("#characterName").value.trim();

    // Getting the selected species from the dropdown
    let species = document.querySelector("#species").value;

    // Grabbing the message and results areas
    let message = document.querySelector("#message");
    let results = document.querySelector("#results");

    // Clearing old messages and results before a new search
    message.textContent = "";
    results.textContent = "";

    // Making sure the user enters at least a name or species
    if (characterName === "" && species === "") {
        message.textContent = "Please enter a character name or select a species.";
        message.style.color = "orange";
        return;
    }

    // Showing a quick loading message
    message.textContent = "Loading characters...";
    message.style.color = "#7ac142";

    try {
        // Starting the API URL
        let url = "https://rickandmortyapi.com/api/character/?";

        // Adding the character name to the URL if the user typed one
        if (characterName !== "") {
            url += `name=${characterName}`;
        }

        // Adding species to the URL if the user selected one
        if (species !== "") {
            if (characterName !== "") {
                url += `&species=${species}`;
            } else {
                url += `species=${species}`;
            }
        }

        // Asking the API for character data
        let response = await fetch(url);

        // If the API does not find results, show a message
        if (!response.ok) {
            message.textContent = "No characters found. Try another search.";
            message.style.color = "orange";
            return;
        }

        // Turning the API response into JavaScript data
        let data = await response.json();

        // Clearing the loading message
        message.textContent = "";

        // Looping through the character results
        for (let character of data.results) {
            displayCharacter(character);
        }

    } catch (error) {
        // If something breaks, show a friendly message and log the error
        message.textContent = "Something went wrong while getting the character data.";
        message.style.color = "red";
        console.error(error);
    }
}


function displayCharacter(character) {
    // Grabbing the results area
    let results = document.querySelector("#results");

    // Creating a Bootstrap column for the card
    let column = document.createElement("div");
    column.className = "col-md-4 mb-4";

    // Creating the card
    let card = document.createElement("div");
    card.className = "character-card";

    // Creating the character image
    let img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;

    // Creating the character info area
    let info = document.createElement("div");
    info.className = "character-info";

    // Creating the character name
    let name = document.createElement("h3");
    name.textContent = character.name;

    // Creating character details
    let status = document.createElement("p");
    status.innerHTML = `<strong>Status:</strong> ${character.status}`;

    let species = document.createElement("p");
    species.innerHTML = `<strong>Species:</strong> ${character.species}`;

    let gender = document.createElement("p");
    gender.innerHTML = `<strong>Gender:</strong> ${character.gender}`;

    let origin = document.createElement("p");
    origin.innerHTML = `<strong>Origin:</strong> ${character.origin.name}`;

    // Adding all text into the info area
    info.appendChild(name);
    info.appendChild(status);
    info.appendChild(species);
    info.appendChild(gender);
    info.appendChild(origin);

    // Putting the image and info into the card
    card.appendChild(img);
    card.appendChild(info);

    // Putting the card into the column
    column.appendChild(card);

    // Showing the column on the page
    results.appendChild(column);
}