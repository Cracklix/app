'use client';

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'light' }: LogoProps) {
  const isLight = variant === 'light';
  
  return (
    <Link href="/" className={`flex items-center gap-3.5 group ${className}`}>
      {/* Premium Stylish Badge */}
      <div className="relative shrink-0 hidden sm:block">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="w-11 h-11 lg:w-13 lg:h-13 rounded-[14px] bg-gradient-to-br from-[#ff7a00] to-[#ff9d42] flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(255,122,0,0.4)] transition-all duration-300 border border-white/20"
        >
          <div className="relative flex items-center justify-center">
            <span className="text-white text-2xl lg:text-3xl font-black italic tracking-tighter select-none">
              C
            </span>
            <div className="absolute -top-1 -right-2.5 bg-white rounded-full p-0.5 shadow-lg border-2 border-orange-500">
               <Check className="text-[#ff7a00] h-3.5 w-3.5 stroke-[4px]" />
            </div>
          </div>
        </motion.div>
        
        {/* Subtle Glow beneath the icon */}
        <div className="absolute inset-0 bg-orange-500/20 blur-xl -z-10 rounded-full group-hover:bg-orange-500/30 transition-colors" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl lg:text-3xl font-black leading-none tracking-tight flex items-baseline">
          <span className={`${isLight ? 'text-white' : 'text-[#0c1527]'} font-extrabold`}>
            Crack
          </span>
          <span className="text-[#ff7a00] font-black italic ml-0.5">
            lix
          </span>
        </h1>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`h-[1px] w-4 ${isLight ? 'bg-white/20' : 'bg-gray-200'}`} />
          <p className={`text-[9px] lg:text-[10px] uppercase tracking-[0.25em] font-black ${isLight ? 'text-white/60' : 'text-gray-400'}`}>
            Punjab Exam Authority
          </p>
        </div>
      </div>
    </Link>
  );
}
