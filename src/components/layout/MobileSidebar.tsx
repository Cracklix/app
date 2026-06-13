'use client';

import { 
  Home, 
  Zap, 
  FileText, 
  Target, 
  MessageCircleQuestion, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Gem,
  Newspaper,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview High-Fidelity Sidebar Visual Adjustment v25.0.
 * MATCHED: User screenshot layout (Header -> Download Node -> High-Density Menu).
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
      
      {/* 1. PROFILE HEADER HUB */}
      <div className="bg-[#0B1528] px-6 pt-16 pb-10 flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck className="h-40 w-40" /></div>
        
        <div className="flex flex-col items-center gap-3 relative z-10">
           <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
              {profile?.name || "Student"}
           </h2>
           {passStatus && (
              <Badge className={cn(
                "border-none px-4 py-1 rounded-md font-black uppercase text-[10px] tracking-widest shadow-xl",
                passStatus.active ? "bg-emerald-500 text-white" : "bg-rose-600 text-white"
              )}>
                 {passStatus.label}
              </Badge>
           )}
        </div>
      </div>

      {/* 2. DOWNLOAD APP NODE (EMERALD TINT) */}
      {mounted && canInstall && (
         <div 
            onClick={handleInstallClick}
            className="flex items-center justify-between px-6 py-4 bg-[#10B981]/10 border-y border-white/5 cursor-pointer active:bg-[#10B981]/20 transition-all"
         >
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-lg">
                  <Download className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <span className="text-[14px] uppercase tracking-tight font-black text-white block">Download App</span>
                  <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest leading-none mt-1">Get Official Notifications</p>
               </div>
            </div>
            <button className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-tighter shadow-md">
               INSTALL
            </button>
         </div>
      )}

      {/* 3. MENU ENGINE */}
      <div className="flex flex-col py-2">
        {menuItems.map((item) => {
          const isActive = mounted && pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-6 h-[72px] transition-all border-l-[6px]",
                isActive ? "bg-white/5 border-[#F97316]" : "hover:bg-white/5 border-transparent"
              )}
            >
              <div className="flex items-center gap-6">
                 <Icon className={cn(
                   "h-6 w-6 shrink-0 transition-all",
                   isActive ? "text-[#F97316]" : "text-slate-500"
                 )} />
                 <span className={cn(
                   "text-[15px] uppercase tracking-tight font-black",
                   isActive ? "text-white" : "text-slate-400"
                 )}>
                   {item.label}
                 </span>
              </div>

              {item.badge && (
                <Badge className="bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        <div className="my-6 border-t border-white/5 mx-6" />
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-6 px-6 h-[64px] text-rose-500 hover:bg-rose-500/5 transition-all w-full text-left"
        >
          <LogOut className="h-6 w-6 shrink-0" />
          <span className="text-[15px] font-black uppercase tracking-tight">Sign Out Node</span>
        </button>
      </div>

      {/* 4. CREDITS */}
      <div className="mt-auto px-6 py-12 flex flex-col items-center gap-2 bg-black/20 border-t border-white/5">
         <p className="text-[10px] font-black text-[#F97316] uppercase tracking-widest text-center">
            Developed by Arsh Grewal
         </p>
         <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">© Latest Pattern Hub</p>
      </div>
    </div>
  );
}
