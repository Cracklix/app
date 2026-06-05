
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
  Info
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

/**
 * @fileOverview Compact Information Architecture Refactor.
 * Follows Adda247/Testbook minimalist navigation patterns.
 * Optimized for first-screen visibility and zero-bloat UX.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, profile } = useUser();
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
    { label: "Exams", href: "/exams", icon: GraduationCap },
    { label: "My Mocks", href: "/mocks", icon: Zap },
    { label: "Notes", href: "/notes", icon: FileText },
    { label: "Results", href: "/dashboard", icon: BarChart3 },
    { label: "PYQ", href: "/pyqs", icon: FileStack },
    { label: "Pass", href: "/pass", icon: Gem },
    { label: "Analysis", href: "/current-affairs", icon: Newspaper },
  ];

  const secondaryMenu = [
    { label: "Profile Settings", href: "/profile", icon: Settings },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Contact Support", href: "/contact", icon: Phone },
  ];

  const moreMenu = [
    { label: "Hall of Rankers", href: "/leaderboard", icon: Trophy },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays },
    { label: "Daily Analysis", href: "/current-affairs", icon: Newspaper },
    { label: "Institutional Nodes", href: "/about", icon: Info },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#0F172A] overflow-hidden font-body">
      {/* 1. COMPACT PROFILE SECTION (-40% Height) */}
      <div className="px-5 pb-6 pt-[calc(env(safe-area-inset-top,24px)+16px)] bg-[#0B1528] shrink-0">
        <div className="flex items-center gap-4">
          <StudentAvatar 
            profile={profile} 
            className="h-12 w-12 border-2 border-white/10 rounded-xl shrink-0" 
          />
          <div className="flex-1 text-left min-w-0">
            <h2 className="font-headline font-black text-base text-white uppercase tracking-tight leading-tight truncate">
              {profile?.name || "Aspirant"}
            </h2>
            <div className="mt-1">
              <Badge className="bg-[#F97316] text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">
                {profile?.status?.replace('_', ' ') || "FREE"} PASS
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION HUB (Flat List Design) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4 space-y-1">
        {/* PRIMARY SECTION */}
        <div className="space-y-0.5">
          {primaryMenu.map((item) => (
            <MenuLink 
              key={item.href} 
              item={item} 
              active={pathname === item.href}
              onClick={onClose} 
            />
          ))}
        </div>

        <div className="my-3 border-t border-slate-50" />

        {/* COLLAPSIBLE GROUPS */}
        <CollapsibleGroup 
          label="Account & Support" 
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
            className="w-full flex items-center gap-3 px-8 h-11 text-rose-500 hover:bg-rose-50 transition-colors rounded-lg group"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="text-sm font-bold uppercase tracking-tight">Logout</span>
          </button>
        </CollapsibleGroup>

        <CollapsibleGroup 
          label="More Sections" 
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

      {/* 3. VERSION FOOTER */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 shrink-0">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">
          Cracklix Registry v5.2.0
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
        "flex items-center justify-between px-3 h-11 rounded-lg transition-all group",
        active ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-600",
        indent && "pl-8"
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : "text-slate-400")} />
        <span className={cn(
          "text-sm font-bold uppercase tracking-tight transition-colors",
          active ? "text-primary" : "group-hover:text-[#0F172A]"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-3.5 w-3.5 transition-all opacity-0 group-hover:opacity-100",
        active ? "opacity-100 text-primary" : "text-slate-200"
      )} />
    </Link>
  );
}

function CollapsibleGroup({ label, children, isOpen, onToggle }: any) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-3 h-11 rounded-lg hover:bg-slate-50 transition-all text-slate-400 group">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 mt-1 overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
