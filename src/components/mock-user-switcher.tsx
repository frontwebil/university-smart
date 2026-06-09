"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-auth";

export function MockUserSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = searchParams.get("mockUser") || "teacher";

  const handleUserChange = (value: string) => {
    router.push(`/dashboard?mockUser=${value}`);
  };

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
