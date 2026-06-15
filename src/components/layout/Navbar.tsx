'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { 
  Search, 
  User, 
  LogOut, 
  Menu, 
  Home, 
  Zap, 
  Newspaper, 
  Gem, 
  Download, 
  ShieldCheck 
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StudentAvatar from "@/components/brand/StudentAvatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import PWAInstallButton from "@/components/PWAInstallButton";

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

/**
 * @fileOverview High-Fidelity Master Navbar Hub v45.0 (Screenshot Matched).
 * UPDATED: Implemented the exact icon+label navigation nodes and enlarged official logo.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("[NAVBAR_LOGOUT_FAILURE]:", error);
    }
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN' || (user?.email && SUPER_ADMIN_WHITELIST.includes(user.email.toLowerCase()));

  const isActivePass = useMemo(() => {
     if (!profile?.pass?.active) return false;
     return new Date(profile.pass.expiryDate) > new Date();
  }, [profile]);

  if (!mounted) return null;

  return (
    <div className="w-full sticky top-0 z-[1000] font-body">
      <nav className="w-full border-b border-white/5 bg-[#0A0E1A] h-16 md:h-24 px-4 md:px-6 shadow-2xl flex items-center">
        <div className="container mx-auto max-w-[1400px] flex items-center justify-between h-full gap-4">
          
          {/* 1. LEFT: SIDEBAR TRIGGER & LOGO */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="w-10 h-10 bg-white/5 text-white rounded-xl border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-all hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo imgClassName="h-12 md:h-18 lg:h-22" />
          </div>

          {/* 2. CENTER: SCREENSHOT-MATCHED NAV LINKS (Desktop) */}
          <div className="hidden xl:flex items-center gap-8">
             <NavLink href="/" icon={<Home className="h-5 w-5 text-white" />} label="HOME PAGE" iconBg="bg-[#F97316]" active={pathname === '/'} />
             <NavLink href="/mocks" icon={<Zap className="h-5 w-5 text-slate-400" />} label="PRACTICE TESTS" iconBg="bg-white/5" active={pathname === '/mocks'} />
             <NavLink href="/current-affairs" icon={<Newspaper className="h-5 w-5 text-slate-400" />} label="CURRENT AFFAIRS" iconBg="bg-white/5" active={pathname === '/current-affairs'} />
          </div>

          {/* 3. RIGHT: ACTION HUB */}
          <div className="flex items-center gap-3 md:gap-5">
             
             {/* GET PASS NODE */}
             <div className="hidden lg:block">
               <Button asChild variant="ghost" className="h-12 px-6 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 gap-3">
                  <Link href="/pass"><Gem className="h-4 w-4 text-[#F97316]" /> GET PASS</Link>
               </Button>
             </div>

             {/* INSTALL NODE */}
             <div className="hidden md:block">
                <PWAInstallButton 
                  className="h-12 px-6 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl shadow-lg border-none" 
                  showLabel 
                />
             </div>

             {/* PASS STATUS NODE */}
             {isActivePass && (
                <div className="hidden sm:flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl shadow-lg">
                   <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                   <div className="flex flex-col text-left">
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">PASS ACTIVE</span>
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">EXP: {new Date(profile!.pass!.expiryDate).toLocaleDateString()}</span>
                   </div>
                </div>
             )}

             <div className="h-8 w-px bg-white/10 hidden sm:block mx-2" />

             {/* SEARCH & PROFILE */}
             <Link href="/search" className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-inner">
                <Search className="h-5 w-5" />
             </Link>

             {user ? (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/10 overflow-hidden shadow-xl cursor-pointer bg-white active:scale-95 transition-transform flex items-center justify-center">
                      <StudentAvatar profile={profile} className="h-full w-full border-none" />
                   </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 bg-[#0F172A] border-white/10 text-white rounded-2xl p-2 shadow-5xl z-[2001] mt-4">
                    <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer rounded-xl focus:bg-white/5">
                       <Link href="/profile" className="flex items-center gap-4">
                          <User className="h-5 w-5 text-blue-400" />
                          <span className="font-bold text-sm uppercase tracking-tight">My Profile</span>
                       </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10 mt-1 border border-white/5">
                        <Link href="/admin" className="flex items-center gap-4 text-white">
                          <ShieldCheck className="h-5 w-5 text-rose-500" />
                          <span className="font-bold text-sm uppercase tracking-tight text-rose-500">Admin Hub</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                    <DropdownMenuItem onClick={handleLogout} className="px-4 py-3 cursor-pointer rounded-xl focus:bg-rose-50/10 text-rose-500">
                       <LogOut className="h-5 w-5 shrink-0" />
                       <span className="font-bold text-sm uppercase tracking-tight">Log Out Session</span>
                    </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             ) : (
               <Button asChild className="px-6 h-12 bg-[#111827] hover:bg-[#1f2937] text-white font-black text-xs rounded-xl border border-white/10 transition-all uppercase tracking-widest shadow-xl">
                 <Link href="/login">Student Login</Link>
               </Button>
             )}
          </div>
        </div>
      </nav>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0A0E1A] z-[2001]">
          <SheetHeader className="sr-only">
             <SheetTitle>Navigation Sidebar</SheetTitle>
             <SheetDescription>Access institutional preparation resources and exam verticals.</SheetDescription>
          </SheetHeader>
          <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavLink({ href, icon, label, iconBg, active }: { href: string, icon: React.ReactNode, label: string, iconBg: string, active?: boolean }) {
  return (
    <Link href={href} className="group flex items-center gap-3.5 px-2 py-1 transition-all">
       <div className={cn(
         "h-11 w-11 rounded-xl flex items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-110",
         active ? "shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "",
         iconBg
       )}>
          {icon}
       </div>
       <span className={cn(
         "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
         active ? "text-[#F97316]" : "text-slate-500 group-hover:text-white"
       )}>
          {label}
       </span>
    </Link>
  )
}
