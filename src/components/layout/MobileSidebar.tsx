'use client';

import { 
  Home, 
  Zap, 
  FileText, 
  Target, 
  Library, 
  MessageCircleQuestion, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  User,
  Gem,
  Share2,
  Newspaper,
  Download,
  X
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import StudentAvatar from "@/components/brand/StudentAvatar";
import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview High-Fidelity Restored Sidebar v21.0.
 * RESTORED: Pass Expiry and Install App nodes.
 */
export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const { profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
      setCanInstall(true);
    }
    const handleInstallable = () => setCanInstall(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const passStatus = useMemo(() => {
    if (!profile?.pass) return null;
    const active = profile.pass.active;
    const expiry = new Date(profile.pass.expiryDate);
    const isExpired = expiry < new Date();
    
    return {
      active: active && !isExpired,
      label: isExpired ? "PASS EXPIRED" : "PASS ACTIVE",
      expiry: expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
  }, [profile]);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    router.push('/');
  };

  const handleInstallClick = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
    } else {
       toast({ title: "Check Home Screen", description: "The app is already installed or your browser doesn't support direct prompting." });
    }
  };

  const menuItems = [
    { label: "Platform Home", href: "/", icon: Home },
    { label: "My Exam Hub", href: "/my-exams", icon: Target },
    { label: "Practice Mocks", href: "/mocks", icon: Zap },
    { label: "Study Center", href: "/notes", icon: FileText },
    { label: "Updates Hub", href: "/current-affairs", icon: Newspaper },
    { label: "Upgrade Pass", href: "/pass", icon: Gem, badge: "ELITE" },
    { label: "Contact Us", href: "/contact", icon: MessageCircleQuestion },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white overflow-y-auto no-scrollbar font-body select-none">
      
      {/* 1. PROFILE & PASS HUB */}
      <div className="bg-[#0B1528] px-6 pt-16 pb-8 flex flex-col gap-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck className="h-40 w-40" /></div>
        
        <div className="flex items-center gap-4 relative z-10">
           <div className="relative shrink-0">
              <StudentAvatar 
                profile={profile} 
                className="h-14 w-14 rounded-2xl border-2 border-white/10 shadow-2xl bg-[#0F172A]" 
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-5 w-5 rounded-md border-2 border-[#0B1528] flex items-center justify-center shadow-xl">
                 <ShieldCheck className="h-3 w-3 text-white" />
              </div>
           </div>
           
           <div className="flex-1 min-w-0 text-left space-y-1.5">
              <h2 className="text-base font-black text-white leading-tight uppercase tracking-tight truncate">
                 {profile?.name || "Student"}
              </h2>
              {passStatus ? (
                 <div className="flex flex-col gap-1">
                    <Badge className={cn(
                      "border-none px-3 py-0.5 rounded-md font-black uppercase text-[7px] tracking-widest shadow-xl w-fit",
                      passStatus.active ? "bg-emerald-500" : "bg-rose-600"
                    )}>
                       {passStatus.label}
                    </Badge>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">EXP: {passStatus.expiry}</p>
                 </div>
              ) : (
                 <Badge className="bg-white/10 text-slate-400 border-none px-2 py-0.5 rounded-md font-black uppercase text-[7px] tracking-widest">
                    FREE ACCESS
                 </Badge>
              )}
           </div>
        </div>

        <Link 
          href="/profile" 
          onClick={onClose}
          className="flex items-center justify-between w-full p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative z-10"
        >
          <div className="flex items-center gap-3">
             <User className="h-4 w-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Aspirant Profile</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
        </Link>
      </div>

      {/* 2. MENU ENGINE */}
      <div className="flex flex-col py-4">
        {mounted && canInstall && (
           <button 
              onClick={handleInstallClick}
              className="flex items-center justify-between px-6 h-[64px] transition-all group border-l-4 border-emerald-500 bg-emerald-500/10 mb-2"
           >
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <Download className="h-5 w-5" />
                 </div>
                 <div className="text-left">
                    <span className="text-[14px] uppercase tracking-tight font-black text-white block">Download App</span>
                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Get official notifications</p>
                 </div>
              </div>
              <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase animate-pulse">INSTALL</Badge>
           </button>
        )}

        {menuItems.map((item) => {
          const isActive = mounted && pathname === item.href;
          
          return (
            <Link 
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-6 h-[58px] transition-all group border-l-4",
                isActive ? "bg-primary/10 border-primary" : "hover:bg-white/5 border-transparent"
              )}
            >
              <div className="flex items-center gap-4">
                 <item.icon className={cn(
                   "h-5 w-5 shrink-0 transition-all",
                   isActive ? "text-primary scale-110" : "text-slate-500"
                 )} />
                 <span className={cn(
                   "text-[13px] uppercase tracking-tight font-black",
                   isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                 )}>
                   {item.label}
                 </span>
              </div>

              {item.badge && (
                <span className="text-[8px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        <div className="my-4 border-t border-white/5 mx-6" />
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 h-[58px] text-rose-500 hover:bg-rose-500/5 transition-all w-full text-left"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="text-[13px] font-black uppercase tracking-tight">Sign Out Node</span>
        </button>
      </div>

      {/* 3. CREDITS */}
      <div className="mt-auto px-6 py-10 flex flex-col items-center gap-2 bg-black/20 border-t border-white/5">
         <p className="text-[9px] font-black text-primary uppercase tracking-widest text-center">
            Developed by Arsh Grewal
         </p>
         <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest leading-none">© Latest Pattern Hub</p>
      </div>
    </div>
  );
}
