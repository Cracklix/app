'use client';

import Link from "next/link";
import { Menu, Search, User, Gem, LogOut } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useState, useMemo, useEffect } from "react";
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

/**
 * @fileOverview Definitive Header Restoration v112.0.
 * FIXED: LogOut ReferenceError resolved by adding icon import.
 * MATCHED: Exact visual nodes: [Menu] -> [Logo] -> [Pass Hub] -> [Search] -> [User]
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
    if (!profile?.pass) return { active: false, label: "FREE PASS", expiry: "N/A" };
    const active = profile.pass.active;
    const expiryDate = new Date(profile.pass.expiryDate);
    const isExpired = expiryDate < new Date();
    
    return {
      active: active && !isExpired,
      label: isExpired ? "PASS EXPIRED" : "PASS ACTIVE",
      expiry: expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  }, [profile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  return (
    <div className="sticky top-0 z-[1000] w-full pointer-events-auto">
      <nav className="w-full h-16 md:h-20 flex items-center bg-[#0B1528] border-b border-white/5 px-4 md:px-8 shadow-2xl">
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-full">
          
          {/* 1. LEFT SECTION: MENU & LOGO */}
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 md:w-12 md:h-12 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-95 outline-none">
                  <Menu className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0F172A] z-[2001]">
                <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>
                <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <Logo className="scale-90 md:scale-110 origin-left" />
          </div>

          {/* 2. SPACER / FLEX GROW */}
          <div className="flex-1" />

          {/* 3. RIGHT SECTION: PASS HUB, SEARCH, USER */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
             
             {/* PASS ACTIVE BADGE (SCREENSHOT REPLICA) */}
             {mounted && user && (
                <div className="h-12 md:h-14 px-4 md:px-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 shadow-xl">
                   <Gem className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 fill-current opacity-80" />
                   <div className="flex flex-col items-start leading-none text-left">
                      <span className={cn(
                        "text-[9px] md:text-[11px] font-black uppercase tracking-widest",
                        passStatus.active ? "text-emerald-400" : "text-rose-400"
                      )}>
                         {passStatus.label}
                      </span>
                      <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">
                         EXP: {passStatus.expiry}
                      </span>
                   </div>
                </div>
             )}

             {/* SEARCH BUTTON */}
             <Link href="/search" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all flex items-center justify-center shadow-lg">
                <Search className="h-5 w-5" />
             </Link>

             {/* USER PROFILE (CIRCULAR WHITE NODE) */}
             <div className="relative">
                {!mounted || loading ? (
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 animate-pulse" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-[3px] border-white/10 hover:border-primary transition-all bg-white shadow-2xl focus:outline-none flex items-center justify-center">
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
                          <span className="font-bold text-[14px] tracking-tight uppercase">My Profile Hub</span>
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
                  <Button asChild className="bg-primary hover:bg-orange-600 text-white font-black px-6 h-11 uppercase text-[12px] tracking-widest shadow-xl border-none transition-all active:scale-95">
                    <Link href="/login">Login Hub</Link>
                  </Button>
                )}
             </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
