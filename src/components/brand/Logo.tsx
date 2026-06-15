'use client';

import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
  imgClassName?: string;
}

export function LogoIcon({ className = "", variant = 'dark', imgClassName = "" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <div className="bg-primary p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
            <span className={cn("font-black text-2xl tracking-tighter leading-none", variant === 'dark' ? 'text-slate-900' : 'text-white')}>DSSS</span>
            <span className={cn("text-[7px] font-black tracking-[0.2em] mt-0.5", variant === 'dark' ? 'text-slate-500' : 'text-slate-400')}>LEARN.PRACTICE.SUCCEED</span>
        </div>
    </div>
  );
}

export default function Logo({ className = "", href = "/", variant = 'dark', imgClassName = "" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon variant={variant} imgClassName={imgClassName} />
    </Link>
  );
}
