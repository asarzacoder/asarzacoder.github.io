// Imports the packages needed for the app 1
import express from "express";
import mysql from "mysql2/promise";

// Creates the Express application 2
const app = express();

// Sets EJS as the view engine 3
app.set("view engine", "ejs");

// Gives the browser access to files inside public 4
app.use(express.static("public"));

// Creates the MySQL database connection pool 5
const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  connectionLimit: 10,
  waitForConnections: true
});

// Displays the home page with authors and categories 6
app.get("/", async (req, res) => {
  try {
    // Gets all authors for the author dropdown 7
    const authorSql = `
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName
    `;

    // Gets each unique category for the category dropdown 8
    const categorySql = `
      SELECT DISTINCT category
      FROM q_quotes
      ORDER BY category
    `;

    const [authors] = await conn.query(authorSql);
    const [categories] = await conn.query(categorySql);

    res.render("index", {
      authors,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the home page.");
  }
});

// Tests the connection to the database 9
app.get("/dbTest", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT CURDATE()");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed.");
  }
});

// Searches for quotes containing the submitted keyword 10
app.get("/searchByKeyword", async (req, res) => {
  try {
    const keyword = req.query.keyword ?? "";

    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE quote LIKE ?
    `;

    // The percent signs allow the keyword to appear anywhere in the quote 11
    const sqlParams = [`%${keyword}%`];

    const [rows] = await conn.query(sql, sqlParams);

    res.render("results", {
      quotes: rows,
      searchDescription: `Keyword: ${keyword}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to search by keyword.");
  }
});

// Searches for quotes written by one author 12
app.get("/searchByAuthor", async (req, res) => {
  try {
    const authorId = req.query.authorId;

    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE authorId = ?
    `;

    const [rows] = await conn.query(sql, [authorId]);

    res.render("results", {
      quotes: rows,
      searchDescription: "Author search"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to search by author.");
  }
});

// Searches for quotes from one category 13
app.get("/searchByCategory", async (req, res) => {
  try {
    const category = req.query.category;

    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE category = ?
    `;

    const [rows] = await conn.query(sql, [category]);

    res.render("results", {
      quotes: rows,
      searchDescription: `Category: ${category}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to search by category.");
  }
});

// Searches for quotes within a range of likes 14
app.get("/searchByLikes", async (req, res) => {
  try {
    const minLikes = Number(req.query.minLikes);
    const maxLikes = Number(req.query.maxLikes);

    const sql = `
      SELECT authorId, firstName, lastName, quote
      FROM q_quotes
      NATURAL JOIN q_authors
      WHERE likes BETWEEN ? AND ?
      ORDER BY likes
    `;

    const [rows] = await conn.query(sql, [minLikes, maxLikes]);

    res.render("results", {
      quotes: rows,
      searchDescription: `Likes: ${minLikes} to ${maxLikes}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to search by likes.");
  }
});

// Local API that returns all information about one author 15
app.get("/api/author/:id", async (req, res) => {
  try {
    const authorId = req.params.id;

    const sql = `
      SELECT *
      FROM q_authors
      WHERE authorId = ?
    `;

    const [rows] = await conn.query(sql, [authorId]);

    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Unable to retrieve the author."
    });
  }
});

// Uses Render's port when deployed and port 3000 locally 16
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});