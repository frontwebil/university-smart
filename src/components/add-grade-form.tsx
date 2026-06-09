"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addGradeAction, type GradeActionState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GRADE_TYPES } from "@/lib/grades";
import { PlusCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AddGradeFormProps {
  students: Array<{ id: string; fullName: string }>;
  subjects: Array<{ id: string; title: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Збереження...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Додати оцінку
        </>
      )}
    </Button>
  );
}

export function AddGradeForm({ students, subjects }: AddGradeFormProps) {
  const initialState: GradeActionState = { success: false };
  const [state, formAction] = useFormState(addGradeAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled state for Select components (Radix Select + Server Actions fix)
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [gradeType, setGradeType] = useState("");

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setStudentId("");
      setSubjectId("");
      setGradeType("");
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PlusCircle className="h-5 w-5 text-primary" />
          Додати оцінку
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Hidden inputs for reliable form submission */}
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="subjectId" value={subjectId} />
          <input type="hidden" name="gradeType" value={gradeType} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Студент */}
            <div className="space-y-2">
              <Label>Студент</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть студента..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Дисципліна */}
            <div className="space-y-2">
              <Label>Дисципліна</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть дисципліну..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Тип контролю */}
            <div className="space-y-2">
              <Label>Тип контролю</Label>
              <Select value={gradeType} onValueChange={setGradeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть тип..." />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Бал */}
            <div className="space-y-2">
              <Label>Бал (0-100)</Label>
              <Input
                name="score"
                type="number"
                min={0}
                max={100}
                placeholder="85"
                required
              />
            </div>

            {/* Кнопка */}
            <div className="flex items-end">
              <SubmitButton />
            </div>
          </div>

          {/* Feedback messages */}
          {state.success && state.message && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}
          {state.error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
