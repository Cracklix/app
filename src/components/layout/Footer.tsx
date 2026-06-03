"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Twitter, Facebook, Instagram, Mail, Phone, Heart, ShieldCheck, MapPin, Send } from "lucide-react";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

/**
 * @fileOverview Final Institutional Footer Node.
 * Updated Address: Shergarh, Bathinda, Punjab.
 * Added: Telegram and WhatsApp integration.
 */

export default function Footer() {
  const db = useFirestore();
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings } = useDoc<any>(settingsRef);

  const content = {
    footerText: settings?.footerText || "Punjab's most advanced government exam portal. Designed for aspirants, built with integrity.",
    email: settings?.supportEmail || "arshdeepgrewal1122@gmail.com",
    phone: settings?.supportPhone || "+91 98881 88602",
    fb: settings?.facebookUrl || "#",
    ig: settings?.instagramUrl || "#",
    tw: settings?.twitterUrl || "#",
    tg: "https://t.me/cracklixapp"
  };

  return (
    <footer className="bg-[#08152D] text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          
          <div className="lg:col-span-2 space-y-8 text-left">
            <Logo variant="light" className="scale-110 origin-left" />
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              {content.footerText}
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-bold">HQs: Shergarh, Bathinda, Punjab</span>
               </div>
               <div className="flex items-center gap-4 text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-bold">Institutional Registry Verified</span>
               </div>
            </div>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Exam Verticals</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li><Link href="/exams" className="hover:text-primary transition-colors">PSSSB Boards</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">PPSC Gazetted</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Punjab Police</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Teaching Cadre</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Resources</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li><Link href="/mocks" className="hover:text-primary transition-colors">Free Mock Tests</Link></li>
              <li><Link href="/current-affairs" className="hover:text-primary transition-colors">Daily Analysis</Link></li>
              <li><Link href="/pyqs" className="hover:text-primary transition-colors">Previous Year Papers</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Origin Story</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Connect</h4>
            <div className="flex gap-4">
               <SocialIcon icon={<Send className="fill-current" />} href={content.tg} label="Telegram" />
               <SocialIcon icon={<Twitter />} href={content.tw} label="Twitter" />
               <SocialIcon icon={<Instagram />} href={content.ig} label="Instagram" />
               <SocialIcon icon={<Facebook />} href={content.fb} label="Facebook" />
            </div>
            <div className="mt-8 space-y-2">
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Founder: Arsh Grewal</p>
               <a 
                 href="https://wa.me/919888188602" 
                 target="_blank" 
                 className="text-2xl font-black text-primary hover:text-orange-400 transition-colors block"
               >
                 +91 98881 88602
               </a>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold italic">
            © 2026 {settings?.platformName || 'Cracklix'} Technologies. Built with ❤️ in Punjab.
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
             Built for Punjab Aspirants by <span className="text-white font-black">Arsh Grewal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode, href: string, label?: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      title={label}
      className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer group"
    >
       <div className="h-5 w-5">{icon}</div>
    </a>
  );
}
