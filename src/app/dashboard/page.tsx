import { prisma } from "@/lib/prisma";
import { getCurrentMockUser } from "@/lib/mock-auth";
import { StudentView } from "@/components/student-view";
import { TeacherView } from "@/components/teacher-view";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: { mockUser?: string };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = getCurrentMockUser(searchParams);

  if (user.isStudent) {
    // Отримати дані студента з оцінками
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      include: {
        group: true,
        grades: {
          include: { subject: true },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!student) {
      return (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Студента не знайдено</p>
        </div>
      );
    }

    return <StudentView student={student} />;
  }

  // Режим викладача / деканату
  const students = await prisma.student.findMany({
    include: {
      group: true,
      grades: {
        include: { subject: true },
        orderBy: { date: "desc" },
      },
    },
    orderBy: { fullName: "asc" },
  });

  const subjects = await prisma.subject.findMany({
    orderBy: { title: "asc" },
  });

  const allStudents = await prisma.student.findMany({
    orderBy: { fullName: "asc" },
  });

  return (
    <TeacherView
      students={students}
      subjects={subjects}
      allStudents={allStudents}
    />
  );
}
