import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Open the database connection
const dbPromise = open({
  filename: String(process.env.DATABASE_FILENAME),
  driver: sqlite3.Database,
});

export default dbPromise;

// Create the users and tokens tables if they don't exist yet

(async () => {
  const db: Database<sqlite3.Database, sqlite3.Statement> = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      token_address TEXT,
      balance INTEGER default 00
    );
  `);
})();
