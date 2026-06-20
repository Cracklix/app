'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarToggle from './SidebarToggle';
import Logo from '@/components/brand/Logo';

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Cracklix Admin Sidebar Header v23.0.
 * BRAND SYSTEM: Maximized logo height for institutional authority.
 */
export default function SidebarHeader({
  isOpen,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "h-20 border-b border-white/5 px-4 shrink-0 flex items-center",
        isOpen ? "justify-between gap-4" : "justify-center"
      )}
    >
      <Logo
        href="/admin"
        variant="dark"
        iconOnly={!isOpen}
        align={isOpen ? "left" : "center"}
        className="transition-all duration-300"
        imgClassName={cn(
          isOpen ? "h-[50px] md:h-[60px]" : "h-12"
        )}
      />

      {isOpen && (
        <SidebarToggle
          isOpen={isOpen}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
