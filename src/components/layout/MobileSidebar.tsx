
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
  User as UserIcon,
  X
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
 * @fileOverview Student Mobile Sidebar.
 * Features: Easy language and Bold Typography.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    router.push('/login');
  };

  const primaryMenu = [
    { label: "HOME", href: "/", icon: Home },
    { label: "MY EXAMS", href: "/my-exams", icon: Target },
    { label: "PRACTICE SERIES", href: "/mocks", icon: Zap },
    { label: "EXAM CALENDAR", href: "/exam-calendar", icon: CalendarDays },
    { label: "STUDY NOTES", href: "/notes", icon: FileText },
    { label: "PERFORMANCE", href: "/dashboard", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#0F172A] overflow-hidden font-body w-full">
      
      {/* 1. PROFILE HEADER */}
      <div className="px-6 pt-10 pb-8 bg-[#0B1528] relative overflow-hidden shrink-0 text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col gap-6 relative z-10">
          <StudentAvatar 
            profile={profile} 
            className="h-16 w-16 border-2 border-white/10 rounded-[1.5rem] shadow-2xl" 
          />
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between gap-3 overflow-hidden">
              <h2 className="font-headline font-black text-xl text-white uppercase tracking-tight truncate flex-1">
                {profile?.name || "Student"}
              </h2>
              <Badge className="bg-primary text-white border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm shrink-0 shadow-lg">
                {profile?.status?.toUpperCase() || 'FREE'} PASS
              </Badge>
            </div>
            <Link 
              href="/profile" 
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center gap-1.5"
            >
              View Profile <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MENU LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        <div className="space-y-0.5">
          {primaryMenu.map((item) => (
            <MenuLink 
              key={item.href} 
              item={item} 
              active={pathname === item.href}
              onClick={onClose} 
            />
          ))}

          <div className="my-6 border-t border-slate-50 mx-8" />

          {/* Account Sub-menu */}
          <CollapsibleGroup 
            label="MY ACCOUNT" 
            isOpen={isAccountOpen} 
            onToggle={setIsAccountOpen}
          >
            <MenuLink item={{ label: "PASS HUB", href: "/pass", icon: Gem }} active={pathname === '/pass'} onClick={onClose} indent />
            <MenuLink item={{ label: "NOTIFICATIONS", href: "/notifications", icon: Bell }} active={pathname === '/notifications'} onClick={onClose} indent />
            <MenuLink item={{ label: "CONTACT US", href: "/contact", icon: Phone }} active={pathname === '/contact'} onClick={onClose} indent />
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-12 h-12 text-rose-500 hover:bg-rose-50 transition-all group"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
            </button>
          </CollapsibleGroup>

          {/* Share */}
          <div className="px-8 mt-4">
             <ShareButton 
               className="w-full h-14 bg-slate-50 border-none shadow-none text-slate-500 hover:bg-primary hover:text-white rounded-2xl" 
               variant="ghost" 
             />
          </div>
        </div>
      </div>

      {/* 3. FOOTER */}
      <div className="px-6 py-6 border-t border-slate-100 bg-slate-50 flex flex-col items-center gap-1 shrink-0">
         <p className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.2em] flex items-center gap-2">
            <UserIcon className="h-3 w-3 text-primary" /> Developed by Arsh Grewal
         </p>
         <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Official Platform 2026
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
        "flex items-center justify-between px-8 h-16 transition-all group w-full",
        active ? "bg-primary/5 text-primary border-r-4 border-primary" : "hover:bg-slate-50 text-slate-500",
        indent && "pl-12"
      )}
    >
      <div className="flex items-center gap-5 min-w-0 flex-1">
        <item.icon className={cn("h-6 w-6 shrink-0", active ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
        <span className={cn(
          "text-[13px] font-[900] uppercase tracking-tighter transition-colors truncate",
          active ? "text-[#0F172A]" : "group-hover:text-[#0F172A]"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-4 w-4 transition-all opacity-0 group-hover:opacity-100",
        active ? "opacity-100 text-primary" : "text-slate-200"
      )} />
    </Link>
  );
}

function CollapsibleGroup({ label, children, isOpen, onToggle }: any) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-8 h-12 hover:bg-slate-50 transition-all text-slate-400 group">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 overflow-hidden transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
