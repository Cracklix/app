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
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Testbook Inspired Open Book + Success Arrow Icon */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-[42px] h-[42px] flex items-center justify-center bg-[#FF8800]/10 border-2 border-[#FF8800] rounded-[10px] shrink-0 overflow-hidden p-1.5"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          <path d="M12 7v14" strokeWidth="2"></path>
          <path d="M17 6l3-3 3 3" strokeWidth="2"></path>
        </svg>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`text-[1.8rem] font-extrabold leading-none tracking-tight ${isLight ? 'text-white' : 'text-[#0B1528]'}`}>
            Crack
          </span>
          <span className="text-[#FF8800] text-[1.8rem] font-extrabold leading-none tracking-tight">
            lix
          </span>
        </div>
      </div>
    </Link>
  );
}
