"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Send, MapPin, ShieldCheck } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

/**
 * @fileOverview Final Screenshot-Aligned Footer Node v9.0.
 * MATCHED: Header grouping at top, Massive Logo at bottom left.
 * MATCHED: Orange Large Phone Number under Connect.
 */
export default function Footer() {
  const db = useFirestore();
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings } = useDoc<any>(settingsRef);

  const content = {
    platformName: settings?.platformName || "Cracklix",
    phone: settings?.supportPhone || "+91 98881 88602",
    tg: settings?.telegramUrl || "https://t.me/cracklixapp"
  };

  return (
    <footer className="bg-[#08152D] text-white pt-20 pb-12 border-t border-white/5 font-body">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* TOP ROW: HEADERS & LINKS */}
        <div className="flex flex-col md:flex-row justify-end gap-16 md:gap-32 mb-16 text-left">
          
          <div className="space-y-6">
            <h4 className="font-headline font-black text-[11px] uppercase tracking-[0.3em] text-slate-500">Exam Verticals</h4>
            <ul className="space-y-4 text-slate-300 font-bold text-[13px] uppercase tracking-tight">
              <li><Link href="/exams" className="hover:text-primary transition-colors">PSSSB Boards</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">PPSC Gazetted</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Punjab Police</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Teaching Cadre</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline font-black text-[11px] uppercase tracking-[0.3em] text-slate-500">Resources</h4>
            <ul className="space-y-4 text-slate-300 font-bold text-[13px] uppercase tracking-tight">
              <li><Link href="/mocks" className="hover:text-primary transition-colors">Free Mock Tests</Link></li>
              <li><Link href="/pyqs" className="hover:text-primary transition-colors">Previous Year Papers</Link></li>
              <li><Link href="/notes" className="hover:text-primary transition-colors">Study Notes</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Origin Story</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline font-black text-[11px] uppercase tracking-[0.3em] text-slate-500">Connect</h4>
            <div className="space-y-6">
               <a 
                 href={content.tg} 
                 target="_blank" 
                 className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all shadow-xl"
               >
                 <Send className="h-6 w-6 fill-current" />
               </a>
               
               <div className="space-y-1">
                  <a 
                    href={`https://wa.me/${content.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    className="text-4xl font-headline font-black text-primary leading-tight block whitespace-pre-line"
                  >
                    {content.phone.split(' ').slice(0,2).join(' ')} <br/> {content.phone.split(' ').slice(2).join(' ')}
                  </a>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Support Channel</p>
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: MASSIVE LOGO HUB */}
        <div className="pt-20 border-t border-white/5 flex flex-col items-start gap-8">
           <div className="flex flex-col items-start gap-2">
              <div className="h-28 md:h-48 flex items-center">
                 <Logo imgClassName="h-full" className="origin-left" />
              </div>
              <div className="flex items-center gap-3 w-full max-w-xl">
                 <div className="h-px flex-1 bg-white/10" />
                 <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">
                   Punjab&apos;s No. 1 Study Hub
                 </span>
                 <div className="h-px flex-1 bg-white/10" />
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 opacity-30 mt-8">
              <div className="flex items-center gap-4 text-slate-500">
                 <ShieldCheck className="h-4 w-4" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Institutional Registry Verified</span>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                © {new Date().getFullYear()} {content.platformName} | Developed by Arsh Grewal
              </p>
           </div>
        </div>
      </div>
    </footer>
  );
}
