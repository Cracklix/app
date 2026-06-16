'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
  imgClassName?: string;
}

/**
 * @fileOverview Official Cracklix Brand Hub v19.0.
 * HARDENED: Locked responsive scaling to prevent shrinking.
 * DIMENSIONS: Mobile 48px (h-12) / Desktop 64px (h-16).
 * MIN-WIDTH: 160px to protect brand identity on small viewports.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  // Use dark logo for light background, and light logo for dark background
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-dark.png' : '/logo/cracklix-logo-light.png';

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center group pointer-events-auto select-none shrink-0 min-w-[160px]", 
        className
      )}
    >
      <Image 
        src={logoSrc} 
        alt="Cracklix" 
        width={180}
        height={50}
        priority
        className={cn(
          "h-12 w-auto lg:h-16 object-contain transition-transform group-hover:scale-105 shrink-0",
          imgClassName
        )}
      />
    </Link>
  );
}
