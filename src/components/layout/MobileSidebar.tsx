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
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StudentAvatar from "@/components/brand/StudentAvatar";

/**
 * @fileOverview Final Enterprise Mobile Sidebar (Adda247 Style).
 * Fixed: Safe-area visibility, independent scrolling, and fixed bottom logout.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    router.push('/login');
  };

  const mainPrepItems = [
    { label: "Home Hub", href: "/", icon: Home, color: "text-blue-500" },
    { label: "My Mocks", href: "/mocks", icon: Zap, color: "text-[#F97316]" },
    { label: "Exam Hubs", href: "/exams", icon: GraduationCap, color: "text-indigo-500" },
    { label: "Study Notes", href: "/notes", icon: FileText, color: "text-emerald-500" },
    { label: "Results Registry", href: "/dashboard", icon: BarChart3, color: "text-amber-500" },
    { label: "Hall of Rankers", href: "/leaderboard", icon: Trophy, color: "text-rose-500" },
    { label: "PYQ Archives", href: "/pyqs", icon: FileStack, color: "text-slate-400" },
  ];

  const secondaryItems = [
    { label: "Daily Analysis", href: "/current-affairs", icon: Newspaper },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile Settings", href: "/profile", icon: Settings },
    { label: "Institutional Contact", href: "/contact", icon: Phone },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#0F172A] overflow-hidden">
      {/* 1. PROFILE SECTION (Fixed Top) - Hardened for Safe Areas */}
      <div className="px-6 pb-8 bg-[#0B1528] shrink-0 pt-[calc(env(safe-area-inset-top,24px)+24px)] min-h-[180px] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Shield className="h-40 w-40 text-white" /></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div className="flex items-center gap-4">
              <StudentAvatar 
                profile={profile} 
                className="h-14 w-14 border-2 border-white/10 rounded-2xl shadow-xl shadow-black/20 shrink-0" 
              />
              <div className="space-y-0.5 text-left min-w-0">
                 <h2 className="font-headline font-black text-lg text-white uppercase tracking-tight leading-none truncate pr-2">
                    {profile?.name || "Aspirant Node"}
                 </h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate opacity-80">
                    {profile?.email || user?.email || "Registry: PENDING"}
                 </p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
           >
             <X className="h-4 w-4 text-slate-400" />
           </button>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
           <Badge className="bg-[#F97316] text-white border-none text-[8px] font-black uppercase px-3 py-1 rounded-lg shadow-lg">
              {profile?.status?.replace('_', ' ') || "FREE"} PASS
           </Badge>
           <Badge variant="outline" className="border-white/10 text-slate-400 text-[8px] font-black uppercase px-3 py-1 rounded-lg">
              {profile?.role || "STUDENT"}
           </Badge>
        </div>
      </div>

      {/* 2. MENU SECTION (Independent Scrolling) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar bg-white">
        <div className="space-y-1 pb-4">
          <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Preparation Trajectory</p>
          {mainPrepItems.map((item) => (
            <SidebarLink 
              key={item.href} 
              item={item} 
              active={pathname === item.href}
              onClick={onClose} 
            />
          ))}
          
          <div className="px-2 py-6">
            <Button asChild className="w-full bg-[#F97316] hover:bg-orange-600 text-white rounded-xl h-14 font-black uppercase text-[10px] tracking-widest gap-3 shadow-2xl shadow-orange-900/20 transition-all active:scale-95">
              <Link href="/pass" onClick={onClose}>
                <Gem className="h-4 w-4" /> Upgrade My Pass
              </Link>
            </Button>
          </div>

          <div className="h-px w-full bg-slate-50 my-4" />
          
          <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Institutional Nodes</p>
          {secondaryItems.map((item) => (
            <SidebarLink 
              key={item.href} 
              item={item} 
              active={pathname === item.href}
              onClick={onClose} 
            />
          ))}
        </div>
      </div>

      {/* 3. LOGOUT SECTION (Fixed Bottom) */}
      <div className="p-6 border-t border-slate-100 bg-white shrink-0 pb-[calc(env(safe-area-inset-bottom,12px)+16px)]">
         <button 
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-5 h-[56px] rounded-2xl bg-rose-50 hover:bg-rose-100 transition-all group border border-rose-100/50"
         >
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 group-hover:scale-110 transition-transform">
                  <LogOut className="h-5 w-5" />
               </div>
               <span className="font-black uppercase text-[11px] tracking-widest text-rose-600">Logout Session</span>
            </div>
            <ChevronRight className="h-4 w-4 text-rose-300" />
         </button>
      </div>
    </div>
  );
}

function SidebarLink({ item, active, onClick }: { item: any, active: boolean, onClick: () => void }) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 rounded-xl transition-all h-[56px] group border border-transparent mb-1",
        active ? "bg-primary/5 border-primary/10 shadow-sm" : "hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-inner shrink-0",
          active ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary"
        )}>
          {item.icon && <item.icon className={cn("h-5 w-5", !active && (item.color || "text-slate-400"))} />}
        </div>
        <span className={cn(
          "font-bold text-[14px] transition-colors truncate uppercase tracking-tight",
          active ? "text-primary" : "text-slate-600 group-hover:text-[#0F172A]"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-4 w-4 transition-all shrink-0",
        active ? "text-primary translate-x-0.5" : "text-slate-200 group-hover:text-slate-400"
      )} />
    </Link>
  );
}
