"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export interface AuthState {
  success: boolean;
  error?: string;
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const name = (formData.get("name") as string)?.trim();
    const role = formData.get("role") as string;

    // Валідація
    if (!email || !password || !name || !role) {
      return { success: false, error: "Заповніть усі обов'язкові поля" };
    }

    if (password.length < 6) {
      return { success: false, error: "Пароль має бути мінімум 6 символів" };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Паролі не збігаються" };
    }

    // Перевірка на існуючий email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Користувач з таким email вже існує" };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    if (role === "STUDENT") {
      const groupId = formData.get("groupId") as string;
      const studentTicket = (formData.get("studentTicket") as string)?.trim();

      if (!groupId || !studentTicket) {
        return {
          success: false,
          error: "Для студента вкажіть групу та номер студентського квитка",
        };
      }

      // Перевірка унікальності квитка
      const existingTicket = await prisma.student.findUnique({
        where: { studentTicket },
      });
      if (existingTicket) {
        return {
          success: false,
          error: "Студент з таким номером квитка вже зареєстрований",
        };
      }

      // Створити студента + користувача в транзакції
      await prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
          data: {
            fullName: name,
            studentTicket,
            groupId,
          },
        });

        await tx.user.create({
          data: {
            email,
            passwordHash,
            name,
            role: "STUDENT",
            studentId: student.id,
          },
        });
      });
    } else {
      // Викладач
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "TEACHER",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Помилка при реєстрації. Спробуйте ще раз." };
  }
}
