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
  onClick?: () => void;
}

/**
 * Cracklix Official Logo Component
 * UPDATED: Maximized to 140px standard for ultra-prominent branding.
 */
export default function Logo({
  className = "",
  href = "/",
  variant = "light",
  imgClassName = "",
  onClick,
}: LogoProps) {
  const logoSrc =
    variant === "light"
      ? "/logo/cracklix-logo-dark.png"
      : "/logo/cracklix-logo-light.png";

  const content = (
    <Image
      src={logoSrc}
      alt="Cracklix"
      width={460}
      height={140}
      priority
      className={cn(
        "h-[140px] w-auto object-contain shrink-0",
        imgClassName
      )}
    />
  );

  if (onClick || href) {
    return (
      <Link
        href={href || "#"}
        onClick={onClick}
        className={cn(
          "flex items-center shrink-0 select-none",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center shrink-0 select-none",
        className
      )}
    >
      {content}
    </div>
  );
}
