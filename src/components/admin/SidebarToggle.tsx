
'use client';

import React from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * @fileOverview Refined Sidebar Toggle.
 * Positioned absolute at the right edge to prevent overlap.
 */
export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "absolute top-6 right-[-22px] h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-90 transition-all z-[100] border-4 border-[#0F172A]",
      )}
      aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
    >
      {isOpen ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelRight className="h-5 w-5" />
      )}
    </button>
  );
}
