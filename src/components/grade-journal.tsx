"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditGradeDialog } from "@/components/edit-grade-dialog";
import { DeleteGradeButton } from "@/components/delete-grade-button";
import {
  scoreToEcts,
  scoreToNational,
  ectsColor,
  scoreColor,
  GRADE_TYPES,
} from "@/lib/grades";
import { formatDateShort } from "@/lib/utils";
import {
  BookOpen,
  Search,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";

// Flat row for easy filtering
interface GradeRow {
  gradeId: string;
  score: number;
  gradeType: string;
  date: string; // ISO string (serialized from Date)
  subjectId: string;
  subjectTitle: string;
  studentId: string;
  studentName: string;
  studentTicket: string;
  groupName: string;
}

interface GradeJournalProps {
  rows: GradeRow[];
}

const ALL_VALUE = "__all__";

export function GradeJournal({ rows }: GradeJournalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState(ALL_VALUE);
  const [filterSubject, setFilterSubject] = useState(ALL_VALUE);
  const [filterGradeType, setFilterGradeType] = useState(ALL_VALUE);

  // Extract unique values for filter dropdowns
  const groups = useMemo(
    () => Array.from(new Set(rows.map((r) => r.groupName))).sort(),
    [rows]
  );
  const subjects = useMemo(
    () =>
      Array.from(new Map(rows.map((r) => [r.subjectId, r.subjectTitle])).entries())
        .map(([id, title]) => ({ id, title }))
        .sort((a, b) => a.title.localeCompare(b.title, "uk")),
    [rows]
  );

  // Apply filters
  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (
        searchQuery &&
        !row.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !row.studentTicket.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (filterGroup !== ALL_VALUE && row.groupName !== filterGroup)
        return false;
      if (filterSubject !== ALL_VALUE && row.subjectId !== filterSubject)
        return false;
      if (filterGradeType !== ALL_VALUE && row.gradeType !== filterGradeType)
        return false;
      return true;
    });
  }, [rows, searchQuery, filterGroup, filterSubject, filterGradeType]);

  const hasActiveFilters =
    searchQuery !== "" ||
    filterGroup !== ALL_VALUE ||
    filterSubject !== ALL_VALUE ||
    filterGradeType !== ALL_VALUE;

  function clearFilters() {
    setSearchQuery("");
    setFilterGroup(ALL_VALUE);
    setFilterSubject(ALL_VALUE);
    setFilterGradeType(ALL_VALUE);
  }

  return (
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
      <CardContent className="space-y-4">
        {/* ── Filter Bar ── */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Фільтри
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="space-y-1.5 lg:col-span-1">
              <Label className="text-xs text-muted-foreground">Пошук</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ім'я або квиток…"
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Group */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Група</Label>
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Усі групи</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Дисципліна
              </Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Усі дисципліни</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grade Type */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Тип контролю
              </Label>
              <Select
                value={filterGradeType}
                onValueChange={setFilterGradeType}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Усі типи</SelectItem>
                  {GRADE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear */}
            <div className="flex items-end">
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 w-full gap-1.5 text-sm"
                >
                  <X className="h-3.5 w-3.5" />
                  Скинути
                </Button>
              ) : (
                <div className="h-9 flex items-center text-xs text-muted-foreground px-2">
                  <Filter className="h-3.5 w-3.5 mr-1.5 opacity-40" />
                  Немає активних фільтрів
                </div>
              )}
            </div>
          </div>

          {/* Result count */}
          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground">
              Знайдено: <strong>{filtered.length}</strong> з {rows.length}{" "}
              оцінок
            </p>
          )}
        </div>

        {/* ── Desktop Table ── */}
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
              {filtered.map((row) => {
                const ects = scoreToEcts(row.score);
                const national = scoreToNational(row.score);
                return (
                  <tr
                    key={row.gradeId}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium text-sm">
                        {row.studentName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.studentTicket}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-xs">
                        {row.groupName}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">{row.subjectTitle}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">
                        {row.gradeType}
                      </Badge>
                    </td>
                    <td
                      className={`p-3 text-center font-bold text-lg ${scoreColor(row.score)}`}
                    >
                      {row.score}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${ectsColor(ects)}`}
                      >
                        {ects}
                      </span>
                    </td>
                    <td className="p-3 text-center text-sm">{national}</td>
                    <td className="p-3 text-center text-sm text-muted-foreground">
                      {formatDateShort(new Date(row.date))}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <EditGradeDialog
                          grade={{
                            id: row.gradeId,
                            score: row.score,
                            gradeType: row.gradeType,
                          }}
                          studentName={row.studentName}
                          subjectTitle={row.subjectTitle}
                        />
                        <DeleteGradeButton
                          gradeId={row.gradeId}
                          studentName={row.studentName}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="sm:hidden space-y-3">
          {filtered.map((row) => {
            const ects = scoreToEcts(row.score);
            const national = scoreToNational(row.score);
            return (
              <div
                key={row.gradeId}
                className="rounded-lg border bg-white p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm">
                      {row.studentName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {row.groupName} • {row.studentTicket}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-base ${ectsColor(ects)}`}
                  >
                    {ects}
                  </span>
                </div>
                <div className="text-sm font-medium text-primary">
                  {row.subjectTitle}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Бал</span>
                    <p
                      className={`font-bold text-lg ${scoreColor(row.score)}`}
                    >
                      {row.score}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Національна
                    </span>
                    <p className="font-medium text-xs">{national}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Тип</span>
                    <p>
                      <Badge variant="outline" className="text-xs">
                        {row.gradeType}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {formatDateShort(new Date(row.date))}
                  </span>
                  <div className="flex items-center gap-1">
                    <EditGradeDialog
                      grade={{
                        id: row.gradeId,
                        score: row.score,
                        gradeType: row.gradeType,
                      }}
                      studentName={row.studentName}
                      subjectTitle={row.subjectTitle}
                    />
                    <DeleteGradeButton
                      gradeId={row.gradeId}
                      studentName={row.studentName}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            {hasActiveFilters ? (
              <div className="space-y-2">
                <p>За обраними фільтрами оцінок не знайдено</p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Скинути фільтри
                </Button>
              </div>
            ) : (
              <p>Оцінки ще не виставлено</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
