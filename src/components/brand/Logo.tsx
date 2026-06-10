
'use client';

import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  href?: string;
}

/**
 * @fileOverview Refactored Brand Identity Node.
 * UPDATED: Logo SVG matched to provided image (Thick C + Orange Check + Dark Circle).
 * PERFORMANCE: Pure SVG rendering for ultra-fast LCP.
 */
export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/" }: LogoProps) {
  const isLightVariant = variant === 'light'; 
  
  return (
    <Link href={href} className={`flex items-center gap-1.5 md:gap-3 group pointer-events-auto select-none ${className}`}>
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform group-hover:scale-105 duration-300">
          {/* Foundation Circle - Solid Fill matched to provided image */}
          <circle cx="50" cy="50" r="48" fill={isLightVariant ? "rgba(255,255,255,0.08)" : "#0F172A"} />
          
          {/* Thick White 'C' */}
          <path 
            d="M75 35C70 26 61 20 50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C61 80 70 74 75 65" 
            stroke="white" 
            strokeWidth="12" 
            strokeLinecap="round" 
            fill="none"
          />
          
          {/* Bold Orange Checkmark */}
          <path 
            d="M40 52L50 62L78 32" 
            stroke="#F97316" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
        </svg>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline leading-none">
          <span className={`text-lg sm:text-xl md:text-2xl font-black tracking-tighter ${isLightVariant ? 'text-white' : 'text-[#0F172A]'}`}>Crack</span>
          <span className="text-[#F97316] text-lg sm:text-xl md:text-2xl font-black tracking-tighter">lix</span>
        </div>
        {showTagline && (
          <div className={`flex flex-col leading-[1.1] mt-0.5 ${isLightVariant ? 'text-white/60' : 'text-slate-400'}`}>
            <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest truncate">PUNJAB'S NO. 1 MOCK HUB</span>
          </div>
        )}
      </div>
    </Link>
  );
}
