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
 * UPDATED: Fixed permanent image-based logo with user-provided high-fidelity asset.
 * MATCHES: Stylized 3D icon and mixed-case "Cracklix" typography.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden", className)}>
      <img 
        src="https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png" 
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
    <Link href={href} className={cn("flex items-center gap-3 md:gap-4 group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon className="w-10 h-10 md:w-14 md:h-14" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none">
          <div className="flex items-baseline font-headline">
            {/* Mixed Case "Cracklix" */}
            <span className={cn(
              "text-2xl md:text-4xl font-[900] tracking-tighter drop-shadow-md",
              isDark ? "text-[#0F172A]" : "text-white"
            )} style={{ 
               textShadow: '0px 2px 0px rgba(226, 232, 240, 0.1)'
            }}>
              Crackli
            </span>
            {/* "x" in Bright Orange */}
            <span className="text-2xl md:text-4xl font-[900] tracking-tighter text-[#F97316] drop-shadow-lg">
              x
            </span>
          </div>
          
          {showTagline && (
            <div className="mt-1 flex items-center gap-2 w-full">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#F97316]/40" />
              <span className={cn(
                "text-[6px] md:text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap",
                isDark ? "text-slate-500" : "text-white/70"
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
