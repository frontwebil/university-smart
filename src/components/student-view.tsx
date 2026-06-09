import { Decimal } from "@prisma/client/runtime/library";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  scoreToEcts,
  scoreToNational,
  ectsColor,
  scoreColor,
} from "@/lib/grades";
import { formatDateShort } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface StudentGrade {
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

interface StudentData {
  id: string;
  fullName: string;
  studentTicket: string;
  group: {
    name: string;
    department: string;
  };
  grades: StudentGrade[];
}

export function StudentView({ student }: { student: StudentData }) {
  const avgScore =
    student.grades.length > 0
      ? Math.round(
          student.grades.reduce((sum, g) => sum + g.score, 0) /
            student.grades.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Student Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {student.fullName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-mono">
              {student.studentTicket}
            </Badge>
            <span>•</span>
            <span className="font-medium text-foreground">
              {student.group.name}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {student.group.department}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Дисциплін</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {new Set(student.grades.map((g) => g.subject.id)).size}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Оцінок</span>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {student.grades.length}
            </p>
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
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">ECTS</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">
              {avgScore > 0 ? scoreToEcts(avgScore) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Електронна заліковка */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Електронна заліковка
          </CardTitle>
          <CardDescription>
            Перелік дисциплін та результатів оцінювання
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table - hidden on mobile */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Дисципліна
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Кредити ЄКТС
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Тип контролю
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Бал (0-100)
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    ECTS
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Національна шкала
                  </th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {student.grades.map((grade) => {
                  const ects = scoreToEcts(grade.score);
                  const national = scoreToNational(grade.score);
                  return (
                    <tr
                      key={grade.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 font-medium">
                        {grade.subject.title}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {grade.subject.ectsCredits.toString()}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards - visible only on mobile */}
          <div className="sm:hidden space-y-3">
            {student.grades.map((grade) => {
              const ects = scoreToEcts(grade.score);
              const national = scoreToNational(grade.score);
              return (
                <div
                  key={grade.id}
                  className="rounded-lg border bg-white p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm leading-tight">
                      {grade.subject.title}
                    </h4>
                    <span
                      className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-base ${ectsColor(ects)}`}
                    >
                      {ects}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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
                      <p className="font-medium">{national}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Тип контролю
                      </span>
                      <p>
                        <Badge variant="outline" className="text-xs">
                          {grade.gradeType}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Кредити ЄКТС
                      </span>
                      <p className="font-medium">
                        {grade.subject.ectsCredits.toString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground pt-1 border-t">
                    {formatDateShort(grade.date)}
                  </div>
                </div>
              );
            })}
          </div>

          {student.grades.length === 0 && (
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
