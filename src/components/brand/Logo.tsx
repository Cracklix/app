
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
 * UPDATED: Integrated high-fidelity 1024px master source.
 * Dimension: Optimized for 250x80px aspect ratio for professional site identity.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/0yBPqGP6/1000110138-removebg-preview.png" 
        alt="Cracklix" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      {/* 
         Professional Scaling: 
         Mobile: w-32 (128px wide)
         Desktop: w-48 (192px wide)
      */}
      <LogoIcon className="w-32 h-10 md:w-48 md:h-14" />
    </Link>
  );
}
