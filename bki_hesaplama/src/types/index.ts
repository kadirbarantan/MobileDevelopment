// ==================== Type Definitions ====================

export interface User {
  id?: number;
  full_name: string;
  birth_date: string;
  gender: 'male' | 'female';
  height_cm: number;
  initial_weight_kg: number;
  target_weight_kg: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface Measurement {
  id?: number;
  user_id: number;
  measured_at: string;
  height_cm: number;
  weight_kg: number;
  bmi_value: number;
  bmi_category: string;
  note?: string;
}

export interface Food {
  id?: number;
  name: string;
  portion_unit: string;
  portion_desc: string;
  calories_per_portion: number;
}

export interface Settings {
  id?: number;
  theme: 'light' | 'dark';
  biometric_lock: boolean;
  language: 'tr' | 'en';
}

export interface BMICategory {
  label: string;
  labelTR: string;
  min: number;
  max: number;
  color: string;
}

export interface BMRResult {
  bmr: number;
  tdee: number;
  calorieDeficit: number;
  calorieSurplus: number;
}

export interface StepGoalResult {
  dailySteps: number;
  caloriesBurned: number;
}

export type ChartFilter = '7G' | '1A' | '3A' | 'ALL';
