import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "AlirezaHassaniEghtedar",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
});

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM books";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = "SELECT * FROM books WHERE id = ?";
    const [rows] = await db.query(query, [bookId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Book was not found." });
    }
    return res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

export default router;
