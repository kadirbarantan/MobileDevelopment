// ==================== Database Service Layer ====================
import { getDatabase } from './schema';
import { User, Measurement, Food, Settings } from '../types';

// ─── USERS ──────────────────────────────────────────────
export async function createUser(user: Omit<User, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO users (full_name, birth_date, gender, height_cm, initial_weight_kg, target_weight_kg, activity_level)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    user.full_name, user.birth_date, user.gender, user.height_cm,
    user.initial_weight_kg, user.target_weight_kg, user.activity_level
  );
  return result.lastInsertRowId;
}

export async function getUser(id: number): Promise<User | null> {
  const db = await getDatabase();
  return db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', id);
}

export async function getFirstUser(): Promise<User | null> {
  const db = await getDatabase();
  return db.getFirstAsync<User>('SELECT * FROM users ORDER BY id ASC LIMIT 1');
}

export async function updateUser(id: number, user: Partial<User>): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (user.full_name !== undefined) { fields.push('full_name = ?'); values.push(user.full_name); }
  if (user.birth_date !== undefined) { fields.push('birth_date = ?'); values.push(user.birth_date); }
  if (user.gender !== undefined) { fields.push('gender = ?'); values.push(user.gender); }
  if (user.height_cm !== undefined) { fields.push('height_cm = ?'); values.push(user.height_cm); }
  if (user.initial_weight_kg !== undefined) { fields.push('initial_weight_kg = ?'); values.push(user.initial_weight_kg); }
  if (user.target_weight_kg !== undefined) { fields.push('target_weight_kg = ?'); values.push(user.target_weight_kg); }
  if (user.activity_level !== undefined) { fields.push('activity_level = ?'); values.push(user.activity_level); }

  if (fields.length > 0) {
    values.push(id);
    await db.runAsync(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, ...values);
  }
}

// ─── MEASUREMENTS ───────────────────────────────────────
export async function addMeasurement(m: Omit<Measurement, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO measurements (user_id, measured_at, height_cm, weight_kg, bmi_value, bmi_category, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    m.user_id, m.measured_at, m.height_cm, m.weight_kg, m.bmi_value, m.bmi_category, m.note || null
  );
  return result.lastInsertRowId;
}

export async function getMeasurements(userId: number, limit?: number): Promise<Measurement[]> {
  const db = await getDatabase();
  const query = `SELECT * FROM measurements WHERE user_id = ? ORDER BY measured_at DESC${limit ? ` LIMIT ${limit}` : ''}`;
  return db.getAllAsync<Measurement>(query, userId);
}

export async function getLatestMeasurement(userId: number): Promise<Measurement | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Measurement>(
    'SELECT * FROM measurements WHERE user_id = ? ORDER BY measured_at DESC LIMIT 1',
    userId
  );
}

export async function getMeasurementsInRange(userId: number, startDate: string, endDate: string): Promise<Measurement[]> {
  const db = await getDatabase();
  return db.getAllAsync<Measurement>(
    'SELECT * FROM measurements WHERE user_id = ? AND measured_at >= ? AND measured_at <= ? ORDER BY measured_at ASC',
    userId, startDate, endDate
  );
}

export async function getTodayMeasurementCount(userId: number): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM measurements WHERE user_id = ? AND date(measured_at) = date('now', 'localtime')`,
    userId
  );
  return result?.count || 0;
}

export async function deleteMeasurement(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM measurements WHERE id = ?', id);
}

// ─── FOODS ──────────────────────────────────────────────
export async function getAllFoods(): Promise<Food[]> {
  const db = await getDatabase();
  return db.getAllAsync<Food>('SELECT * FROM foods ORDER BY name ASC');
}

// ─── SETTINGS ───────────────────────────────────────────
export async function getSettings(): Promise<Settings | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Settings>('SELECT * FROM settings ORDER BY id ASC LIMIT 1');
}

export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (settings.theme !== undefined) { fields.push('theme = ?'); values.push(settings.theme); }
  if (settings.biometric_lock !== undefined) { fields.push('biometric_lock = ?'); values.push(settings.biometric_lock ? 1 : 0); }
  if (settings.language !== undefined) { fields.push('language = ?'); values.push(settings.language); }

  if (fields.length > 0) {
    await db.runAsync(`UPDATE settings SET ${fields.join(', ')} WHERE id = 1`, ...values);
  }
}
