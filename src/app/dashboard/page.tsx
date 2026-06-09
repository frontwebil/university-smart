import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentView } from "@/components/student-view";
import { TeacherView } from "@/components/teacher-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const { role, studentId } = session.user;

  if (role === "STUDENT" && studentId) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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
          <p className="text-muted-foreground">
            Профіль студента не знайдено
          </p>
        </div>
      );
    }

    return <StudentView student={student} />;
  }

  // Режим викладача
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
