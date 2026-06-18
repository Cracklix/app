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
 * SCALE: Maximized for brand dominance. Standard height increased to 88px.
 * UNIFIED: Flexible height based on context, default is maximized for the 80px header.
 * SAFETY: Uses max-w-full to prevent horizontal layout breaks.
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
      width={450}
      height={90}
      priority
      className={cn(
        "h-[88px] w-auto max-w-full object-contain shrink-0 transition-all duration-300",
        imgClassName
      )}
      style={{ width: "auto" }}
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
