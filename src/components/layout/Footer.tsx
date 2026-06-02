
'use client';

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Twitter, Facebook, Instagram, Mail, Phone, Heart, ShieldCheck, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#08152D] text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          
          <div className="lg:col-span-2 space-y-8">
            <Logo variant="light" className="scale-110 origin-left" />
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Punjab's most advanced government exam portal. Designed for aspirants, built with integrity.
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-bold">Headquarters: Mohali, Punjab, India</span>
               </div>
               <div className="flex items-center gap-4 text-slate-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-bold">Founded by Arsh Grewal</span>
               </div>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Exam Verticals</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li><Link href="/exams" className="hover:text-primary transition-colors">PSSSB Boards</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">PPSC Gazetted</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Punjab Police</Link></li>
              <li><Link href="/exams" className="hover:text-primary transition-colors">Teaching Cadre</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Resources</h4>
            <ul className="space-y-4 text-slate-300 font-bold">
              <li><Link href="/mocks" className="hover:text-primary transition-colors">Free Mock Tests</Link></li>
              <li><Link href="/current-affairs" className="hover:text-primary transition-colors">Daily Analysis</Link></li>
              <li><Link href="/pyqs" className="hover:text-primary transition-colors">Previous Year Papers</Link></li>
              <li><Link href="/notifications" className="hover:text-primary transition-colors">Job Notifications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">Connect</h4>
            <div className="flex gap-4">
               <SocialIcon icon={<Twitter />} />
               <SocialIcon icon={<Instagram />} />
               <SocialIcon icon={<Facebook />} />
            </div>
            <div className="mt-8 space-y-2">
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Support Line</p>
               <p className="text-lg font-black text-primary">+91 98881 88602</p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-bold italic">
            © 2026 Cracklix Technologies. All official patterns verified by experts.
          </p>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
             Built with <Heart className="h-4 w-4 text-rose-500 fill-current" /> for Punjab Aspirants
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer group">
       <div className="h-5 w-5">{icon}</div>
    </div>
  );
}
