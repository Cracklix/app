'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Master Logo Hub v4.0.
 * UPDATED: Removed text and significantly increased image size for a dominant brand presence.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex flex-col items-center justify-center", className)}>
      {/* Increased height for high visibility as requested */}
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Logo" 
        className="h-16 md:h-24 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-1.5 w-full mt-2">
         <div className="h-px bg-primary/40 flex-1" />
         <span className="text-[6px] md:text-[8px] font-black text-white/70 uppercase tracking-[0.2em] whitespace-nowrap">
            Punjab's No.1 Study Hub
         </span>
         <div className="h-px bg-primary/40 flex-1" />
      </div>
    </div>
  );
}

export default function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon />
    </Link>
  );
}

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
}
