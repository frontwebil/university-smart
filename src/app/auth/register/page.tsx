"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/app/auth/actions";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";

interface GroupOption {
  id: string;
  name: string;
  department: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Реєстрація...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Зареєструватися
        </>
      )}
    </Button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const initialState: AuthState = { success: false };
  const [state, formAction] = useFormState(registerAction, initialState);

  const [role, setRole] = useState("STUDENT");
  const [groups, setGroups] = useState<GroupOption[]>([]);

  // Завантажити групи для вибору
  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch(() => {});
  }, []);

  // Редірект після успішної реєстрації
  useEffect(() => {
    if (state.success) {
      router.push("/auth/login?registered=true");
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Реєстрація</CardTitle>
          <CardDescription>
            Створіть акаунт у University-Smart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Повне ім&apos;я (ПІБ)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Петренко Іван Олександрович"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Мінімум 6 символів"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Підтвердити пароль</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Повторіть пароль"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select
                name="role"
                value={role}
                onValueChange={setRole}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">👨‍🎓 Студент</SelectItem>
                  <SelectItem value="TEACHER">👨‍🏫 Викладач</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "STUDENT" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="groupId">Академічна група</Label>
                  <Select name="groupId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть групу..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name} — {g.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentTicket">
                    Номер студентського квитка
                  </Label>
                  <Input
                    id="studentTicket"
                    name="studentTicket"
                    placeholder="КВ-2024-0001"
                    required
                  />
                </div>
              </>
            )}

            {state.error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Вже маєте акаунт?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Увійти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
