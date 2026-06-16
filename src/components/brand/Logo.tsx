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
 * @fileOverview Official Cracklix Brand Hub v14.0.
 * SIZING: Locked to 28px height with 110px min-width to prevent scaling issues.
 * REGISTRY: Prevents auto-centering in the mobile header.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-dark.png' : '/logo/cracklix-logo-light.png';

  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <div className="relative h-7 md:h-8 w-auto min-w-[110px] md:min-w-[130px]">
        <Image 
          src={logoSrc} 
          alt="Cracklix" 
          width={160}
          height={44}
          priority
          className={cn(
            "object-contain transition-transform group-hover:scale-105 h-full w-auto",
            imgClassName
          )}
          style={{ width: 'auto', height: '100%' }}
        />
      </div>
    </Link>
  );
}
