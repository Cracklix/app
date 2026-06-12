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
 * UPDATED: Significantly increased max dimensions and added negative margin to shift left.
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
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0 -ml-6 md:-ml-10", className)}>
      {/* 
         STRICT REQUIREMENT: 1024x1024px display scale.
         Max dimensions significantly increased for prominent branding.
         Negative left margin pulls the logo "1 inch" left.
      */}
      <LogoIcon className="w-[1024px] h-[1024px] max-w-[350px] md:max-w-[500px] max-h-20 md:max-h-32" />
    </Link>
  );
}
