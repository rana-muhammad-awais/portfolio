"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  FolderOpen,
  Briefcase,
  MessageSquare,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import ThemeProvider from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-subtle bg-surface/50 flex flex-col shrink-0">
          <div className="p-6 border-b border-subtle">
            <a href="/" className="flex items-center gap-2 text-content-dim hover:text-content text-sm transition-colors">
              <ChevronLeft size={14} />
              Back to site
            </a>
            <h1 className="text-xl font-heading font-bold gradient-text mt-3">
              Admin Panel
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet/10 text-violet"
                      : "text-content-dim hover:text-content hover:bg-[var(--subtle-hover)]"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t border-subtle">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-content-dim hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 w-full"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
