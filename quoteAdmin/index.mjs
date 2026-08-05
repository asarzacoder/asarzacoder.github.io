// Imports Express and MySQL 1
import express from "express";
import mysql from "mysql2/promise";

// Creates the Express app 2
const app = express();

// Sets EJS as the template engine 3
app.set("view engine", "ejs");

// Lets Express read form data from POST requests 4
app.use(express.urlencoded({ extended: true }));

// Lets Express use files from the public folder 5
app.use(express.static("public"));

// Connects the app to your JawsDB database 6
const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  connectionLimit: 10,
  waitForConnections: true
});

// Displays the Lab 6 home page 7
app.get("/", (req, res) => {
  res.render("index");
});

// Tests the database connection 8
app.get("/dbTest", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT CURDATE()");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed.");
  }
});

// Displays the form used to add a new author 9
app.get("/author/new", (req, res) => {
  res.render("newAuthor");
});

// Adds a new author to the database 10
app.post("/author/new", async (req, res) => {
  try {
    const sql = `
      INSERT INTO q_authors
      (
        firstName,
        lastName,
        dob,
        dod,
        sex,
        profession,
        country,
        portrait,
        biography
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const deathDate = req.body.deathDate || null;

    const params = [
      req.body.fName,
      req.body.lName,
      req.body.birthDate,
      deathDate,
      req.body.sex,
      req.body.profession,
      req.body.country,
      req.body.portrait,
      req.body.biography
    ];

    await conn.query(sql, params);

    res.render("newAuthor", {
      message: "Author added!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to add the author.");
  }
});

// Retrieves and displays all authors alphabetically 11
app.get("/authors", async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM q_authors
      ORDER BY lastName
    `;

    const [rows] = await conn.query(sql);

    res.render("authorList", {
      authors: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the author list.");
  }
});

// Gets one author's current information for the edit form 12
app.get("/author/edit", async (req, res) => {
  try {
    const authorId = req.query.authorId;

    const sql = `
      SELECT *,
        DATE_FORMAT(dob, '%Y-%m-%d') AS dobISO,
        DATE_FORMAT(dod, '%Y-%m-%d') AS dodISO
      FROM q_authors
      WHERE authorId = ?
    `;

    const [rows] = await conn.query(sql, [authorId]);

    if (rows.length === 0) {
      return res.status(404).send("Author not found.");
    }

    res.render("editAuthor", {
      authorInfo: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the author.");
  }
});

// Updates the selected author's information 13
app.post("/author/edit", async (req, res) => {
  try {
    const sql = `
      UPDATE q_authors
      SET
        firstName = ?,
        lastName = ?,
        dob = ?,
        dod = ?,
        sex = ?,
        profession = ?,
        country = ?,
        portrait = ?,
        biography = ?
      WHERE authorId = ?
    `;

    const deathDate = req.body.dod || null;

    const params = [
      req.body.fName,
      req.body.lName,
      req.body.dob,
      deathDate,
      req.body.sex,
      req.body.profession,
      req.body.country,
      req.body.portrait,
      req.body.biography,
      req.body.authorId
    ];

    await conn.query(sql, params);

    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to update the author.");
  }
});

// Deletes the selected author 14
app.get("/author/delete", async (req, res) => {
  try {
    const authorId = req.query.authorId;

    const sql = `
      DELETE FROM q_authors
      WHERE authorId = ?
    `;

    await conn.query(sql, [authorId]);

    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to delete the author.");
  }
});

// Displays the form used to add a new quote 15
app.get("/quote/new", async (req, res) => {
  try {
    const sql = `
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName
    `;

    const [authors] = await conn.query(sql);

    res.render("newQuote", {
      authors
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the quote form.");
  }
});

// Adds a new quote to the database 16
app.post("/quote/new", async (req, res) => {
  try {
    const sql = `
      INSERT INTO q_quotes
      (
        quote,
        authorId,
        category,
        likes
      )
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      req.body.quote,
      req.body.authorId,
      req.body.category,
      req.body.likes
    ];

    await conn.query(sql, params);

    const authorSql = `
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName
    `;

    const [authors] = await conn.query(authorSql);

    res.render("newQuote", {
      authors,
      message: "Quote added!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to add the quote.");
  }
});

// Retrieves and displays all quotes with author names 17
app.get("/quotes", async (req, res) => {
  try {
    const sql = `
      SELECT
        q_quotes.quoteId,
        q_quotes.quote,
        q_quotes.authorId,
        q_quotes.category,
        q_quotes.likes,
        q_authors.firstName,
        q_authors.lastName
      FROM q_quotes
      JOIN q_authors
        ON q_quotes.authorId = q_authors.authorId
      ORDER BY q_quotes.quoteId
    `;

    const [rows] = await conn.query(sql);

    res.render("quoteList", {
      quotes: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the quote list.");
  }
});

// Gets one quote and all authors for the edit form 18
app.get("/quote/edit", async (req, res) => {
  try {
    const quoteId = req.query.quoteId;

    const quoteSql = `
      SELECT *
      FROM q_quotes
      WHERE quoteId = ?
    `;

    const authorSql = `
      SELECT authorId, firstName, lastName
      FROM q_authors
      ORDER BY lastName
    `;

    const [quoteRows] = await conn.query(quoteSql, [quoteId]);
    const [authors] = await conn.query(authorSql);

    if (quoteRows.length === 0) {
      return res.status(404).send("Quote not found.");
    }

    res.render("editQuote", {
      quoteInfo: quoteRows,
      authors
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load the quote.");
  }
});

// Updates the selected quote 19
app.post("/quote/edit", async (req, res) => {
  try {
    const sql = `
      UPDATE q_quotes
      SET
        quote = ?,
        authorId = ?,
        category = ?,
        likes = ?
      WHERE quoteId = ?
    `;

    const params = [
      req.body.quote,
      req.body.authorId,
      req.body.category,
      req.body.likes,
      req.body.quoteId
    ];

    await conn.query(sql, params);

    res.redirect("/quotes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to update the quote.");
  }
});

// Deletes the selected quote 20
app.get("/quote/delete", async (req, res) => {
  try {
    const quoteId = req.query.quoteId;

    const sql = `
      DELETE FROM q_quotes
      WHERE quoteId = ?
    `;

    await conn.query(sql, [quoteId]);

    res.redirect("/quotes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to delete the quote.");
  }
});

// Uses Render's port when deployed and port 3000 locally 21
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});