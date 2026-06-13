'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Master Logo Hub v6.0.
 * MATCHED: Re-integrated the full brand asset which includes text and tagline for a pixel-perfect screenshot match.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix Logo" 
        className="h-10 md:h-12 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
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
