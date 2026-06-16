
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarToggle from './SidebarToggle';
import Logo from '@/components/brand/Logo';

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className="h-24 px-6 flex items-center justify-between shrink-0 relative border-b border-white/5">
      {/* LOGO NODE */}
      <div className={cn(
        "transition-all duration-300 flex items-center overflow-hidden shrink-0",
        isOpen ? "w-[180px] opacity-100" : "w-[52px] opacity-100 mx-auto justify-center"
      )}>
        {isOpen ? (
          <Logo href="/admin" variant="light" imgClassName="h-10 w-auto" />
        ) : (
          <img src="/logo/cracklix-logo.png" className="h-8 w-auto min-w-[32px] object-contain" alt="C" />
        )}
      </div>

      {/* TOGGLE BUTTON - FIXED RELATIVE TO SIDEBAR EDGE */}
      <div className="hidden lg:block">
        <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
      </div>
    </div>
  );
}
