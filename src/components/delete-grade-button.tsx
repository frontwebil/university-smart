"use client";

import { useState } from "react";
import { deleteGradeAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, X } from "lucide-react";

interface DeleteGradeButtonProps {
  gradeId: string;
  studentName: string;
}

export function DeleteGradeButton({
  gradeId,
  studentName,
}: DeleteGradeButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteGradeAction(gradeId);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-red-600">Видалити оцінку?</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ви впевнені, що хочете видалити оцінку для{" "}
            <strong>{studentName}</strong>? Цю дію не можна скасувати.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirming(false)}
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Видалити
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
      title="Видалити"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
