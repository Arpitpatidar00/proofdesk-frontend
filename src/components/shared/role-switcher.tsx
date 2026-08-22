"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, Eye } from "lucide-react";
import type { UserRole } from "@/types";

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof Shield }> = {
  REVIEWER: { label: "Reviewer", icon: Shield },
  VIEWER: { label: "Viewer", icon: Eye },
};

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
        <Icon className="h-4 w-4" />
          {config.label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
          const roleConfig = ROLE_CONFIG[role];
          const RoleIcon = roleConfig.icon;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className={user.role === role ? "bg-accent" : ""}
            >
              <RoleIcon className="mr-2 h-4 w-4" />
              {roleConfig.label}
              <span className="ml-2 text-xs text-muted-foreground">
                {role === "REVIEWER"
                  ? "reviewer@proofdesk.local"
                  : "viewer@proofdesk.local"}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
