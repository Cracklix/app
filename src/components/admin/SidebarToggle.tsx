'use client';

import React from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Cracklix Admin Sidebar Toggle v1.0
 *
 * Size: 40px × 40px
 * Icon: 20px
 * Radius: 16px
 */

export default function SidebarToggle({
  isOpen,
  onToggle,
}: SidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        isOpen
          ? 'Collapse Sidebar'
          : 'Expand Sidebar'
      }
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
        "border border-blue-500/20",
        "bg-blue-500/10 text-blue-500",
        "transition-all duration-200",
        "hover:bg-blue-600 hover:text-white hover:border-blue-600",
        "active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
        !isOpen && "mx-auto"
      )}
    >
      {isOpen ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelRight className="h-5 w-5" />
      )}
    </button>
  );
}