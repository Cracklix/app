'use client';

import Link from "next/link";
import { Menu, Search, Zap, LogOut, ShieldCheck, Download, User, Target, Newspaper, Gem, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { useState, useMemo, useEffect } from "react";
import { useUser, useAuth, useFirestore } from "@/firebase";
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
import { doc, onSnapshot } from "firebase/firestore";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";

/**
 * @fileOverview FINAL Screenshot Replica Header v95.0.
 * MATCHED: Exact node sequence, color palette, and high-fidelity tactical boxes from user reference.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<any>(null);
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (db) {
       return onSnapshot(doc(db, 'settings', 'global'), (snap) => {
          if (snap.exists()) setAnnouncement(snap.data());
       });
    }
  }, [db]);

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
      {/* 1. TOP ANNOUNCEMENT BAR (MATCHED) */}
      {announcement?.showAnnouncement && (
        <div className="bg-[#F97316] text-white py-2 flex items-center overflow-hidden relative shadow-lg h-9">
          <div className="flex items-center gap-3 animate-marquee whitespace-nowrap min-w-full">
            <Zap className="h-3.5 w-3.5 shrink-0 ml-4 fill-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">{announcement.announcement}</p>
            <span className="mx-40 md:mx-80" />
            <Zap className="h-3.5 w-3.5 shrink-0 fill-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">{announcement.announcement}</p>
            <span className="mx-40 md:mx-80" />
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION HUB (NAVY BACKGROUND) */}
      <nav className="w-full bg-[#0B1528] border-b border-white/5 h-20 md:h-28 flex items-center shadow-2xl overflow-x-auto no-scrollbar">
        <div className="container mx-auto max-w-full flex items-center gap-6 md:gap-10 px-4 md:px-10">
          
          {/* MENU & LOGO NODE */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <button className="bg-white/5 text-white p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0F172A] z-[2001]">
                <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>
                <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <Logo className="scale-100" />
          </div>

          {/* FUNCTIONAL LINK STRIP (SCREENSHOT MATCHED) */}
          <div className="flex items-center gap-6 md:gap-8 shrink-0">
             
             {/* MY EXAMS */}
             <Link href="/my-exams" className="flex items-center gap-3 group">
                <Target className="h-5 w-5 md:h-6 md:w-6 text-[#F97316] shrink-0" />
                <div className="flex flex-col text-left">
                   <span className="text-[10px] md:text-[12px] font-black text-white/50 leading-none uppercase">MY</span>
                   <span className="text-[11px] md:text-[14px] font-black text-white group-hover:text-[#F97316] transition-colors uppercase mt-1 leading-none">EXAMS</span>
                </div>
             </Link>

             {/* PRACTICE TESTS */}
             <Link href="/mocks" className="flex items-center gap-3 group">
                <div className="flex flex-col text-left">
                   <span className="text-[10px] md:text-[12px] font-black text-white/50 leading-none uppercase">PRACTICE</span>
                   <span className="text-[11px] md:text-[14px] font-black text-white group-hover:text-[#F97316] transition-colors uppercase mt-1 leading-none">TESTS</span>
                </div>
             </Link>

             {/* GET PASS BUTTON (ORANGE BORDER) */}
             <Link href="/pass" className="flex items-center gap-3 h-12 md:h-16 px-5 md:px-8 bg-white/5 border border-[#F97316]/40 rounded-xl hover:bg-[#F97316]/5 transition-all shadow-xl group">
                <Gem className="h-5 w-5 text-[#F97316] fill-current" />
                <span className="text-[11px] md:text-[14px] font-black text-[#F97316] uppercase tracking-wider">GET PASS</span>
             </Link>

             {/* CURRENT AFFAIRS */}
             <Link href="/current-affairs" className="flex items-center gap-3 group">
                <Newspaper className="h-5 w-5 md:h-6 md:w-6 text-[#F97316] shrink-0" />
                <div className="flex flex-col text-left">
                   <span className="text-[10px] md:text-[12px] font-black text-[#F97316] leading-none uppercase">CURRENT</span>
                   <span className="text-[11px] md:text-[14px] font-black text-[#F97316] group-hover:text-white transition-colors uppercase mt-1 leading-none">AFFAIRS</span>
                </div>
             </Link>

             {/* INSTALL APP (EMERALD BORDER) */}
             <button 
                onClick={() => (window as any).deferredPrompt?.prompt()}
                className="flex items-center gap-3 h-12 md:h-16 px-5 md:px-8 bg-white/5 border border-[#10B981]/40 rounded-xl hover:bg-[#10B981]/5 transition-all shadow-xl group"
             >
                <Download className="h-5 w-5 text-[#10B981]" />
                <span className="text-[11px] md:text-[14px] font-black text-[#10B981] uppercase tracking-wider">INSTALL APP</span>
             </button>

             {/* PASS ACTIVE STATUS (EMERALD HUB) */}
             {mounted && user && (
                <div className="flex items-center gap-4 h-12 md:h-16 px-5 md:px-8 bg-white/5 border border-[#10B981]/40 rounded-xl shrink-0 shadow-lg">
                   <Gem className="h-6 w-6 md:h-8 md:w-8 text-[#10B981] shrink-0 fill-current opacity-60" />
                   <div className="flex flex-col items-start justify-center">
                      <span className={cn(
                        "text-[10px] md:text-[13px] font-black uppercase tracking-widest leading-none",
                        passStatus.active ? "text-[#10B981]" : "text-rose-500"
                      )}>
                         {passStatus.label}
                      </span>
                      <span className="text-[7px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 leading-none">
                         EXP: {passStatus.expiry}
                      </span>
                   </div>
                </div>
             )}
          </div>

          {/* SEARCH & PROFILE HUB (FAR RIGHT) */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto shrink-0 pr-4 md:pr-0">
            <Link 
               href="/search" 
               className="bg-white/5 text-slate-400 hover:text-white p-3 rounded-xl border border-white/10 transition-all hover:bg-white/10"
            >
              <Search className="h-6 w-6" />
            </Link>

            <div className="relative shrink-0">
              {!mounted || loading ? (
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-white/5 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-10 md:h-14 md:w-14 rounded-full overflow-hidden border-2 border-white/20 hover:border-primary transition-all bg-[#0F172A] shadow-2xl focus:outline-none">
                      <StudentAvatar profile={profile} className="h-full w-full border-none" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 bg-[#0F172A] border-white/10 text-white rounded-[2.5rem] p-3 shadow-5xl z-[2001]" align="end">
                    <div className="px-5 py-6 flex items-center gap-4">
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
                          <Zap className="h-5 w-5 fill-current" />
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
                <Button asChild className="bg-primary hover:bg-orange-600 text-white font-black px-6 md:px-10 h-11 md:h-14 uppercase text-[10px] md:text-[12px] tracking-widest shadow-xl border-none transition-all active:scale-95">
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
