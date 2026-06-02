'use client';

import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'light' }: LogoProps) {
  const isLight = variant === 'light';
  
  return (
    <Link href="/" className={`flex items-center gap-3.5 group ${className}`}>
      {/* Vibrant Orange Icon with Checkmark */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-11 h-11 flex items-center justify-center bg-[#ff8800] rounded-[12px] shadow-lg shadow-orange-500/30 shrink-0 overflow-hidden"
      >
        {/* Subtle Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
        
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 relative z-10">
          <path 
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
            fill="white" 
            stroke="white" 
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      <div className="flex flex-col">
        {/* Main Title Section */}
        <div className="flex items-baseline">
          <span className={`text-2xl font-black leading-none tracking-tight ${isLight ? 'text-white' : 'text-[#0b1528]'}`}>
            Crack
          </span>
          <span className="text-[#ff8800] text-2xl font-black ml-0.5 leading-none tracking-tight">
            lix
          </span>
        </div>
        
        {/* Subtitle Section */}
        <div className={`text-[9px] font-black tracking-[2px] uppercase mt-1.5 whitespace-nowrap ${isLight ? 'text-white/40' : 'text-[#7a8b9e]'}`}>
          MOCK TEST DA NETFLIX
        </div>
      </div>
    </Link>
  );
}
