"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import {
  editGradeAction,
  type GradeActionState,
} from "@/app/dashboard/actions";
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
import { GRADE_TYPES } from "@/lib/grades";
import {
  Pencil,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface EditGradeDialogProps {
  grade: {
    id: string;
    score: number;
    gradeType: string;
  };
  studentName: string;
  subjectTitle: string;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Зберегти"
      )}
    </Button>
  );
}

export function EditGradeDialog({
  grade,
  studentName,
  subjectTitle,
}: EditGradeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialState: GradeActionState = { success: false };
  const [state, formAction] = useFormState(editGradeAction, initialState);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600"
        title="Редагувати"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Редагувати оцінку</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form action={formAction} className="p-4 space-y-4">
          <input type="hidden" name="gradeId" value={grade.id} />

          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Студент:</strong> {studentName}
            </p>
            <p>
              <strong>Дисципліна:</strong> {subjectTitle}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Тип контролю</Label>
            <Select name="gradeType" defaultValue={grade.gradeType}>
              <SelectTrigger>
                <SelectValue />
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

          <div className="space-y-2">
            <Label>Бал (0-100)</Label>
            <Input
              name="score"
              type="number"
              min={0}
              max={100}
              defaultValue={grade.score}
              required
            />
          </div>

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

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Скасувати
            </Button>
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
}
