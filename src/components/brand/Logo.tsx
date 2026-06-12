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
 * FIXED: Removed overflow-hidden and stabilized icon dimensions to ensure visibility.
 * MATCHES: High-fidelity 3D emblem with mixed-case "Cracklix" typography.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png" 
        alt="Cracklix Emblem" 
        className="w-full h-full object-contain drop-shadow-xl"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/", iconOnly = false }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href={href} className={cn("flex items-center gap-3 md:gap-5 group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon className="w-12 h-12 md:w-16 md:h-16" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none">
          <div className="flex items-baseline font-headline">
            {/* Mixed Case "Cracklix" */}
            <span className={cn(
              "text-2xl md:text-4xl font-[900] tracking-tighter drop-shadow-md",
              isDark ? "text-[#0F172A]" : "text-white"
            )} style={{ 
               textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Crackli
            </span>
            {/* "x" in Bright Orange */}
            <span className="text-2xl md:text-4xl font-[900] tracking-tighter text-[#F97316] drop-shadow-lg">
              x
            </span>
          </div>
          
          {showTagline && (
            <div className="mt-1.5 flex items-center gap-2 w-full">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#F97316]/40" />
              <span className={cn(
                "text-[7px] md:text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap",
                isDark ? "text-slate-500" : "text-white/80"
              )}>
                PUNJAB&apos;S NO.1 STUDY HUB
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#F97316]/40" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
