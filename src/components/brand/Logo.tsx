'use client';

import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
  imgClassName?: string;
}

/**
 * @fileOverview Official Master Logo Hub v16.0.
 * FIXED: Predictable height rendering and max-size constraints to prevent layout shifts.
 * UPDATED: Enforced h-full on Link and container for strict parent-controlled scaling.
 */
export function LogoIcon({ className = "", imgClassName = "" }: { className?: string, imgClassName?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center h-full w-auto overflow-hidden", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix Logo" 
        className={cn("h-full w-auto object-contain max-h-full block select-none", imgClassName)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Logo({ className = "", href = "/", imgClassName = "" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0 h-full", className)}>
      <LogoIcon imgClassName={imgClassName} />
    </Link>
  );
}
