import React from "react"
import { Shield, GraduationCap, Scale, Zap, Stethoscope, Landmark, BookOpen, Activity, Cpu, Building2, Globe, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Branding Engine v5.0.
 * RULES:
 * 1. Try Board Logo first.
 * 2. Fallback to Category Icon.
 * 3. Never use generic shield/lightning placeholders.
 */

interface AuthorityLogoProps {
  board?: any;
  category?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AuthorityLogo = ({ board, category, className, size = 'md' }: AuthorityLogoProps) => {
  const logoUrl = board?.iconUrl || board?.logoUrl || category?.iconUrl || category?.logoUrl;
  
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20"
  };

  const containerSize = sizeClasses[size];

  // If we have an official URL, show it
  if (logoUrl) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden flex items-center justify-center", containerSize, className)}>
        <img 
          src={logoUrl} 
          alt={board?.name || category?.title || "Authority"} 
          className="h-full w-full object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If image fails, hide it and show fallback icon
            (e.target as any).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback to Category/Authority specific high-fidelity icons
  const iconId = (category?.id || board?.categoryId || "").toLowerCase();
  
  const getFallbackIcon = () => {
    if (iconId.includes('govt')) return <Landmark className="h-full w-full text-amber-600" />;
    if (iconId.includes('teaching') || iconId.includes('pstet')) return <BookOpen className="h-full w-full text-blue-600" />;
    if (iconId.includes('technical') || iconId.includes('power')) return <Settings className="h-full w-full text-slate-600" />;
    if (iconId.includes('bank')) return <Building2 className="h-full w-full text-emerald-700" />;
    if (iconId.includes('health') || iconId.includes('medical')) return <Stethoscope className="h-full w-full text-rose-600" />;
    if (iconId.includes('judiciary') || iconId.includes('court')) return <Scale className="h-full w-full text-slate-700" />;
    if (iconId.includes('central')) return <Globe className="h-full w-full text-blue-800" />;
    return <Shield className="h-full w-full text-slate-300" />;
  };

  return (
    <div className={cn("flex items-center justify-center p-1", containerSize, className)}>
      {getFallbackIcon()}
    </div>
  );
};
