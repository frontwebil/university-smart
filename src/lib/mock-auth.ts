// Спільна логіка mock-автентифікації
// Використовується і в серверних компонентах, і в клієнтських

export const MOCK_USERS = [
  {
    id: "student_petrenko",
    label: "👨‍🎓 Петренко Іван (Студент)",
    role: "student" as const,
  },
  {
    id: "student_kovalenko",
    label: "👩‍🎓 Коваленко Марія (Студент)",
    role: "student" as const,
  },
  {
    id: "teacher",
    label: "👨‍🏫 Викладач / Деканат",
    role: "teacher" as const,
  },
];

export function getCurrentMockUser(searchParams: { mockUser?: string }) {
  const userId = searchParams.mockUser || "teacher";
  const user = MOCK_USERS.find((u) => u.id === userId);
  return {
    id: userId,
    role: user?.role || "teacher",
    label: user?.label || "Викладач / Деканат",
    isStudent: user?.role === "student",
    isTeacher: userId === "teacher" || !user,
  };
}
