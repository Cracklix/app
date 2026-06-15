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
  Settings
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import StudentAvatar from "@/components/brand/StudentAvatar";

/**
 * @fileOverview Premium Blue Sidebar Hub v3.1.
 * UPDATED: Standardized to Title Case for navigation labels.
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
    await signOut(auth);
    onClose();
    router.push('/');
  };

  const managementItems = [
    { label: "Home Page", href: "/", icon: Home },
    { label: "My Hub", href: "/my-exams", icon: Target },
    { label: "Exam List", href: "/exams", icon: Landmark },
    { label: "Practice Bank", href: "/mocks", icon: Zap },
    { label: "Study Updates", href: "/current-affairs", icon: Newspaper },
    { label: "Study Notes", href: "/notes", icon: BookOpen },
    { label: "Punjab Merit", href: "/leaderboard", icon: Trophy },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 font-body select-none text-left">
      
      {/* 1. LOGO SECTION */}
      <div className="h-24 px-6 flex items-center shrink-0">
         <Logo imgClassName="h-12 w-auto" />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* 2. USER PROFILE CARD */}
        <div className="px-6 mb-8">
           <div className="h-[88px] bg-blue-50 border border-blue-100 rounded-[1.5rem] md:rounded-3xl p-4 flex items-center gap-4 group transition-all">
              <div className="relative shrink-0">
                 <StudentAvatar profile={profile} className="h-12 w-12 rounded-2xl border-2 border-white shadow-md bg-white" />
                 <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-blue-50 flex items-center justify-center">
                    <ShieldCheck className="h-2 w-2 text-white" />
                 </div>
              </div>
              <div className="min-w-0 flex-1">
                 <h2 className="text-sm font-bold text-slate-900 truncate">
                    {profile?.name || "Aspirant"}
                 </h2>
                 <div className="flex items-center mt-1">
                    <Badge className="bg-white text-blue-600 border-blue-100 text-[10px] font-semibold px-2 py-0 h-5 rounded-lg shadow-sm">
                       {profile?.pass?.active ? (profile.pass.plan || 'Premium') : 'Free Pass'}
                    </Badge>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. PROFILE SETTINGS SECTION */}
        <div className="px-8 mb-3">
           <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400">Profile Settings</p>
        </div>
        <div className="px-4 mb-8">
           <Link 
             href="/profile" 
             onClick={onClose}
             className={cn(
               "h-12 w-full flex items-center gap-3 px-4 rounded-2xl transition-all duration-200 group",
               pathname === '/profile' ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
             )}
           >
              <User className={cn("h-5 w-5", pathname === '/profile' ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
              <span className="text-[15px] font-semibold">My Profile</span>
           </Link>
        </div>

        {/* 4. MANAGEMENT CENTER SECTION */}
        <div className="px-8 mb-3">
           <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400">Management Center</p>
        </div>
        
        <div className="flex flex-col gap-1 px-4 mb-8">
           {managementItems.map((item) => {
             const isActive = pathname === item.href;
             const Icon = item.icon;
             return (
               <Link 
                 key={item.label} 
                 href={item.href} 
                 onClick={onClose} 
                 className={cn(
                   "h-12 flex items-center gap-3 px-4 rounded-2xl transition-all duration-200 group",
                   isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                 )}
               >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
                  <span className="text-[15px] font-semibold">{item.label}</span>
               </Link>
             )
           })}
        </div>
      </div>

      {/* 5. LOGOUT SECTION */}
      <div className="p-6 border-t border-slate-200 bg-white mt-auto pb-safe">
         <button 
           onClick={handleLogout} 
           className="h-12 w-full flex items-center gap-3 px-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-semibold active:scale-95"
         >
           <LogOut className="h-5 w-5" />
           <span className="text-[15px]">Log Out Session</span>
         </button>
      </div>
    </div>
  );
}