"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-puff-white border-b border-sand-200 flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-puff-muted">
          <User size={16} />
          <span>{user.name || user.email}</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-1.5 text-sm text-puff-muted hover:text-puff-dark transition-colors"
        >
          <LogOut size={15} />
          გასვლა
        </button>
      </div>
    </header>
  );
}
