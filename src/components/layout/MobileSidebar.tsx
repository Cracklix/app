
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
  Trophy
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview High-Fidelity Mobile Sidebar.
 * Features institutional user profile section and deep navigation nodes.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, profile } = useUser();

  const menuItems = [
    { label: "Study Notes", href: "/notes", icon: FileText, color: "text-emerald-500" },
    { label: "PYQ Archives", href: "/pyqs", icon: FileStack, color: "text-blue-500" },
    { label: "Daily Analysis", href: "/current-affairs", icon: Newspaper, color: "text-amber-500" },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays, color: "text-primary" },
    { label: "Notifications", href: "/notifications", icon: Bell, color: "text-rose-500" },
    { label: "System Settings", href: "/profile", icon: Settings, color: "text-slate-400" },
    { label: "Contact Us", href: "/contact", icon: Phone, color: "text-primary" },
    { label: "Privacy Policy", href: "/privacy", icon: Shield, color: "text-slate-400" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      {/* Header Profile Section */}
      <div className="p-8 bg-gradient-to-br from-[#0B1528] to-[#0F172A] border-b border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-14 w-14 border-2 border-[#F97316] rounded-2xl shadow-xl">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-white font-black text-xl">
              {profile?.name?.[0] || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-headline font-black text-lg truncate uppercase">{profile?.name || "Aspirant"}</p>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{profile?.role || "STUDENT"}</span>
               <div className="h-1 w-1 rounded-full bg-slate-700" />
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{profile?.status || "FREE"}</span>
            </div>
          </div>
        </div>

        <Button asChild className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-orange-900/20">
          <Link href="/pass" onClick={onClose}>
            <Gem className="h-4 w-4" /> Upgrade to Gold Pass
          </Link>
        </Button>
      </div>

      {/* Navigation Nodes */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className="font-bold text-sm text-slate-200 group-hover:text-white">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-primary transition-all" />
            </Link>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-8 border-t border-white/5 opacity-40">
         <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 text-primary" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em]">Cracklix v1.0 • Arsh Grewal</p>
         </div>
      </div>
    </div>
  );
}
