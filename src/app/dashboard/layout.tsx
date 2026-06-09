import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const roleLabel =
    session.user.role === "TEACHER" ? "Викладач" : "Студент";
  const roleEmoji = session.user.role === "TEACHER" ? "👨‍🏫" : "👨‍🎓";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                University-Smart
              </h1>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {roleEmoji} {roleLabel}
            </Badge>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
