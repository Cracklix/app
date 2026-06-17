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
 * SCALE: Maximized height to 76px for ultra-bold institutional presence.
 * CONTAINER: Fits within h-20 (80px) headers with minimal vertical margin.
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
      width={330}
      height={76}
      priority
      className={cn(
        "h-[76px] w-auto object-contain shrink-0",
        imgClassName
      )}
      style={{ width: "auto", height: "76px" }}
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
