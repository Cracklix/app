'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'icon';
  href?: string;
  imgClassName?: string;
  onClick?: () => void;
  priority?: boolean;
  align?: 'left' | 'center' | 'right';
  iconOnly?: boolean;
}

/**
 * @fileOverview Cracklix High-Fidelity Brand Identity v70.3.
 * FIXED: Explicitly defined container dimensions to resolve Next.js Image height 0 warning.
 */
export default function Logo({
  className = "",
  href = "/",
  variant = "light",
  imgClassName = "",
  onClick,
  priority = true,
  align = 'left',
  iconOnly = false
}: LogoProps) {
  
  const assets = {
    light: "/logo/cracklix-logo-dark.png",
    dark: "/logo/cracklix-logo-light.png",
    icon: "/logo/cracklix-icon.png"
  };

  const isIcon = variant === 'icon' || iconOnly;
  const src = assets[isIcon ? 'icon' : variant];

  // The wrapper MUST have a relative position for Next.js Image "fill" to work.
  // The dimensions are provided by the baseClasses below.
  const content = (
    <div className="relative w-full h-full flex items-center justify-center">
      <Image
        src={src}
        alt="Cracklix"
        fill
        priority={priority}
        sizes={isIcon ? "64px" : "260px"}
        className={cn(
          "transition-all flex-shrink-0 object-contain",
          imgClassName
        )}
      />
    </div>
  );

  const baseClasses = cn(
    "flex items-center select-none hover:opacity-90 transition-opacity flex-shrink-0 relative overflow-hidden",
    // These specific height/width anchors provide the necessary context for the fill prop
    isIcon 
      ? "h-10 w-10 md:h-14 md:w-14" 
      : "h-12 w-32 md:h-16 md:w-56",
    align === 'center' && "mx-auto justify-center",
    align === 'right' && "justify-end",
    className
  );

  if (href || onClick) {
    return (
      <Link
        href={href || "/"}
        onClick={(e) => {
           if (onClick) {
              e.preventDefault();
              onClick();
           }
        }}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
}
