"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Twitter, Facebook, Instagram, Mail, Phone, Heart, ShieldCheck, MapPin, Send, Code, User, Share2 } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemo } from "react";
import ShareButton from "@/components/navigation/ShareButton";

/**
 * @fileOverview Final Institutional Footer Node v8.2.
 * UPDATED: Replaced 2026 with Latest Pattern branding.
 */

export default function Footer() {
  const db = useFirestore();
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings } = useDoc<any>(settingsRef);

  const content = {
    platformName: settings?.platformName || "Cracklix",
    footerText: settings?.footerText || "Punjab's most advanced government exam portal. Designed for aspirants, built with integrity.",
    email: settings?.supportEmail || "cracklixhelp@gmail.com",
    phone: settings?.supportPhone || "+91 98881 88602",
    address: settings?.address || "Shergarh, Bathinda, Punjab",
    fb: settings?.facebookUrl || "#",
    ig: settings?.instagramUrl || "#",
    tw: settings?.twitterUrl || "#",
    tg: settings?.telegramUrl || "https://t.me/cracklixapp"
  };

  return (
    <footer className="bg-[#08152D] text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          
          <div className="lg:col-span-2 space-y-8 text-left">
            <Logo variant="light" className="scale-110 origin-left" />
            <p className="text-slate-400 text-lg leading-relaxed max-sm">
              {content.footerText}
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">HQs: {content.address}</span>
               </div>
               <div className="flex items-center gap-4 text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">Institutional Registry Verified</span>
               </div>
            </div>
            
            <div className="pt-4">
               <ShareButton 
                  variant="dark" 
                  className="bg-white/5 hover:bg-white/10 border border-white/10 h-14 px-8" 
               />
            </div>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Exam Verticals</h4>
            <ul className="space-y-4 text-slate-300 font-bold text-sm">
              <li><Link href="/exams" className="hover:text-primary transition-colors">PSSSB Boards</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">PPSC Gazetted</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Punjab Police</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Teaching Cadre</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Resources</h4>
            <ul className="space-y-4 text-slate-300 font-bold text-sm">
              <li><Link href="/mocks" className="hover:text-primary transition-colors">Free Mock Tests</Link></li>
              <li><Link href="/pyqs" className="hover:text-primary transition-colors">Previous Year Papers</Link></li>
              <li><Link href="/notes" className="hover:text-primary transition-colors">Study Notes</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Origin Story</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Connect</h4>
            <div className="flex flex-wrap gap-4">
               <SocialIcon icon={<Send className="fill-current" />} href={content.tg} label="Telegram" />
               {content.tw !== "#" && <SocialIcon icon={<Twitter />} href={content.tw} label="Twitter" />}
               {content.ig !== "#" && <SocialIcon icon={<Instagram />} href={content.ig} label="Instagram" />}
               {content.fb !== "#" && <SocialIcon icon={<Facebook />} href={content.fb} label="Facebook" />}
            </div>
            <div className="mt-8 space-y-4">
               <a 
                 href={`https://wa.me/${content.phone.replace(/[^0-9]/g, '')}`} 
                 target="_blank" 
                 className="text-2xl font-black text-primary hover:text-orange-400 transition-colors block"
               >
                 {content.phone}
               </a>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Official Support Channel</p>
            </div>
          </div>
        </div>

        {/* INSTITUTIONAL CREDITS BAR */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              © Latest Pattern {content.platformName} | All Rights Reserved.
            </p>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">
               Founder & Lead Developer: Arsh Grewal
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/5 opacity-50">
             <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry Secure Punjab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode, href: string, label?: string }) {
  const isDummy = href === "#" || !href;
  if (isDummy) return null;

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      title={label}
      className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer group"
    >
       <div className="h-5 w-5">{icon}</div>
    </a>
  );
}
