
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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          {/* Glow Filter for Orange Elements */}
          <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* 3D Drop Shadow for Depth */}
          <filter id="depthShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5" />
          </filter>

          {/* Orange Gradient for 3D Effect */}
          <linearGradient id="orange3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Silver/White Gradient for Inner C */}
          <linearGradient id="silver3d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* 1. Outer Orange Glowing Arc (The 'C' Wrap) */}
        <path 
          d="M75 30C68 20 58 15 48 15C28 15 12 31 12 50C12 69 28 85 48 85C58 85 68 80 75 70" 
          stroke="url(#orange3d)" 
          strokeWidth="8" 
          strokeLinecap="round"
          filter="url(#orangeGlow)"
        />

        {/* 2. Inner Bold White 'C' */}
        <path 
          d="M48 24C34 24 22 36 22 50C22 64 34 76 48 76C55 76 60 73 65 68" 
          stroke="url(#silver3d)" 
          strokeWidth="10" 
          strokeLinecap="round"
          filter="url(#depthShadow)"
        />

        {/* 3. Integrated Glowing Checkmark */}
        <path 
          d="M32 52L45 65L88 22" 
          stroke="url(#orange3d)" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#orangeGlow)"
        />
        
        {/* 4. Lighting Highlight on Checkmark */}
        <path 
          d="M34 52L45 63L85 24" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/", iconOnly = false }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href={href} className={cn("flex items-center gap-4 group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon isDark={isDark} className="w-12 h-12 md:w-16 md:h-16" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none">
          <div className="flex items-baseline font-headline">
            {/* "Crackli" in White with Silver edges (Shadow simulation) */}
            <span className={cn(
              "text-3xl md:text-5xl font-[900] tracking-tighter drop-shadow-md",
              isDark ? "text-[#0F172A]" : "text-white"
            )} style={{ 
               textShadow: '0px 2px 0px rgba(226, 232, 240, 0.5)'
            }}>
              Crackli
            </span>
            {/* "x" in Bright Orange */}
            <span className="text-3xl md:text-5xl font-[900] tracking-tighter text-[#F97316] drop-shadow-lg">
              x
            </span>
          </div>
          
          {showTagline && (
            <div className="mt-1.5 flex items-center gap-2 w-full">
              {/* Decorative Horizontal Line Left */}
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#F97316]/60" />
              
              <span className={cn(
                "text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap",
                isDark ? "text-slate-500" : "text-white"
              )}>
                PUNJAB&apos;S NO.1 STUDY HUB
              </span>
              
              {/* Decorative Horizontal Line Right */}
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#F97316]/60" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
