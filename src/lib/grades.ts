// Утиліти для конвертації балів у шкалу ECTS та національну шкалу

export type EctsGrade = "A" | "B" | "C" | "D" | "E" | "F";

export type NationalGrade =
  | "Відмінно"
  | "Добре"
  | "Задовільно"
  | "Незадовільно";

/**
 * Конвертація балу (0-100) у літерну оцінку ECTS
 */
export function scoreToEcts(score: number): EctsGrade {
  if (score >= 90) return "A";
  if (score >= 82) return "B";
  if (score >= 74) return "C";
  if (score >= 64) return "D";
  if (score >= 60) return "E";
  return "F";
}

/**
 * Конвертація балу (0-100) у національну оцінку
 */
export function scoreToNational(score: number): NationalGrade {
  if (score >= 90) return "Відмінно";
  if (score >= 74) return "Добре";
  if (score >= 60) return "Задовільно";
  return "Незадовільно";
}

/**
 * Колір для оцінки ECTS
 */
export function ectsColor(ects: EctsGrade): string {
  switch (ects) {
    case "A":
      return "text-emerald-600 bg-emerald-50";
    case "B":
      return "text-green-600 bg-green-50";
    case "C":
      return "text-blue-600 bg-blue-50";
    case "D":
      return "text-yellow-600 bg-yellow-50";
    case "E":
      return "text-orange-600 bg-orange-50";
    case "F":
      return "text-red-600 bg-red-50";
  }
}

/**
 * Колір для бала
 */
export function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-700";
  if (score >= 74) return "text-green-700";
  if (score >= 60) return "text-blue-700";
  return "text-red-600";
}

/**
 * Типи контролю
 */
export const GRADE_TYPES = [
  "МКР",
  "Лабораторна",
  "Практична",
  "Іспит",
  "Залік",
] as const;

export type GradeType = (typeof GRADE_TYPES)[number];
