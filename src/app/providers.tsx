"use client";

import { QueryProvider } from "@/lib/query/query-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { AppHeader } from "@/components/shared/app-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
