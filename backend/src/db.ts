import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'tasks.db');

let db: Database | null = null;

async function init(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database or create new one
  let data: Uint8Array | undefined;
  if (fs.existsSync(DB_PATH)) {
    data = fs.readFileSync(DB_PATH);
  }

  db = new SQL.Database(data);

  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      type TEXT DEFAULT 'normal',
      created TEXT NOT NULL,
      info TEXT,
      maxDate TEXT,
      maxTime TEXT,
      reopen INTEGER DEFAULT 1,
      timer INTEGER DEFAULT 0,
      closed INTEGER DEFAULT 0,
      result TEXT,
      closed_date TEXT
    );

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      type TEXT DEFAULT 'log',
      text TEXT NOT NULL,
      path TEXT DEFAULT '',
      date TEXT NOT NULL,
      song_length TEXT,
      status TEXT DEFAULT 'in_process',
      created TEXT NOT NULL
    );
  `);

  // Save initial schema
  save();

  return db;
}

function save(): void {
  if (!db) return;
  const data = db.export();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export { init, save };
export default init;
