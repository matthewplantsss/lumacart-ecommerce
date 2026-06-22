const fs = require("fs");
const os = require("os");
const path = require("path");
const Database = require("better-sqlite3");

function getDatabaseDirectory() {
  if (process.env.LUMACART_DATA_DIR) {
    return process.env.LUMACART_DATA_DIR;
  }

  return path.join(__dirname);
}

const databaseDirectory = getDatabaseDirectory();

fs.mkdirSync(databaseDirectory, {
  recursive: true,
});

const databasePath = path.join(
  databaseDirectory,
  "lumacart.db"
);

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

console.log(`LumaCart database: ${databasePath}`);

module.exports = db;
