
'use client';

import { 
  FileText, 
  FileStack, 
  Newspaper, 
  CalendarDays, 
  Bell, 
  Settings, 
  Phone, 
  ChevronRight, 
  Gem,
  Trophy,
  Zap,
  GraduationCap,
  BarChart3,
  Home,
  LogOut,
  ChevronDown,
  Info,
  LayoutGrid,
  Share2,
  Target,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StudentAvatar from "@/components/brand/StudentAvatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import ShareButton from "@/components/navigation/ShareButton";

/**
 * @fileOverview Responsive Mobile Navigation Hub v7.0.
 * Updated: Real status tracking and "View Profile" link addition.
 * Standardized: "Developed by Arsh Grewal" footer branding.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    router.push('/login');
  };

  const primaryMenu = [
    { label: "Home", href: "/", icon: Home },
    { label: "My Exams", href: "/my-exams", icon: Target },
    { label: "Practice Series", href: "/mocks", icon: Zap },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays },
    { label: "Study Notes", href: "/notes", icon: FileText },
    { label: "Performance", href: "/dashboard", icon: BarChart3 },
    { label: "PYQ Hub", href: "/pyqs", icon: FileStack },
    { label: "Pass Registry", href: "/pass", icon: Gem },
  ];

  const secondaryMenu = [
    { label: "Profile Settings", href: "/profile", icon: Settings },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Contact Support", href: "/contact", icon: Phone },
  ];

  const moreMenu = [
    { label: "Hall of Rankers", href: "/leaderboard", icon: Trophy },
    { label: "Origin Story", href: "/about", icon: Info },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#0F172A] overflow-hidden font-body w-[220px] lg:w-[300px] max-w-[220px] lg:max-w-[300px]">
      
      {/* 1. UNIFIED SCROLLABLE CONTENT (Profile + Menu) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        
        {/* HIGH-DENSITY PROFILE HUB (Enhanced Scale) */}
        <div className="px-4 lg:px-8 pt-6 lg:pt-10 pb-6 lg:pb-8 bg-[#0B1528] border-b border-white/5 mb-1">
          <div className="flex flex-col gap-4 lg:gap-6">
            <StudentAvatar 
              profile={profile} 
              className="h-12 w-12 lg:h-16 lg:w-16 border-2 border-white/10 rounded-2xl lg:rounded-[1.5rem] shrink-0 shadow-2xl" 
              iconClassName="h-3/4 w-3/4"
            />
            <div className="space-y-2 lg:space-y-3 text-left">
              <div className="flex items-center justify-between gap-3 overflow-hidden">
                <h2 className="font-headline font-black text-[13px] lg:text-[18px] text-white uppercase tracking-tight leading-none truncate flex-1">
                  {profile?.name || "Aspirant"}
                </h2>
                <Badge className="bg-[#F97316] text-white border-none text-[7px] lg:text-[10px] font-black uppercase px-2 py-0.5 rounded-sm shrink-0 shadow-lg">
                  {profile?.status?.toUpperCase() || 'FREE'}
                </Badge>
              </div>
              <Link 
                href="/profile" 
                onClick={onClose}
                className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center gap-1 group/profile"
              >
                View Profile <ChevronRight className="h-3 w-3 transition-transform group-hover/profile:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* NAVIGATION LIST */}
        <div className="space-y-0.5 pt-1 lg:pt-2">
          {primaryMenu.map((item) => (
            <MenuLink 
              key={item.href} 
              item={item} 
              active={pathname === item.href}
              onClick={onClose} 
            />
          ))}

          <div className="my-1 lg:my-3 border-t border-slate-50 mx-4 lg:mx-8" />

          {/* SHARE ACTION NODE */}
          <div className="px-4 lg:px-8 py-1">
             <ShareButton 
               className="w-full justify-start h-10 lg:h-12 bg-slate-50 border-none shadow-none hover:bg-slate-100 text-slate-600 px-0" 
               variant="ghost" 
             />
          </div>

          <CollapsibleGroup 
            label="Account" 
            isOpen={isAccountOpen} 
            onToggle={setIsAccountOpen}
          >
            {secondaryMenu.map((item) => (
              <MenuLink 
                key={item.href} 
                item={item} 
                active={pathname === item.href}
                onClick={onClose}
                indent
              />
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 lg:gap-3 px-4 lg:px-8 h-[40px] lg:h-[50px] text-rose-500 hover:bg-rose-50 transition-colors group text-left"
            >
              <LogOut className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px] shrink-0" />
              <span className="text-[11px] lg:text-[14px] font-bold uppercase tracking-tight">Logout</span>
            </button>
          </CollapsibleGroup>

          <CollapsibleGroup 
            label="More" 
            isOpen={isMoreOpen} 
            onToggle={setIsMoreOpen}
          >
            {moreMenu.map((item) => (
              <MenuLink 
                key={item.href} 
                item={item} 
                active={pathname === item.href}
                onClick={onClose}
                indent
              />
            ))}
          </CollapsibleGroup>
        </div>
      </div>

      {/* 2. COMPACT FIXED FOOTER */}
      <div className="px-4 py-4 border-t border-slate-100 bg-slate-50 shrink-0 mb-[env(safe-area-inset-bottom,0px)] flex flex-col items-center gap-2">
         <div className="flex items-center gap-2 opacity-40">
            <UserIcon className="h-2.5 w-2.5" />
            <p className="text-[7px] lg:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
               Developed by Arsh Grewal
            </p>
         </div>
         <p className="text-[6px] lg:text-[8px] font-bold text-slate-300 uppercase tracking-widest">
            Cracklix v7.0 • Authority Node
         </p>
      </div>
    </div>
  );
}

function MenuLink({ item, active, onClick, indent = false }: any) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 lg:px-8 h-[44px] lg:h-[54px] transition-all group w-full",
        active ? "bg-primary/5 text-primary border-r-[4px] border-primary" : "hover:bg-slate-50 text-slate-600",
        indent && "pl-8 lg:pl-12"
      )}
    >
      <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
        <item.icon className={cn("h-[18px] w-[18px] lg:h-[22px] lg:w-[22px] shrink-0", active ? "text-primary" : "text-slate-400")} />
        <span className={cn(
          "text-[11px] lg:text-[14px] font-[900] uppercase tracking-tight transition-colors truncate",
          active ? "text-primary" : "group-hover:text-[#0F172A]"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-3 w-3 lg:h-4 lg:w-4 transition-all opacity-0 group-hover:opacity-100 shrink-0",
        active ? "opacity-100 text-primary" : "text-slate-200"
      )} />
    </Link>
  );
}

function CollapsibleGroup({ label, children, isOpen, onToggle }: any) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-4 lg:px-8 h-10 lg:h-14 hover:bg-slate-50 transition-all text-slate-400 group">
          <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.15em]">{label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 mt-0.5 overflow-hidden transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
