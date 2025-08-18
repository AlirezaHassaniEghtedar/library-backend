import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "AlirezaHassaniEghtedar",
  database: "test",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello Friend");
});

app.get("/books", (req, res) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, data) => {
    if (err) return res.json(`Error : ${err}`);
    return res.json(data);
  });
});

app.get("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const query = "SELECT * FROM books WHERE id = ?";

  db.query(query, [bookId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.length === 0)
      return res.status(404).json({ message: "Book not found" });
    return res.json(data[0]);
  });
});

app.post("/books", (req, res) => {
  const query =
    "INSERT INTO books (`title` , `releaseDate` , `desc` , `pages` , `cover` , `price`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.releaseDate,
    req.body.desc,
    req.body.pages,
    req.body.cover,
    req.body.price,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been created successfully");
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const query = "DELETE FROM books WHERE id = ?";

  db.query(query, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully");
  });
});

app.listen(5000, () => {
  console.log("running on port 5000 ...");
});
