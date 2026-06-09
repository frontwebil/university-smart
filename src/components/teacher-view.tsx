import { Decimal } from "@prisma/client/runtime/library";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AddGradeForm } from "@/components/add-grade-form";
import { GradeJournal } from "@/components/grade-journal";
import {
  Users,
  Award,
  TrendingUp,
  BarChart3,
  ClipboardList,
} from "lucide-react";

interface GradeWithSubject {
  id: string;
  score: number;
  gradeType: string;
  date: Date;
  subject: {
    id: string;
    title: string;
    ectsCredits: Decimal;
  };
}

interface StudentWithGrades {
  id: string;
  fullName: string;
  studentTicket: string;
  group: {
    name: string;
    department: string;
  };
  grades: GradeWithSubject[];
}

interface SubjectData {
  id: string;
  title: string;
}

interface StudentBasic {
  id: string;
  fullName: string;
}

interface TeacherViewProps {
  students: StudentWithGrades[];
  subjects: SubjectData[];
  allStudents: StudentBasic[];
}

export function TeacherView({
  students,
  subjects,
  allStudents,
}: TeacherViewProps) {
  const totalGrades = students.reduce((sum, s) => sum + s.grades.length, 0);
  const allScores = students.flatMap((s) => s.grades.map((g) => g.score));
  const avgScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;
  const excellentCount = allScores.filter((s) => s >= 90).length;

  // Flatten data into rows for the client-side GradeJournal
  const rows = students.flatMap((student) =>
    student.grades.map((grade) => ({
      gradeId: grade.id,
      score: grade.score,
      gradeType: grade.gradeType,
      date: grade.date.toISOString(),
      subjectId: grade.subject.id,
      subjectTitle: grade.subject.title,
      studentId: student.id,
      studentName: student.fullName,
      studentTicket: student.studentTicket,
      groupName: student.group.name,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Панель управління — Викладач
        </h2>
        <p className="text-muted-foreground">
          Перегляд усіх студентів, оцінок та додавання нових результатів
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Студентів</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {students.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Усього оцінок</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{totalGrades}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Середній бал</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{avgScore}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Відмінників</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">
              {excellentCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Grade Form */}
      <AddGradeForm students={allStudents} subjects={subjects} />

      {/* Grade Journal with Filters */}
      <GradeJournal rows={rows} />
    </div>
  );
}
