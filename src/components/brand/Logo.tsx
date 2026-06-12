'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
}

/**
 * @fileOverview Official Cracklix Master Logo Hub.
 * UPDATED: Set logo size to 1024x1024px as requested.
 * Scaling: Uses object-contain to ensure the high-resolution asset fits perfectly in headers.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
        width={1024}
        height={1024}
      />
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      {/* 
         Size requested: 1024x1024px. 
         Max-height is capped by parent containers (Navbar/Sidebar) to maintain usability.
      */}
      <LogoIcon className="w-[1024px] h-[1024px] max-w-[150px] md:max-w-[200px] max-h-12 md:max-h-14" />
    </Link>
  );
}
