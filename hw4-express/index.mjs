// Imports Express so we can build our web app
import express from "express";

// Imports fetch so we can get information from a Web API
import fetch from "node-fetch";

// createRequire lets this .mjs file load an older CommonJS package
import { createRequire } from "node:module";

// Creates a require function that works inside this ES module file
const require = createRequire(import.meta.url);

// Loads the language-map package using CommonJS
// We use require here because the package has trouble with Node 24 ES module imports
const languageMap = require("language-map");

// Creates the Express app
const app = express();

// Tells Express that our page files use EJS
app.set("view engine", "ejs");

// Lets Express use CSS and images inside the public folder
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  // Loads the home page
  res.render("index");
});

// Python route
app.get("/python", (req, res) => {
  // Gets Python information from the language-map package
  const pythonInfo = languageMap.Python;

  // Sends the package data to python.ejs
  res.render("python", { pythonInfo });
});

// Java route
app.get("/java", (req, res) => {
  // Gets Java information from the language-map package
  const javaInfo = languageMap.Java;

  // Sends the package data to java.ejs
  res.render("java", { javaInfo });
});

// C++ route
app.get("/cpp", (req, res) => {
  // C++ needs bracket notation because its name contains symbols
  const cppInfo = languageMap["C++"];

  // Sends the package data to cpp.ejs
  res.render("cpp", { cppInfo });
});

// This route displays live data from the GitHub Web API
app.get("/language-data", async (req, res) => {
  try {
    // GitHub API URLs for three programming-related repositories
    const urls = [
      "https://api.github.com/repos/python/cpython",
      "https://api.github.com/repos/openjdk/jdk",
      "https://api.github.com/repos/isocpp/CppCoreGuidelines"
    ];

    // Requests all three repositories at the same time
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          headers: {
            // GitHub recommends sending a User-Agent with API requests
            "User-Agent": "hw4-express-app"
          }
        })
      )
    );

    // Stops the route if one of the API requests failed
    if (responses.some((response) => !response.ok)) {
      throw new Error("One or more GitHub API requests failed.");
    }

    // Converts every API response into a JavaScript object
    const repositories = await Promise.all(
      responses.map((response) => response.json())
    );

    // Sends the GitHub API information to the EJS view
    res.render("language-data", { repositories });
  } catch (error) {
    // Shows the detailed error in the terminal
    console.error(error);

    // Shows a simpler message in the browser
    res.status(500).send("Unable to load GitHub repository data.");
  }
});

// Uses Render's port when deployed, or port 3000 on our computer
const PORT = process.env.PORT || 3000;

// Starts the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});