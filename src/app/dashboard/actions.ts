"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GRADE_TYPES } from "@/lib/grades";

export interface GradeActionState {
  success: boolean;
  error?: string;
  message?: string;
}

// === Додати оцінку ===
export async function addGradeAction(
  _prevState: GradeActionState,
  formData: FormData
): Promise<GradeActionState> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return { success: false, error: "Тільки викладач може додавати оцінки" };
  }

  try {
    const studentId = formData.get("studentId") as string;
    const subjectId = formData.get("subjectId") as string;
    const score = parseInt(formData.get("score") as string, 10);
    const gradeType = formData.get("gradeType") as string;

    if (!studentId || !subjectId || !gradeType) {
      return { success: false, error: "Будь ласка, заповніть всі поля" };
    }

    if (isNaN(score) || score < 0 || score > 100) {
      return { success: false, error: "Бал має бути від 0 до 100" };
    }

    if (!GRADE_TYPES.includes(gradeType as any)) {
      return { success: false, error: "Невірний тип контролю" };
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return { success: false, error: "Студента не знайдено" };
    }

    await prisma.grade.create({
      data: { studentId, subjectId, score, gradeType, date: new Date() },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Оцінку ${score} додано для ${student.fullName}`,
    };
  } catch (error) {
    console.error("Error adding grade:", error);
    return { success: false, error: "Помилка при збереженні оцінки" };
  }
}

// === Редагувати оцінку ===
export async function editGradeAction(
  _prevState: GradeActionState,
  formData: FormData
): Promise<GradeActionState> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return { success: false, error: "Тільки викладач може редагувати оцінки" };
  }

  try {
    const gradeId = formData.get("gradeId") as string;
    const score = parseInt(formData.get("score") as string, 10);
    const gradeType = formData.get("gradeType") as string;

    if (!gradeId || !gradeType) {
      return { success: false, error: "Заповніть всі поля" };
    }

    if (isNaN(score) || score < 0 || score > 100) {
      return { success: false, error: "Бал має бути від 0 до 100" };
    }

    const grade = await prisma.grade.findUnique({ where: { id: gradeId } });
    if (!grade) {
      return { success: false, error: "Оцінку не знайдено" };
    }

    await prisma.grade.update({
      where: { id: gradeId },
      data: { score, gradeType },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Оцінку оновлено" };
  } catch (error) {
    console.error("Error editing grade:", error);
    return { success: false, error: "Помилка при оновленні оцінки" };
  }
}

// === Видалити оцінку ===
export async function deleteGradeAction(
  gradeId: string
): Promise<GradeActionState> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return { success: false, error: "Тільки викладач може видаляти оцінки" };
  }

  try {
    const grade = await prisma.grade.findUnique({ where: { id: gradeId } });
    if (!grade) {
      return { success: false, error: "Оцінку не знайдено" };
    }

    await prisma.grade.delete({ where: { id: gradeId } });

    revalidatePath("/dashboard");
    return { success: true, message: "Оцінку видалено" };
  } catch (error) {
    console.error("Error deleting grade:", error);
    return { success: false, error: "Помилка при видаленні оцінки" };
  }
}
