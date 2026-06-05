'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentAvatarProps {
  profile: UserProfile | null | any;
  className?: string;
  iconClassName?: string;
}

/**
 * @fileOverview Gender-Specific Avatar Hub.
 * Renders simple Man silhouette for male students and Simple Woman silhouette for female students.
 * Optimized: Removed initials fallback to use a professional icon by default.
 */
export default function StudentAvatar({ profile, className, iconClassName }: StudentAvatarProps) {
  if (!profile) return (
    <Avatar className={cn("bg-slate-100", className)}>
      <AvatarFallback className="bg-slate-100 text-slate-300">
        <User className={cn("h-1/2 w-1/2", iconClassName)} />
      </AvatarFallback>
    </Avatar>
  );

  const gender = profile.gender;

  return (
    <Avatar className={cn("border border-white/10 shadow-inner overflow-hidden", className)}>
      {/* If the student has a custom photo, use it first */}
      {profile.photoURL && <AvatarImage src={profile.photoURL} />}

      <AvatarFallback className={cn(
        "flex items-center justify-center h-full w-full",
        gender === 'Male' ? "bg-blue-100 text-blue-500" : 
        gender === 'Female' ? "bg-rose-100 text-rose-500" : 
        "bg-slate-100 text-slate-400"
      )}>
        {gender === 'Female' ? (
           <UserRound className={cn("h-3/5 w-3/4", iconClassName)} />
        ) : (
           <User className={cn("h-3/5 w-3/4", iconClassName)} />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
