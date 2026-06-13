'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Master Logo Hub v10.0.
 * RESTORED: Matched tagline and text styling exactly from screenshot.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex flex-col items-center gap-0", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix Logo" 
        className="h-10 md:h-12 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-2 mt-[-4px]">
         <div className="h-[1px] w-3 bg-primary/30" />
         <span className="text-[7px] md:text-[8px] font-black uppercase text-primary tracking-[0.2em] whitespace-nowrap">
            PUNJAB'S NO.1 STUDY HUB
         </span>
         <div className="h-[1px] w-3 bg-primary/30" />
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
