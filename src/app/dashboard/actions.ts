"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GRADE_TYPES } from "@/lib/grades";

export interface AddGradeState {
  success: boolean;
  error?: string;
  message?: string;
}

export async function addGradeAction(
  _prevState: AddGradeState,
  formData: FormData
): Promise<AddGradeState> {
  try {
    const studentId = formData.get("studentId") as string;
    const subjectId = formData.get("subjectId") as string;
    const score = parseInt(formData.get("score") as string, 10);
    const gradeType = formData.get("gradeType") as string;

    // Валідація
    if (!studentId || !subjectId || !gradeType) {
      return { success: false, error: "Будь ласка, заповніть всі поля" };
    }

    if (isNaN(score) || score < 0 || score > 100) {
      return { success: false, error: "Бал має бути від 0 до 100" };
    }

    if (!GRADE_TYPES.includes(gradeType as any)) {
      return { success: false, error: "Невірний тип контролю" };
    }

    // Перевіримо чи існують студент та дисципліна
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return { success: false, error: "Студента не знайдено" };
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subject) {
      return { success: false, error: "Дисципліну не знайдено" };
    }

    // Створення оцінки
    await prisma.grade.create({
      data: {
        studentId,
        subjectId,
        score,
        gradeType,
        date: new Date(),
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Оцінку ${score} успішно додано для ${student.fullName}`,
    };
  } catch (error) {
    console.error("Error adding grade:", error);
    return { success: false, error: "Помилка при збереженні оцінки" };
  }
}
