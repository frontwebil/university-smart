"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="text-muted-foreground hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline ml-2">Вийти</span>
    </Button>
  );
}
