'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { LogOut, ShieldCheck } from "lucide-react";
import StudentAvatar from '@/components/brand/StudentAvatar';

interface SidebarFooterProps {
  isOpen: boolean;
  profile: any;
  handleLogout: () => void;
}

/**
 * Admin Sidebar Footer (PWA Optimized)
 */
export default function SidebarFooter({
  isOpen,
  profile,
  handleLogout,
}: SidebarFooterProps) {
  return (
    <div className="mt-auto border-t border-slate-50 bg-slate-50/50 p-4">

      {/* PROFILE */}
      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isOpen ? "px-1" : "justify-center"
        )}
      >
        <StudentAvatar
          profile={profile}
          className="h-11 w-11 rounded-xl border border-slate-200 shadow-sm shrink-0"
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
          <p className="truncate text-sm font-black text-[#0F172A]">
            {profile?.name || "Admin"}
          </p>

          <p className="truncate text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-2.5 w-2.5 text-primary" />
            {profile?.role?.replace('_', ' ') || "SUPER ADMIN"}
          </p>
        </div>
      </div>

      {/* LOGOUT - TITLE CASE PILL */}
      <button
        onClick={handleLogout}
        className={cn(
          "mt-4 flex h-11 w-full items-center justify-center rounded-xl transition-all duration-200 active:scale-95",
          isOpen
            ? "gap-3 bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-sm"
            : "text-slate-400 hover:text-rose-600"
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />

        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all duration-300",
            isOpen
              ? "max-w-[120px] opacity-100"
              : "max-w-0 opacity-0"
          )}
        >
          Sign Out
        </span>
      </button>

    </div>
  );
}
