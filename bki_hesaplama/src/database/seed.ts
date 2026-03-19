// ==================== Seed Data: 20 Turkish Foods ====================
import { getDatabase } from './schema';

const FOODS = [
  { name: 'Beyaz Ekmek', portion_unit: 'dilim', portion_desc: '1 dilim (25g)', calories: 87 },
  { name: 'Tam Buğday Ekmeği', portion_unit: 'dilim', portion_desc: '1 dilim (25g)', calories: 81 },
  { name: 'Yumurta', portion_unit: 'adet', portion_desc: '1 adet (haşlanmış)', calories: 78 },
  { name: 'Pilav', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (150g)', calories: 195 },
  { name: 'Makarna', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (200g)', calories: 220 },
  { name: 'Bulgur Pilavı', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (150g)', calories: 170 },
  { name: 'Mercimek Çorbası', portion_unit: 'kase', portion_desc: '1 kase (250ml)', calories: 150 },
  { name: 'Yoğurt', portion_unit: 'kase', portion_desc: '1 kase (200g)', calories: 120 },
  { name: 'Süt', portion_unit: 'bardak', portion_desc: '1 bardak (200ml)', calories: 92 },
  { name: 'Beyaz Peynir', portion_unit: 'dilim', portion_desc: '1 dilim (30g)', calories: 80 },
  { name: 'Tavuk Göğsü', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (100g)', calories: 165 },
  { name: 'Kıyma', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (100g)', calories: 250 },
  { name: 'Kuru Fasulye', portion_unit: 'porsiyon', portion_desc: '1 porsiyon (200g)', calories: 240 },
  { name: 'Elma', portion_unit: 'adet', portion_desc: '1 adet (orta boy)', calories: 95 },
  { name: 'Muz', portion_unit: 'adet', portion_desc: '1 adet (orta boy)', calories: 105 },
  { name: 'Domates', portion_unit: 'adet', portion_desc: '1 adet (orta boy)', calories: 22 },
  { name: 'Zeytinyağı', portion_unit: 'yemek kaşığı', portion_desc: '1 yemek kaşığı (14ml)', calories: 120 },
  { name: 'Bal', portion_unit: 'tatlı kaşığı', portion_desc: '1 tatlı kaşığı (7g)', calories: 30 },
  { name: 'Ceviz', portion_unit: 'avuç', portion_desc: '1 avuç (28g)', calories: 196 },
  { name: 'Kuru Kayısı', portion_unit: 'adet', portion_desc: '3 adet (30g)', calories: 96 },
];

export async function seedFoods(): Promise<void> {
  const database = await getDatabase();

  const existingCount = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM foods'
  );

  if (existingCount && existingCount.count > 0) {
    return; // Already seeded
  }

  const insertStatement = await database.prepareAsync(
    'INSERT INTO foods (name, portion_unit, portion_desc, calories_per_portion) VALUES ($name, $unit, $desc, $cal)'
  );

  try {
    for (const food of FOODS) {
      await insertStatement.executeAsync({
        $name: food.name,
        $unit: food.portion_unit,
        $desc: food.portion_desc,
        $cal: food.calories,
      });
    }
  } finally {
    await insertStatement.finalizeAsync();
  }
}

export async function seedDefaultSettings(): Promise<void> {
  const database = await getDatabase();

  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM settings'
  );

  if (existing && existing.count > 0) {
    return;
  }

  await database.runAsync(
    'INSERT INTO settings (theme, biometric_lock, language) VALUES (?, ?, ?)',
    'dark', 0, 'tr'
  );
}
