'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import StudentAvatar from '@/components/brand/StudentAvatar';

interface SidebarFooterProps {
  isOpen: boolean;
  profile: any;
  handleLogout: () => void;
}

export default function SidebarFooter({
  isOpen,
  profile,
  handleLogout,
}: SidebarFooterProps) {
  return (
    <div className="mt-auto border-t border-white/5 bg-slate-950/40 p-4">

      {/* PROFILE */}
      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isOpen ? "px-1" : "justify-center"
        )}
      >
        <StudentAvatar
          profile={profile}
          className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 shrink-0"
          iconClassName="w-5 h-5"
        />

        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden transition-all duration-300",
            isOpen
              ? "opacity-100 max-w-[160px]"
              : "opacity-0 max-w-0 pointer-events-none"
          )}
        >
          <p className="truncate text-sm font-bold text-white">
            {profile?.name || "ADMIN"}
          </p>

          <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {profile?.role || "SUPER_ADMIN"}
          </p>
        </div>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className={cn(
          "mt-4 flex h-12 w-full items-center justify-center rounded-2xl transition-all duration-200 active:scale-95",
          isOpen
            ? "gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
            : "text-slate-500 hover:text-red-400"
        )}
      >
        <LogOut className="h-5 w-5 shrink-0" />

        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-[12px] font-bold uppercase tracking-widest transition-all duration-300",
            isOpen
              ? "max-w-[120px] opacity-100"
              : "max-w-0 opacity-0"
          )}
        >
          Log Out
        </span>
      </button>

    </div>
  );
}