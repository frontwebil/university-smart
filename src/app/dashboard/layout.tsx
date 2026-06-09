import { Suspense } from "react";
import { MockUserSwitcher } from "@/components/mock-user-switcher";
import { GraduationCap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  University-Smart
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5 leading-tight">
                  Система управління університетом
                </p>
              </div>
            </div>

            {/* Mock User Switcher */}
            <Suspense fallback={<div className="w-[300px] h-10 bg-muted rounded-md animate-pulse" />}>
              <MockUserSwitcher />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Завантаження...</p>
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 University-Smart (USMS) — MVP Прототип для демонстрації
          </p>
        </div>
      </footer>
    </div>
  );
}
