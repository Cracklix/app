'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Cracklix Master Logo Hub.
 * MATCHED TO SCREENSHOT: Includes specific tagline "PUNJAB'S NO.1 STUDY HUB".
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center gap-3", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix" 
        className="h-10 md:h-14 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
      <div className="flex flex-col items-start justify-center -space-y-1">
         <span className="text-white font-black text-xl md:text-3xl tracking-tighter uppercase leading-none">Cracklix</span>
         <div className="flex items-center gap-1.5 w-full">
            <div className="h-px bg-primary flex-1" />
            <span className="text-[6px] md:text-[7px] font-black text-white/60 uppercase tracking-[0.2em] whitespace-nowrap">
               Punjab's No.1 Study Hub
            </span>
            <div className="h-px bg-primary flex-1" />
         </div>
      </div>
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', href = "/" }: LogoProps) {
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
