import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Початок заповнення бази даних...");

  // Очищення існуючих даних
  await prisma.grade.deleteMany();
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.group.deleteMany();

  // === Створення Академічних Груп ===
  const groupIPZ = await prisma.group.create({
    data: {
      id: "group_ipz_22_1",
      name: "ІПЗ-22-1",
      department: "Факультет інформаційних технологій",
    },
  });

  const groupKN = await prisma.group.create({
    data: {
      id: "group_kn_21_2",
      name: "КН-21-2",
      department: "Факультет комп'ютерних наук",
    },
  });

  console.log("✅ Групи створено:", groupIPZ.name, groupKN.name);

  // === Створення Студентів ===
  const student1 = await prisma.student.create({
    data: {
      id: "student_petrenko",
      fullName: "Петренко Іван Олександрович",
      studentTicket: "КВ-2022-0001",
      groupId: groupIPZ.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      id: "student_kovalenko",
      fullName: "Коваленко Марія Петрівна",
      studentTicket: "КВ-2022-0002",
      groupId: groupIPZ.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      id: "student_shevchenko",
      fullName: "Шевченко Андрій Вікторович",
      studentTicket: "КВ-2021-0015",
      groupId: groupKN.id,
    },
  });

  const student4 = await prisma.student.create({
    data: {
      id: "student_bondarenko",
      fullName: "Бондаренко Олена Ігорівна",
      studentTicket: "КВ-2021-0016",
      groupId: groupKN.id,
    },
  });

  console.log("✅ Студентів створено:", 4);

  // === Створення Користувачів (акаунти для входу) ===
  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.create({
    data: {
      email: "teacher@usms.edu",
      passwordHash,
      name: "Професор Іваненко О.М.",
      role: "TEACHER",
    },
  });

  await prisma.user.create({
    data: {
      email: "petrenko@usms.edu",
      passwordHash,
      name: "Петренко Іван Олександрович",
      role: "STUDENT",
      studentId: student1.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "kovalenko@usms.edu",
      passwordHash,
      name: "Коваленко Марія Петрівна",
      role: "STUDENT",
      studentId: student2.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "shevchenko@usms.edu",
      passwordHash,
      name: "Шевченко Андрій Вікторович",
      role: "STUDENT",
      studentId: student3.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "bondarenko@usms.edu",
      passwordHash,
      name: "Бондаренко Олена Ігорівна",
      role: "STUDENT",
      studentId: student4.id,
    },
  });

  console.log("✅ Користувачів створено: 5 (1 викладач + 4 студенти)");

  // === Створення Дисциплін ===
  const subjectWeb = await prisma.subject.create({
    data: {
      id: "subject_web",
      title: "Веб-технології та програмування",
      ectsCredits: 5.0,
    },
  });

  const subjectDB = await prisma.subject.create({
    data: {
      id: "subject_db",
      title: "Бази даних та інформаційні системи",
      ectsCredits: 4.0,
    },
  });

  const subjectAlgo = await prisma.subject.create({
    data: {
      id: "subject_algo",
      title: "Алгоритми та структури даних",
      ectsCredits: 6.0,
    },
  });

  const subjectOS = await prisma.subject.create({
    data: {
      id: "subject_os",
      title: "Операційні системи",
      ectsCredits: 4.5,
    },
  });

  console.log("✅ Дисциплін створено:", 4);

  // === Створення Оцінок ===
  const gradesData = [
    // Петренко Іван
    { studentId: student1.id, subjectId: subjectWeb.id, score: 92, gradeType: "Іспит", date: new Date("2025-01-15") },
    { studentId: student1.id, subjectId: subjectDB.id, score: 85, gradeType: "Залік", date: new Date("2025-01-18") },
    { studentId: student1.id, subjectId: subjectAlgo.id, score: 78, gradeType: "МКР", date: new Date("2024-12-10") },
    { studentId: student1.id, subjectId: subjectOS.id, score: 88, gradeType: "Лабораторна", date: new Date("2024-11-28") },

    // Коваленко Марія
    { studentId: student2.id, subjectId: subjectWeb.id, score: 95, gradeType: "Іспит", date: new Date("2025-01-15") },
    { studentId: student2.id, subjectId: subjectDB.id, score: 90, gradeType: "Залік", date: new Date("2025-01-18") },
    { studentId: student2.id, subjectId: subjectAlgo.id, score: 67, gradeType: "Практична", date: new Date("2024-12-12") },

    // Шевченко Андрій
    { studentId: student3.id, subjectId: subjectWeb.id, score: 73, gradeType: "Іспит", date: new Date("2025-01-15") },
    { studentId: student3.id, subjectId: subjectDB.id, score: 55, gradeType: "МКР", date: new Date("2024-12-05") },
    { studentId: student3.id, subjectId: subjectAlgo.id, score: 82, gradeType: "Лабораторна", date: new Date("2024-11-20") },

    // Бондаренко Олена
    { studentId: student4.id, subjectId: subjectDB.id, score: 97, gradeType: "Іспит", date: new Date("2025-01-18") },
    { studentId: student4.id, subjectId: subjectOS.id, score: 45, gradeType: "Залік", date: new Date("2025-01-22") },
  ];

  for (const grade of gradesData) {
    await prisma.grade.create({ data: grade });
  }

  console.log("✅ Оцінок створено:", gradesData.length);
  console.log("");
  console.log("🎉 База даних успішно заповнена!");
  console.log("");
  console.log("📋 Тестові акаунти (пароль для всіх: password123):");
  console.log("   👨‍🏫 Викладач:  teacher@usms.edu");
  console.log("   👨‍🎓 Студент 1: petrenko@usms.edu");
  console.log("   👩‍🎓 Студент 2: kovalenko@usms.edu");
  console.log("   👨‍🎓 Студент 3: shevchenko@usms.edu");
  console.log("   👩‍🎓 Студент 4: bondarenko@usms.edu");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Помилка при заповненні:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
