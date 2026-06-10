
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
 * Standardized as the universal "Home" anchor for the entire platform.
 * PERFORMANCE: Pure SVG rendering for ultra-fast LCP.
 */
export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/" }: LogoProps) {
  const isLightVariant = variant === 'light'; 
  
  return (
    <Link href={href} className={`flex items-center gap-1.5 md:gap-3 group pointer-events-auto select-none ${className}`}>
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform group-hover:scale-105 duration-300">
          <circle cx="20" cy="20" r="18" stroke={isLightVariant ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.05)"} strokeWidth="4" />
          <path 
            d="M32 10C29.5 7.5 25.5 6 21 6C12.7157 6 6 12.7157 6 21C6 29.2843 12.7157 36 21 36C25.5 36 29.5 34.5 32 32" 
            stroke={isLightVariant ? "#FFFFFF" : "#0F172A"} 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 21L20 25L30 15" 
            stroke="#F97316" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
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
