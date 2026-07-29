// Selects all clickable author names on the results page 1
const authorLinks = document.querySelectorAll(".author-link");

// Adds a click event to each author name 2
for (const authorLink of authorLinks) {
  authorLink.addEventListener("click", getAuthorInfo);
}

// Retrieves and displays the selected author's information 3
async function getAuthorInfo(event) {
  // Stops the link from jumping to the top of the page 4
  event.preventDefault();

  // Gets the author ID stored in the clicked link 5
  const authorId = this.dataset.authorId;

  try {
    // Calls the local Express API 6
    const response = await fetch(`/api/author/${authorId}`);

    if (!response.ok) {
      throw new Error("The author request failed.");
    }

    const data = await response.json();

    // Makes sure an author was returned 7
    if (data.length === 0) {
      throw new Error("The author was not found.");
    }

    const author = data[0];

    // Selects the modal placeholder 8
    const authorInfo = document.querySelector("#authorInfo");

    // Converts database dates into a cleaner format 9
    const dob = formatDate(author.dob);
    const dod = author.dod ? formatDate(author.dod) : "N/A";

    // Adds all author information to the modal 10
    authorInfo.innerHTML = `
      <div class="author-details">

        <img
          src="${author.portrait}"
          alt="${author.firstName} ${author.lastName}"
          class="author-portrait">

        <div>
          <h2>${author.firstName} ${author.lastName}</h2>

          <p><strong>Date of birth:</strong> ${dob}</p>
          <p><strong>Date of death:</strong> ${dod}</p>
          <p><strong>Sex:</strong> ${author.sex}</p>
          <p><strong>Profession:</strong> ${author.profession}</p>
          <p><strong>Country:</strong> ${author.country}</p>
          <p><strong>Biography:</strong> ${author.biography}</p>
        </div>

      </div>
    `;

    // Creates and opens the Bootstrap modal 11
    const authorModal = new bootstrap.Modal(
      document.getElementById("authorModal")
    );

    authorModal.show();
  } catch (error) {
    console.error(error);
    alert("Unable to load the author's information.");
  }
}

// Converts a date from the database into month/day/year 12
function formatDate(dateValue) {
  const date = new Date(dateValue);

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC"
  });
}