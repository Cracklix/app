'use client';

import { 
  FileText, 
  FileStack, 
  Newspaper, 
  CalendarDays, 
  Bell, 
  Settings, 
  Phone, 
  Shield, 
  ChevronRight, 
  Gem,
  Trophy,
  Zap,
  GraduationCap,
  BarChart3,
  X,
  Home,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StudentAvatar from "@/components/brand/StudentAvatar";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Final Institutional Mobile Sidebar v2.0.
 * Redesigned Profile Node for zero-clipping of Gold Pass status.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, profile } = useUser();

  const mainPrepItems = [
    { label: "Home Hub", href: "/", icon: Home, color: "text-primary" },
    { label: "My Mocks", href: "/mocks", icon: Zap, color: "text-orange-500" },
    { label: "Exam Hubs", href: "/exams", icon: GraduationCap, color: "text-blue-500" },
    { label: "Study Notes", href: "/notes", icon: FileText, color: "text-emerald-500" },
    { label: "Results Registry", href: "/dashboard", icon: BarChart3, color: "text-amber-500" },
    { label: "Hall of Rankers", href: "/leaderboard", icon: Trophy, color: "text-indigo-500" },
    { label: "PYQ Archives", href: "/pyqs", icon: FileStack, color: "text-slate-400" },
  ];

  const secondaryItems = [
    { label: "Daily Analysis", href: "/current-affairs", icon: Newspaper, color: "text-slate-500" },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays, color: "text-slate-500" },
    { label: "Notifications", href: "/notifications", icon: Bell, color: "text-slate-500" },
    { label: "Profile Settings", href: "/profile", icon: Settings, color: "text-slate-500" },
    { label: "Institutional Contact", href: "/contact", icon: Phone, color: "text-slate-500" },
    { label: "Privacy Protocol", href: "/privacy", icon: Shield, color: "text-slate-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      {/* Redesigned Profile Section - Vertical Stack for Visibility */}
      <div className="px-6 pt-12 pb-8 bg-[#0B1528] border-b border-white/5 relative shrink-0">
        <div className="flex items-start justify-between mb-6">
           <div className="relative group">
              <StudentAvatar profile={profile} className="h-20 w-20 border-2 border-[#F97316] rounded-[2rem] shadow-4xl shrink-0" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-lg border-2 border-[#0B1528] flex items-center justify-center">
                 <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
              </div>
           </div>
           <button 
             onClick={onClose}
             className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
           >
             <X className="h-5 w-5 text-slate-400" />
           </button>
        </div>

        <div className="space-y-4 text-left">
           <div className="space-y-1">
              <h2 className="font-headline font-black text-2xl uppercase tracking-tight leading-tight truncate">
                 {profile?.name || "Aspirant Node"}
              </h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate opacity-60">
                 {profile?.email || user?.email || "Registry: PENDING"}
              </p>
           </div>

           <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/5 border-white/10 text-slate-400 text-[8px] font-black uppercase px-3 py-1 rounded-lg">
                 {profile?.role || "STUDENT"}
              </Badge>
              <Badge className="bg-[#F97316] text-white border-none text-[8px] font-black uppercase px-3 py-1 rounded-lg shadow-xl shadow-orange-900/40">
                 {profile?.status?.replace('_', ' ') || "FREE"} PASS
              </Badge>
           </div>
        </div>
      </div>

      {/* Navigation Nodes */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {mainPrepItems.map((item) => (
            <SidebarLink key={item.href} item={item} onClick={onClose} />
          ))}
          
          <div className="px-3 py-4">
            <Button asChild className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl h-14 font-black uppercase text-[11px] tracking-widest gap-2 shadow-4xl shadow-orange-900/30">
              <Link href="/pass" onClick={onClose}>
                <Gem className="h-4 w-4" /> Upgrade My Pass
              </Link>
            </Button>
          </div>

          <div className="h-px w-full bg-white/5 mx-2 my-2" />

          {secondaryItems.map((item) => (
            <SidebarLink key={item.href} item={item} onClick={onClose} />
          ))}
        </div>
      </ScrollArea>

      {/* Institutional Footer */}
      <div className="p-6 border-t border-white/5 bg-[#0B1528]/50 shrink-0">
         <div className="flex items-center gap-3 opacity-30">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
               <Shield className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
               <p className="text-[8px] font-black uppercase tracking-[0.3em]">Cracklix v1.2</p>
               <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-slate-500">Punjab Registry Secure</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function SidebarLink({ item, onClick }: { item: any, onClick: () => void }) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 h-[64px]"
    >
      <div className="flex items-center gap-4">
        <div className={`h-11 w-11 rounded-[1rem] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 shadow-inner shrink-0`}>
          <item.icon className={`h-5 w-5 ${item.color}`} />
        </div>
        <span className="font-bold text-[15px] text-slate-300 group-hover:text-white transition-colors truncate">{item.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-primary transition-all shrink-0" />
    </Link>
  );
}
