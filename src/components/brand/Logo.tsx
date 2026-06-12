'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  href?: string;
  iconOnly?: boolean;
}

/**
 * @fileOverview Official Cracklix Logo Component.
 * UPDATED: Integrated new high-fidelity image icon and refined 3D typography.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix Emblem" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/", iconOnly = false }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href={href} className={cn("flex items-center gap-0 md:gap-1 group pointer-events-auto select-none shrink-0", className)}>
      {/* 1. Official Emblem Node */}
      <LogoIcon className="w-12 h-12 md:w-20 md:h-20" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none -ml-1 md:-ml-2">
          {/* 2. Brand Name Node (Split White/Orange) */}
          <div className="flex items-baseline">
            <span className={cn(
              "text-3xl md:text-6xl font-black tracking-tighter font-headline",
              isDark ? "text-slate-900" : "text-white"
            )} style={{ 
               filter: 'drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))'
            }}>
              Crack
            </span>
            <span className="text-3xl md:text-6xl font-black tracking-tighter font-headline bg-gradient-to-b from-[#FFB800] to-[#F97316] bg-clip-text text-transparent" style={{
               filter: 'drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))'
            }}>
              lix
            </span>
          </div>
          
          {/* 3. Accented Tagline Node */}
          {showTagline && (
            <div className="mt-1 flex items-center gap-2 w-full">
              <div className="h-[1.2px] flex-1 bg-[#F97316] opacity-80" />
              <span className={cn(
                "text-[7px] md:text-[11px] font-black uppercase tracking-[0.05em] whitespace-nowrap",
                isDark ? "text-slate-500" : "text-white"
              )}>
                PUNJAB&apos;S NO.1 STUDY HUB
              </span>
              <div className="h-[1.2px] flex-1 bg-[#F97316] opacity-80" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
