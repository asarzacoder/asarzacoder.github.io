// Imports Express so we can build the web app
import express from "express";

// Imports fetch so we can request data from the NASA API
import fetch from "node-fetch";

// Imports the package containing information about each planet
const planets = (await import("npm-solarsystem")).default;

// Creates the Express application
const app = express();

// Tells Express that our webpage files use EJS
app.set("view engine", "ejs");

// Lets Express access CSS, images, and other files in the public folder
app.use(express.static("public"));

// Backup images for planets with broken package links
const backupImages = {
  Mars: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  Jupiter: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
  Uranus: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg"
};

// Home page route
app.get("/", (req, res) => {
  // List of planets we can randomly select from
  const planetNames = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune"
  ];

  // Picks a random position from the planetNames array
  const randomIndex = Math.floor(Math.random() * planetNames.length);

  // Gets the randomly selected planet name
  const randomPlanetName = planetNames[randomIndex];

  // Creates a package function name such as getEarth or getSaturn
  const planetFunction = `get${randomPlanetName}`;

  // Gets the randomly selected planet's information
  const randomPlanetInfo = planets[planetFunction]();

  // Uses a backup image when the package image is broken
  const randomImage =
    backupImages[randomPlanetName] || randomPlanetInfo.image;

  // Sends the random image and planet name to the home page
  res.render("index", {
    randomImage,
    randomPlanetName
  });
});

// One reusable route for all eight planets
app.get("/planet", (req, res) => {
  // Gets the planet name from the URL query string
  // Example: /planet?planetName=Earth
  const planetName = req.query.planetName;

  // Creates a package function name such as getEarth
  const planetFunction = `get${planetName}`;

  // Prevents the server from crashing if the planet name is invalid
  if (!planetName || typeof planets[planetFunction] !== "function") {
    return res.status(404).send("Planet not found.");
  }

  // Gets all information for the selected planet
  const planetInfo = planets[planetFunction]();

  // Sends the planet information to planet.ejs
  res.render("planet", {
    planetName,
    planetInfo
  });
});

// NASA Picture of the Day route
app.get("/nasa", async (req, res) => {
  try {
    // NASA API address provided in the lab instructions
    const nasaUrl =
      "https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=2026-07-14";

    // Requests information from NASA
    const response = await fetch(nasaUrl);

    // Checks whether the NASA request worked
    if (!response.ok) {
      throw new Error("NASA API request failed.");
    }

    // Converts NASA's response into a JavaScript object
    const nasaData = await response.json();

    // Sends NASA's information to nasa.ejs
    res.render("nasa", {
      nasaData
    });
  } catch (error) {
    // Displays the full error in the terminal
    console.error(error);

    // Displays a simpler error message in the browser
    res.status(500).send("Unable to load NASA's Picture of the Day.");
  }
});

// Uses Render's port when deployed, or port 3000 on our computer
const PORT = process.env.PORT || 3000;

// Starts the website and allows Render to access it
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});