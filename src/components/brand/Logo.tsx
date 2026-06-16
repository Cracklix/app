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
 * @fileOverview Official Cracklix Brand Hub v21.0.
 * HARDENED: Maximized responsive scaling for high-impact visibility.
 * DIMENSIONS: Mobile 64px (h-16) / Desktop 80px (lg:h-20).
 * MIN-WIDTH: 200px to protect brand identity.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  // Use dark logo for light background, and light logo for dark background
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-dark.png' : '/logo/cracklix-logo-light.png';

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center group pointer-events-auto select-none shrink-0 min-w-[200px]", 
        className
      )}
    >
      <Image 
        src={logoSrc} 
        alt="Cracklix" 
        width={240}
        height={80}
        priority
        className={cn(
          "h-16 w-auto lg:h-20 object-contain transition-transform group-hover:scale-105 shrink-0",
          imgClassName
        )}
      />
    </Link>
  );
}
