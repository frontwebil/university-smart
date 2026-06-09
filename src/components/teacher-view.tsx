import { Decimal } from "@prisma/client/runtime/library";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddGradeForm } from "@/components/add-grade-form";
import { EditGradeDialog } from "@/components/edit-grade-dialog";
import { DeleteGradeButton } from "@/components/delete-grade-button";
import {
  scoreToEcts,
  scoreToNational,
  ectsColor,
  scoreColor,
} from "@/lib/grades";
import { formatDateShort } from "@/lib/utils";
import {
  Users,
  BookOpen,
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

      {/* All Students Grades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Журнал оцінок — Усі студенти
          </CardTitle>
          <CardDescription>
            Повний перелік студентів та їх результатів оцінювання
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Студент
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Група
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Дисципліна
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Бал
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ECTS
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Національна
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Дії
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.flatMap((student) =>
                  student.grades.map((grade) => {
                    const ects = scoreToEcts(grade.score);
                    const national = scoreToNational(grade.score);
                    return (
                      <tr
                        key={grade.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-medium text-sm">
                            {student.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.studentTicket}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className="text-xs">
                            {student.group.name}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          {grade.subject.title}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">
                            {grade.gradeType}
                          </Badge>
                        </td>
                        <td
                          className={`p-3 text-center font-bold text-lg ${scoreColor(grade.score)}`}
                        >
                          {grade.score}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${ectsColor(ects)}`}
                          >
                            {ects}
                          </span>
                        </td>
                        <td className="p-3 text-center text-sm">
                          {national}
                        </td>
                        <td className="p-3 text-center text-sm text-muted-foreground">
                          {formatDateShort(grade.date)}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <EditGradeDialog
                              grade={{
                                id: grade.id,
                                score: grade.score,
                                gradeType: grade.gradeType,
                              }}
                              studentName={student.fullName}
                              subjectTitle={grade.subject.title}
                            />
                            <DeleteGradeButton
                              gradeId={grade.id}
                              studentName={student.fullName}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {students.flatMap((student) =>
              student.grades.map((grade) => {
                const ects = scoreToEcts(grade.score);
                const national = scoreToNational(grade.score);
                return (
                  <div
                    key={grade.id}
                    className="rounded-lg border bg-white p-4 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {student.fullName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {student.group.name} • {student.studentTicket}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-base ${ectsColor(ects)}`}
                        >
                          {ects}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {grade.subject.title}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Бал
                        </span>
                        <p
                          className={`font-bold text-lg ${scoreColor(grade.score)}`}
                        >
                          {grade.score}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Національна
                        </span>
                        <p className="font-medium text-xs">{national}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Тип
                        </span>
                        <p>
                          <Badge variant="outline" className="text-xs">
                            {grade.gradeType}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {formatDateShort(grade.date)}
                      </span>
                      <div className="flex items-center gap-1">
                        <EditGradeDialog
                          grade={{
                            id: grade.id,
                            score: grade.score,
                            gradeType: grade.gradeType,
                          }}
                          studentName={student.fullName}
                          subjectTitle={grade.subject.title}
                        />
                        <DeleteGradeButton
                          gradeId={grade.id}
                          studentName={student.fullName}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalGrades === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Оцінки ще не виставлено</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
