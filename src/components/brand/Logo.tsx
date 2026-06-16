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
 * @fileOverview Official Cracklix Brand Hub v4.0.
 * FIXED: Updated paths to include '/logo/' prefix for correct asset resolution.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  // light variant = Dark text for light backgrounds (Header)
  // dark variant = White text for dark backgrounds (Footer/Sidebar)
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-light.png' : '/logo/cracklix-logo-dark.png';

  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <Image 
        src={logoSrc} 
        alt="Cracklix" 
        width={180}
        height={55}
        priority
        className={cn(
          "w-auto object-contain transition-transform group-hover:scale-105",
          "h-[32px] md:h-[42px]", 
          imgClassName
        )}
      />
    </Link>
  );
}
