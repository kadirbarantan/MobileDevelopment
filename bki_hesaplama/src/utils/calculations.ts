// ==================== Core BMI/BMR/Step Calculations ====================
import { BMICategory } from '../types';

// ─── WHO BMI Categories (8 categories) ──────────────────
export const BMI_CATEGORIES: BMICategory[] = [
  { label: 'Very Severely Underweight', labelTR: 'Çok Ciddi Zayıf', min: 0, max: 15, color: '#8B0000' },
  { label: 'Severely Underweight', labelTR: 'Ciddi Zayıf', min: 15, max: 16, color: '#B22222' },
  { label: 'Underweight', labelTR: 'Zayıf', min: 16, max: 18.5, color: '#D2691E' },
  { label: 'Normal', labelTR: 'Normal', min: 18.5, max: 25, color: '#228B22' },
  { label: 'Overweight', labelTR: 'Fazla Kilolu', min: 25, max: 30, color: '#DAA520' },
  { label: 'Obese Class I', labelTR: 'Obez Sınıf I', min: 30, max: 35, color: '#FF8C00' },
  { label: 'Obese Class II', labelTR: 'Obez Sınıf II', min: 35, max: 40, color: '#CD3700' },
  { label: 'Obese Class III', labelTR: 'Obez Sınıf III', min: 40, max: 100, color: '#7B241C' },
];

// ─── Activity Level Multipliers ─────────────────────────
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// ─── BMI Calculation ────────────────────────────────────
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 100) / 100; // 2 decimal precision
}

// ─── BMI Category Lookup ────────────────────────────────
export function getBMICategory(bmi: number): BMICategory {
  for (const cat of BMI_CATEGORIES) {
    if (bmi >= cat.min && bmi < cat.max) {
      return cat;
    }
  }
  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

// ─── BMR Calculation (Mifflin-St Jeor) ──────────────────
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);
  }
}

// ─── TDEE Calculation ───────────────────────────────────
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

// ─── Step Goal Calculation ──────────────────────────────
export function calculateStepGoal(calorieDeficit: number, weightKg: number): number {
  if (calorieDeficit <= 0 || weightKg <= 0) return 0;
  const steps = calorieDeficit / (0.04 * (weightKg / 70));
  return Math.round(steps);
}

// ─── Age From Birth Date ────────────────────────────────
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ─── Calorie Equivalents ────────────────────────────────
export function calculateFoodEquivalent(calories: number, caloriesPerPortion: number): number {
  if (caloriesPerPortion <= 0) return 0;
  return Math.round((calories / caloriesPerPortion) * 10) / 10;
}

// ─── Input Validation ───────────────────────────────────
export function validateHeight(cm: number): boolean {
  return cm >= 50 && cm <= 250;
}

export function validateWeight(kg: number): boolean {
  return kg >= 10 && kg <= 300;
}

// ─── Date Formatting ────────────────────────────────────
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateTimeTR(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${mins}`;
}

// ─── Filter Date Range ──────────────────────────────────
export function getFilterDateRange(filter: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (filter) {
    case '7G':
      start.setDate(end.getDate() - 7);
      break;
    case '1A':
      start.setMonth(end.getMonth() - 1);
      break;
    case '3A':
      start.setMonth(end.getMonth() - 3);
      break;
    default:
      start.setFullYear(2020);
      break;
  }

  return { start, end };
}
