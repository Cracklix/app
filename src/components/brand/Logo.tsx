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
 * @fileOverview Official Cracklix Brand Hub.
 * UPDATED: Replaced DSSS text-identity with official Cracklix logo image.
 */
export default function Logo({ className = "", href = "/", variant = 'dark', imgClassName = "" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <img 
        src="/logo/cracklix-logo.png" 
        alt="Cracklix Logo" 
        className={cn("h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105", imgClassName)}
        referrerPolicy="no-referrer"
      />
    </Link>
  );
}