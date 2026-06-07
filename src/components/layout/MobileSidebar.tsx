'use client';

import { 
  FileText, 
  CalendarDays, 
  Bell, 
  Phone, 
  ChevronRight, 
  Gem,
  Zap,
  BarChart3,
  Home,
  LogOut,
  ChevronDown,
  Target,
  User as UserIcon,
  X,
  ShieldCheck
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
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview High-Fidelity Mobile Sidebar v4.0.
 * UPDATED: Strictly follows the dark navy screenshot with large bold name and orange pill pass.
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
    <div className="flex flex-col h-full bg-[#0F172A] text-white overflow-hidden font-body w-full border-r border-white/5">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col min-h-full">
          
          {/* 1. HIGH-FIDELITY PROFILE HEADER (Matches Screenshot) */}
          <div className="px-8 pt-20 pb-16 bg-[#0B1528] relative overflow-hidden text-left border-b border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2.5 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all active:scale-90 z-20"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="flex flex-col gap-10 relative z-10">
              <div className="relative w-fit">
                <StudentAvatar 
                  profile={profile} 
                  className="h-28 w-28 md:h-36 md:w-36 border-[6px] border-white/10 rounded-[3rem] shadow-4xl bg-[#0F172A]" 
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-9 w-9 rounded-xl border-[4px] border-[#0B1528] flex items-center justify-center shadow-2xl">
                   <ShieldCheck className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-6 text-left">
                <div className="space-y-4">
                  <h2 className="font-headline font-black text-4xl md:text-5xl text-white uppercase tracking-tight break-words leading-[0.9]">
                    {profile?.name || "Student Node"}
                  </h2>
                  <Badge className="bg-primary hover:bg-primary text-white border-none text-[11px] font-black uppercase px-6 py-2.5 rounded-full shadow-4xl w-fit tracking-[0.1em]">
                    {(profile?.status || 'Free').toUpperCase()} PASS
                  </Badge>
                </div>
                
                <Link 
                  href="/profile" 
                  onClick={onClose}
                  className="text-[12px] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-all flex items-center gap-3 group pt-2"
                >
                  VIEW PROFILE <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. MENU LIST */}
          <div className="flex-1 py-10">
            <div className="space-y-1">
              {primaryMenu.map((item) => (
                <MenuLink 
                  key={item.href} 
                  item={item} 
                  active={pathname === item.href}
                  onClick={onClose} 
                />
              ))}

              <div className="my-10 border-t border-white/5 mx-10" />

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
                  className="w-full flex items-center gap-6 px-14 h-16 text-rose-500 hover:bg-rose-500/10 transition-all group"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  <span className="text-[15px] font-[900] uppercase tracking-tight">Logout</span>
                </button>
              </CollapsibleGroup>

              <div className="px-10 mt-10 pb-16">
                 <ShareButton 
                   className="w-full h-16 bg-white/5 border border-white/10 shadow-none text-slate-300 hover:bg-primary hover:text-white rounded-[2rem] font-black text-[11px] tracking-widest" 
                   variant="ghost" 
                 />
              </div>
            </div>
          </div>

          {/* 3. SIGNATURE FOOTER */}
          <div className="px-8 py-12 border-t border-white/5 bg-black/20 flex flex-col items-center gap-3 mt-auto shrink-0">
             <div className="flex items-center gap-2 text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">
                <UserIcon className="h-4 w-4 text-primary/50" /> 
                DEVELOPED BY ARSH GREWAL
             </div>
             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.6em]">
                OFFICIAL HUB 2026
             </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function MenuLink({ item, active, onClick, indent = false }: any) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-10 h-16 transition-all group w-full",
        active ? "bg-primary/10 text-primary border-l-[6px] border-primary" : "hover:bg-white/5 text-slate-400",
        indent && "pl-14"
      )}
    >
      <div className="flex items-center gap-6 min-w-0 flex-1">
        <item.icon className={cn("h-6 w-6 shrink-0 transition-transform group-active:scale-90", active ? "text-primary" : "text-slate-500 group-hover:text-primary")} />
        <span className={cn(
          "text-[15px] font-[900] uppercase tracking-tight transition-colors truncate",
          active ? "text-white" : "group-hover:text-white"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-4 w-4 transition-all",
        active ? "opacity-100 text-primary translate-x-1" : "opacity-0 group-hover:opacity-100 text-slate-700"
      )} />
    </Link>
  );
}

function CollapsibleGroup({ label, children, isOpen, onToggle }: any) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-10 h-14 hover:bg-white/5 transition-all text-slate-500 group">
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 overflow-hidden transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
