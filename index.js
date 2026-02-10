import express from "express";
import cors from "cors";

import home from "./routes/home.js";
import books from "./routes/books.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", home);
app.use("/books", books);

app.listen(5000, () => {
  console.log("running on port 5000 ...");
});
