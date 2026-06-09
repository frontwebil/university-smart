"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, GraduationCap, BookOpen } from "lucide-react";

const MOCK_USERS = [
  {
    id: "student_petrenko",
    label: "👨‍🎓 Петренко Іван (Студент)",
    role: "student",
  },
  {
    id: "student_kovalenko",
    label: "👩‍🎓 Коваленко Марія (Студент)",
    role: "student",
  },
  {
    id: "teacher",
    label: "👨‍🏫 Викладач / Деканат",
    role: "teacher",
  },
] as const;

export function MockUserSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = searchParams.get("mockUser") || "teacher";

  const handleUserChange = (value: string) => {
    router.push(`/dashboard?mockUser=${value}`);
  };

  const currentUserInfo = MOCK_USERS.find((u) => u.id === currentUser);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>Роль:</span>
      </div>
      <Select value={currentUser} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[260px] sm:w-[300px] bg-white/80 backdrop-blur-sm">
          <SelectValue placeholder="Оберіть роль..." />
        </SelectTrigger>
        <SelectContent>
          {MOCK_USERS.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getCurrentMockUser(searchParams: { mockUser?: string }) {
  const userId = searchParams.mockUser || "teacher";
  const user = MOCK_USERS.find((u) => u.id === userId);
  return {
    id: userId,
    role: user?.role || "teacher",
    label: user?.label || "Викладач / Деканат",
    isStudent: user?.role === "student",
    isTeacher: userId === "teacher" || !user,
  };
}
