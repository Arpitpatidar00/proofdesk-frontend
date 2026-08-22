"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "./role-switcher";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { FileText, ClipboardList, Eye, Send } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const { isReviewer } = useAuth();

  const navItems = [
    ...(isReviewer
      ? [{ href: "/review", label: "Review Queue", icon: ClipboardList }]
      : []),
    { href: "/testimonials", label: "Testimonials", icon: Eye },
    { href: "/submit", label: "Submit", icon: Send },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={isReviewer ? "/review" : "/testimonials"} className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            Proof Desk
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
