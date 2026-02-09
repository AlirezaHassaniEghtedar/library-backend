import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "AlirezaHassaniEghtedar",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello Friend");
});

app.get("/books", async (req, res) => {
  try {
    const query = "SELECT * FROM books";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = "SELECT * FROM books WHERE id = ?";
    const [rows] = await db.query(query, [bookId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Book was not found." });
    }
    console.log("rows : ", rows);
    return res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/books", async (req, res) => {
  try {
    const query = `
      INSERT INTO books
        (title, releaseDate, \`desc\`, pages, cover, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.title,
      req.body.releaseDate,
      req.body.desc,
      req.body.pages,
      req.body.cover,
      req.body.price,
    ];

    await db.query(query, values);

    return res
      .status(201)
      .json({ message: "The book has been created successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = `DELETE FROM books WHERE id = ?`;

    const [result] = await db.query(query, [bookId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "The book was not found." });
    }

    return res
      .status(200)
      .json({ message: "The book has been deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = `
    UPDATE books
    SET title = ?, releaseDate = ?, \`desc\` = ?, pages = ?, cover = ?, price = ?
    WHERE id = ?
  `;

    const values = [
      req.body.title,
      req.body.releaseDate,
      req.body.desc,
      req.body.pages,
      req.body.cover,
      req.body.price,
      bookId,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "The book was not found." });
    }

    return res
      .status(200)
      .json({ message: "The book has been updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("running on port 5000 ...");
});
