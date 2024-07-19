"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
// Open the database connection
const dbPromise = (0, sqlite_1.open)({
    filename: String(process.env.DATABASE_FILENAME),
    driver: sqlite3_1.default.Database,
});
exports.default = dbPromise;
// Create the users and tokens tables if they don't exist yet
(async () => {
    const db = await dbPromise;
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
