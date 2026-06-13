'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from "next/link";
import { Menu, Search, User, Gem, LogOut, Target, Newspaper, Download, Zap, RefreshCw } from "lucide-react";
import Logo from "@/components/brand/Logo";
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Final Performance-Hardened Header v130.0.
 * FIXED: Hydration Mismatch via mounted state guards.
 * FIXED: Precise 82px/72px dimensions and 1024px responsive collapse.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const passStatus = useMemo(() => {
    if (!profile?.pass) return { active: false, label: "NO PASS", expiry: "N/A" };
    const active = profile.pass.active;
    const expiryDate = new Date(profile.pass.expiryDate);
    const isExpired = expiryDate < new Date();
    
    return {
      active: active && !isExpired,
      label: isExpired ? "EXPIRED" : "PASS ACTIVE",
      expiry: expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  }, [profile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  // Base styles for the Header
  const headerHeight = "h-[72px] lg:h-[82px]";

  return (
    <div className="sticky top-0 z-[1000] w-full pointer-events-auto font-body">
      <nav className={cn(
        "w-full flex items-center bg-gradient-to-r from-[#0B1528] to-[#13233F] border-b border-white/5 px-4 lg:px-8 shadow-2xl overflow-hidden backdrop-blur-[12px]",
        headerHeight
      )}>
        <div className="container mx-auto max-w-[1440px] flex items-center justify-between h-full gap-4">
          
          {/* 1. LEFT SECTION: MENU & LOGO */}
          <div className="flex items-center gap-2 shrink-0">
            {mounted ? (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <button className="w-10 h-10 md:w-12 md:h-12 bg-white/5 text-white rounded-[14px] border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-90 outline-none">
                    <Menu className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0F172A] z-[2001]">
                  <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>
                  <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
                </SheetContent>
              </Sheet>
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-[14px] border border-white/10" />
            )}
            <Logo className="!gap-0 active:scale-95 transition-transform" />
          </div>

          {/* 2. CENTER SECTION: THE NAVIGATION BLOCKS */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-12">
            
            <NavLink icon={<Target />} label1="MY" label2="EXAMS" href="/my-exams" active={pathname === "/my-exams"} />
            <NavLink icon={<Zap />} label1="PRACTICE" label2="TESTS" href="/mocks" active={pathname.startsWith("/mocks")} />
            <NavLink icon={<Newspaper />} label1="CURRENT" label2="AFFAIRS" href="/current-affairs" active={pathname === "/current-affairs"} />
            
            {/* GET PASS CTA */}
            <Link href="/pass" className="transition-all active:scale-95 group">
              <div className={cn(
                "w-[180px] h-[56px] rounded-[18px] border flex items-center justify-center gap-3 transition-all",
                pathname === "/pass" 
                  ? "bg-[#F97316]/20 border-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.15)]" 
                  : "bg-[#F97316]/12 border-[#F97316]/30 hover:bg-[#F97316]/20 hover:border-[#F97316]"
              )}>
                <Gem className={cn("h-4 w-4 transition-all", pathname === "/pass" ? "text-white fill-[#F97316]" : "text-[#F97316]")} />
                <span className={cn("text-[13px] font-black uppercase tracking-[0.18em] text-white")}>GET PASS</span>
              </div>
            </Link>

            <NavLink icon={<Zap className="text-emerald-400" />} label1="CHECK" label2="RESULTS" href="/dashboard" active={pathname.startsWith("/results")} />
            <NavLink icon={<Gem className="text-primary" />} label1="OUR" label2="PRICING" href="/pricing" active={pathname === "/pricing"} />
          </div>

          {/* 3. RIGHT SECTION: PASS HUB, SEARCH, USER */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             
             {mounted && user && (
                <div 
                  onClick={() => router.push('/pass')}
                  className={cn(
                    "hidden sm:flex h-[52px] w-[160px] rounded-xl items-center justify-center gap-3 shadow-xl shrink-0 group border transition-all cursor-pointer active:scale-95",
                    passStatus.active ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20" : "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20"
                  )}
                >
                   <Gem className={cn("h-5 w-5 fill-current", passStatus.active ? "text-emerald-400" : "text-rose-400")} />
                   <div className="flex flex-col text-left leading-none gap-0.5">
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", passStatus.active ? "text-emerald-400" : "text-rose-400")}>
                        {passStatus.label}
                      </span>
                      <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">
                         {passStatus.active ? `EXP: ${passStatus.expiry}` : "UNLOCK NOW"}
                      </span>
                   </div>
                </div>
             )}

             {/* SEARCH BUTTON */}
             <Link href="/search" className={cn(
               "w-[44px] h-[44px] rounded-xl border border-white/10 transition-all flex items-center justify-center shadow-lg active:scale-90",
               pathname === "/search" ? "bg-white/10 text-white border-white/30" : "bg-white/5 text-slate-400 hover:text-white"
             )}>
                <Search className="h-[22px] w-[22px]" />
             </Link>

             {/* USER PROFILE */}
             {mounted ? (
                <div className="relative">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-[48px] h-[48px] rounded-full overflow-hidden border-[3px] border-white/10 hover:border-primary transition-all bg-white shadow-2xl focus:outline-none flex items-center justify-center active:scale-90 cursor-pointer">
                          <StudentAvatar profile={profile} className="h-full w-full border-none" iconClassName="text-[#0B1528]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72 bg-[#0F172A] border-white/10 text-white rounded-[2.5rem] p-3 shadow-5xl z-[2001]" align="end">
                        <div className="px-5 py-6 flex items-center gap-4 text-left">
                           <StudentAvatar profile={profile} className="h-12 w-12" />
                           <div className="min-w-0">
                              <p className="text-[12px] font-black uppercase tracking-tight truncate leading-none mb-1.5">{profile?.name || "Aspirant"}</p>
                              <p className="text-[9px] font-bold text-slate-500 truncate">{user.email}</p>
                           </div>
                        </div>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem asChild className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-white/5">
                          <Link href="/profile" className="w-full flex items-center gap-4">
                            <User className="h-5 w-5 text-primary" />
                            <span className="font-bold text-[14px] tracking-tight uppercase">Profile Hub</span>
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem asChild className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-white/5">
                            <Link href="/admin" className="w-full flex items-center gap-4 text-primary">
                              <Gem className="h-5 w-5 fill-current" />
                              <span className="font-bold text-[14px] tracking-tight uppercase">Master Admin</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-rose-500/10 focus:text-rose-500 text-rose-500/80">
                          <LogOut className="h-5 w-5 shrink-0" />
                          <span className="font-bold text-[14px] tracking-tight uppercase">Logout Registry</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button asChild className="bg-primary hover:bg-orange-600 text-white font-black px-6 h-11 uppercase text-[11px] tracking-widest shadow-xl border-none transition-all active:scale-95">
                      <Link href="/login">Login Hub</Link>
                    </Button>
                  )}
                </div>
             ) : (
                <div className="w-[48px] h-[48px] rounded-full bg-white/5 animate-pulse" />
             )}
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ icon, label1, label2, href, active }: { icon: React.ReactNode, label1: string, label2: string, href: string, active: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 group transition-all active:scale-95 hover:translate-y-[-1px]",
      active ? "opacity-100" : "opacity-70 hover:opacity-100"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center shadow-sm transition-all",
        active ? "bg-[#F97316] text-white shadow-[#F97316]/20" : "bg-white/5 text-slate-400 group-hover:text-[#F97316]"
      )}>
        {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span className={cn("text-[13px] font-black uppercase tracking-[0.18em]", active ? "text-[#F97316]" : "text-white")}>{label1}</span>
        <span className={cn("text-[13px] font-black uppercase tracking-[0.18em]", active ? "text-[#F97316]" : "text-white")}>{label2}</span>
      </div>
    </Link>
  )
}
