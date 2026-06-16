'use client';

import React, { useState, useEffect } from "react";
import { 
  Home, 
  Zap, 
  FileText, 
  Target, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Gem,
  Newspaper,
  User,
  Trophy,
  Landmark,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Instagram,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import StudentAvatar from "@/components/brand/StudentAvatar";
import { TELEGRAM_GROUP, INSTAGRAM_PROFILE } from "@/lib/constants";

/**
 * @fileOverview Premium Sidebar Hub v5.0.
 * Unified sidebar for Mobile (Overlay) and Desktop (Managed).
 */
export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { user, profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      router.push('/');
    } catch (e) {}
  };

  const mainItems = [
    { label: "Home Page", href: "/", icon: Home },
    { label: "My Hub", href: "/my-exams", icon: Target },
    { label: "Exam List", href: "/exams", icon: Landmark },
    { label: "Practice Bank", href: "/mocks", icon: Zap },
    { label: "Study Updates", href: "/current-affairs", icon: Newspaper },
    { label: "Study Notes", href: "/notes", icon: BookOpen },
    { label: "Punjab Merit", href: "/leaderboard", icon: Trophy },
  ];

  const supportItems = [
    { label: "Support Center", href: "/support", icon: MessageCircle },
    { label: "Help Center", href: "/help", icon: HelpCircle },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 font-body select-none text-left relative">
      
      <div className="h-24 px-6 flex items-center justify-between shrink-0">
         <Logo imgClassName="h-10 w-auto" />
         <button 
           onClick={onClose}
           className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-slate-400"
         >
           <X className="h-6 w-6" />
         </button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        <div className="px-6 mb-8">
           <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 flex items-center gap-4">
              <StudentAvatar profile={profile} className="h-14 w-14 rounded-2xl border-2 border-white shadow-md bg-white" />
              <div className="min-w-0 flex-1">
                 <h2 className="text-sm md:text-base font-black text-slate-900 truncate uppercase tracking-tight">{profile?.name || "Aspirant"}</h2>
                 <Badge className="bg-blue-600 text-white border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mt-1 rounded-lg">
                    {profile?.pass?.active ? (profile.pass.plan || 'ELITE') : 'FREE NODE'}
                 </Badge>
              </div>
           </div>
        </div>

        <NavGroup label="PERSONAL PREP" items={[{ label: "My Profile", href: "/profile", icon: User }]} pathname={pathname} onClose={onClose} />
        <NavGroup label="MANAGEMENT" items={mainItems} pathname={pathname} onClose={onClose} />
        <NavGroup label="SUPPORT HUB" items={supportItems} pathname={pathname} onClose={onClose} />

        <div className="px-8 mb-3 mt-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Community</p>
        </div>
        <div className="px-4 mb-8 space-y-1">
           <a href={TELEGRAM_GROUP} target="_blank" className="h-12 flex items-center gap-3 px-4 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-[#2F6BFF] transition-all group">
              <MessageCircle className="h-5 w-5 text-slate-400 group-hover:text-[#2F6BFF]" />
              <span className="text-[14px] font-bold uppercase tracking-tight">Telegram Group</span>
           </a>
           <a href={INSTAGRAM_PROFILE} target="_blank" className="h-12 flex items-center gap-3 px-4 rounded-2xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all group">
              <Instagram className="h-5 w-5 text-slate-400 group-hover:text-rose-600" />
              <span className="text-[14px] font-bold uppercase tracking-tight">Instagram</span>
           </a>
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white mt-auto pb-safe">
         <button onClick={handleLogout} className="h-14 w-full flex items-center justify-center gap-3 px-4 rounded-2xl bg-gray-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-black uppercase text-[11px] tracking-widest active:scale-95 shadow-sm">
           <LogOut className="h-4 w-4" />
           <span>Log Out Session</span>
         </button>
      </div>
    </div>
  );
}

function NavGroup({ label, items, pathname, onClose }: any) {
   return (
      <div className="mb-6">
         <div className="px-8 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
         </div>
         <div className="flex flex-col gap-1 px-4">
            {items.map((item: any) => {
               const isActive = pathname === item.href;
               return (
                  <Link key={item.label} href={item.href} onClick={onClose} className={cn(
                    "h-12 flex items-center gap-3 px-4 rounded-2xl transition-all duration-200 group",
                    isActive ? "bg-blue-50 text-[#2F6BFF]" : "text-slate-600 hover:bg-gray-50 hover:text-[#2F6BFF]"
                  )}>
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-[#2F6BFF]" : "text-slate-400 group-hover:text-[#2F6BFF]")} />
                    <span className="text-[14px] font-bold uppercase tracking-tight">{item.label}</span>
                  </Link>
               )
            })}
         </div>
      </div>
   )
}
