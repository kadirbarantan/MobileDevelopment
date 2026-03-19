// ==================== Database Schema & Initialization ====================
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'bki_takip.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync('PRAGMA journal_mode = WAL;');
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
      height_cm REAL NOT NULL CHECK(height_cm >= 50 AND height_cm <= 250),
      initial_weight_kg REAL NOT NULL CHECK(initial_weight_kg >= 10 AND initial_weight_kg <= 300),
      target_weight_kg REAL CHECK(target_weight_kg >= 10 AND target_weight_kg <= 300),
      activity_level TEXT NOT NULL DEFAULT 'moderate' CHECK(activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'))
    );

    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      measured_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      height_cm REAL NOT NULL CHECK(height_cm >= 50 AND height_cm <= 250),
      weight_kg REAL NOT NULL CHECK(weight_kg >= 10 AND weight_kg <= 300),
      bmi_value REAL NOT NULL,
      bmi_category TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      portion_unit TEXT NOT NULL,
      portion_desc TEXT NOT NULL,
      calories_per_portion REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      theme TEXT NOT NULL DEFAULT 'dark' CHECK(theme IN ('light', 'dark')),
      biometric_lock INTEGER NOT NULL DEFAULT 0,
      language TEXT NOT NULL DEFAULT 'tr' CHECK(language IN ('tr', 'en'))
    );
  `);
}
