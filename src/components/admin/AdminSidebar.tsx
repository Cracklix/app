'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  profile: any;
  handleLogout: () => void;
  pathname: string;
}

/**
 * Cracklix Admin Sidebar v1.0
 *
 * Desktop:
 * Expanded: 280px
 * Collapsed: 88px
 *
 * Mobile:
 * Width: 85vw
 * Max Width: 320px
 */

export default function AdminSidebar({
  isOpen,
  onToggle,
  onCloseMobile,
  profile,
  handleLogout,
  pathname,
}: AdminSidebarProps) {

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm transition-all duration-300 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[110] flex h-screen flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-white transition-all duration-300 ease-in-out",

          // Desktop
          "lg:translate-x-0",
          isOpen
            ? "lg:w-[280px]"
            : "lg:w-[88px]",

          // Mobile
          "w-[85vw] max-w-[320px]",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="relative flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">

          {/* HEADER */}
          <SidebarHeader
            isOpen={isOpen}
            onToggle={onToggle}
          />

          {/* NAVIGATION */}
          <SidebarNav
            isOpen={isOpen}
            pathname={pathname}
          />

          {/* FOOTER */}
          <SidebarFooter
            isOpen={isOpen}
            profile={profile}
            handleLogout={handleLogout}
          />

        </div>
      </aside>
    </>
  );
}