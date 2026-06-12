
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
 * @fileOverview High-Fidelity 3D Corporate Logo for Cracklix.
 * MATCHES: Stylized orange 'C', integrated glowing checkmark, and 3D silver-edged typography.
 */
export function LogoIcon({ className = "", isDark = false }: { className?: string, isDark?: boolean }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="logoGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="orange3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* 3D Stylized Circular 'C' */}
        <path 
          d="M78 28C72 18 61 14 50 14C30 14 14 30 14 50C14 70 30 86 50 86C61 86 72 82 78 72" 
          stroke="url(#orange3dGrad)" 
          strokeWidth="10" 
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />

        {/* Integrated Orange Checkmark with Glowing Effect */}
        <path 
          d="M36 52L48 64L86 28" 
          stroke="url(#orange3dGrad)" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#logoGlow)"
        />
        
        {/* Studio Lighting Highlights */}
        <path 
          d="M38 52L48 62L84 30" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/", iconOnly = false }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href={href} className={cn("flex items-center gap-4 group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon isDark={isDark} className="w-12 h-12 md:w-14 md:h-14" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none">
          <div className="flex items-baseline font-headline">
            <span className={cn(
              "text-3xl md:text-4xl font-[900] tracking-tighter",
              isDark ? "text-[#0F172A]" : "text-white"
            )} style={{ 
               textShadow: isDark ? 'none' : '0px 2px 4px rgba(0,0,0,0.3)',
               background: isDark ? 'none' : 'linear-gradient(to bottom, #FFFFFF 0%, #E2E8F0 100%)',
               WebkitBackgroundClip: isDark ? 'none' : 'text',
               WebkitTextFillColor: isDark ? '#0F172A' : 'transparent'
            }}>
              Crackli
            </span>
            <span className="text-3xl md:text-4xl font-[900] tracking-tighter text-[#F97316] drop-shadow-lg">
              x
            </span>
          </div>
          
          {showTagline && (
            <div className="mt-1">
              <span className={cn(
                "text-[7px] md:text-[9px] font-black uppercase tracking-[0.25em] whitespace-nowrap",
                isDark ? "text-slate-400" : "text-white"
              )}>
                PUNJAB&apos;S NO.1 STUDY HUB
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
