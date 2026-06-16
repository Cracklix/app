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
import Image from "next/image";

/**
 * @fileOverview Premium Sidebar Hub v9.0.
 * SIZING: Width fixed at 280px, Header 80px, Profile Card 28px rounding.
 * LOGO: Locked to 32px height in sidebar for professional fit.
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
    <div className="flex flex-col h-full bg-white font-body select-none text-left relative overflow-hidden">
      
      {/* 1. BRAND HEADER - 80px */}
      <div className="flex items-center justify-between px-5 h-20 border-b shrink-0">
        <div className="relative h-8 w-auto min-w-[120px]">
          <Image 
            src="/logo/cracklix-logo-dark.png"
            alt="Cracklix"
            width={130}
            height={36}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* 2. NAVIGATION HUB */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-2">
        
        {/* PROFILE CARD - 28px ROUNDING */}
        <div className="mx-4 mt-6">
           <Link href="/profile" onClick={onClose} className="block active:scale-[0.98] transition-all">
              <div className="p-4 rounded-[28px] border border-blue-100 bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                 <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-slate-50 shrink-0">
                    <StudentAvatar profile={profile} className="h-full w-full border-none" iconClassName="w-7 h-7" />
                 </div>
                 <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-none truncate">
                      {profile?.name || "Aspirant"}
                    </h3>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                        {profile?.pass?.active ? (profile.pass.plan || 'ELITE') : 'FREE_PASS'}
                      </span>
                    </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-gray-300 ml-auto shrink-0" />
              </div>
           </Link>
        </div>

        {/* SECTION HEADING */}
        <h4 className="px-6 mt-8 mb-4 text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
          Personalized Prep
        </h4>

        {/* MENU ITEMS - 56px HEIGHT */}
        <div className="flex flex-col gap-1 px-4">
           {[{ label: "My Profile", href: "/profile", icon: User }, ...mainItems].map((item: any) => {
              const isActive = pathname === item.href;
              return (
                 <Link key={item.label} href={item.href} onClick={onClose} className={cn(
                   "w-full h-14 px-6 flex items-center gap-4 rounded-2xl transition-all duration-200 group active:scale-[0.98]",
                   isActive ? "bg-blue-50 text-[#2563EB] shadow-sm" : "text-slate-600 hover:bg-slate-50"
                 )}>
                   <item.icon className={cn("w-6 h-6 shrink-0 transition-colors", isActive ? "text-[#2563EB]" : "text-slate-500 group-hover:text-[#2563EB]")} />
                   <span className={cn("font-semibold uppercase text-sm tracking-tight", isActive ? "text-[#2563EB]" : "text-slate-700")}>{item.label}</span>
                 </Link>
              )
           })}
        </div>

        {/* RESOLUTION HUB */}
        <h4 className="px-6 mt-8 mb-4 text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
          Resolution Hub
        </h4>
        <div className="flex flex-col gap-1 px-4">
           {supportItems.map((item: any) => (
              <Link key={item.label} href={item.href} onClick={onClose} className="w-full h-14 px-6 flex items-center gap-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98] text-slate-600">
                <item.icon className="w-6 h-6 text-slate-500" />
                <span className="font-semibold uppercase text-sm tracking-tight text-slate-700">{item.label}</span>
              </Link>
           ))}
        </div>

        {/* SOCIAL NODE */}
        <h4 className="px-6 mt-8 mb-4 text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
          Community Nodes
        </h4>
        <div className="px-4 mb-10 space-y-1">
           <SocialItem href={TELEGRAM_GROUP} icon={<MessageCircle />} label="Telegram Center" sub="15k+ Aspirants" />
           <SocialItem href={INSTAGRAM_PROFILE} icon={<Instagram />} label="Follow Hub" sub="@arshgrewal_official" />
        </div>
      </div>

      {/* 3. SYSTEM FOOTER - 56px HEIGHT */}
      <div className="p-4 border-t border-slate-100 bg-white mt-auto pb-[env(safe-area-inset-bottom)]">
         <button 
           onClick={handleLogout} 
           className="h-14 w-full rounded-2xl bg-slate-900 text-white hover:bg-black transition-all font-semibold uppercase text-xs tracking-widest active:scale-95 shadow-xl flex items-center justify-center gap-3"
         >
           <LogOut className="w-5 h-5 text-primary" />
           <span>Log Out Session</span>
         </button>
      </div>
    </div>
  );
}

function SocialItem({ href, icon, label, sub }: any) {
   return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="h-14 flex items-center gap-4 px-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all group active:scale-[0.98]">
         <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner text-slate-400 group-hover:text-[#2563EB] transition-colors">
            {React.cloneElement(icon, { className: "h-5 w-5" })}
         </div>
         <div className="min-w-0 text-left">
            <p className="text-[13px] font-bold uppercase tracking-tight text-[#0F172A] leading-none">{label}</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">{sub}</p>
         </div>
      </a>
   )
}
