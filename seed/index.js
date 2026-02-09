import { BOOKS } from "./books.js";

import mysql from "mysql2/promise";

async function seed() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AlirezaHassaniEghtedar",
    database: "test",
  });

  const query = `
    INSERT INTO books
        (title, releaseDate, \`desc\`, pages, cover, price)
    VALUES ?
  `;

  const values = BOOKS.map((book) => [
    book.title,
    book.releaseDate,
    book.description,
    book.pages,
    book.cover,
    book.price,
  ]);

  await db.query(query, [values]);
  console.log("Books seeded successfully.");
  await db.end();
}

async function main() {
  seed().catch((err) => console.error(err));
}

main().then();
