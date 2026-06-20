'use client';

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Instagram,
  MessageCircle,
} from "lucide-react";

import Logo from "@/components/brand/Logo";
import {
  TELEGRAM_GROUP,
  INSTAGRAM_PROFILE,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from "@/lib/constants";

/**
 * @fileOverview Hardened Compact Footer v2.0.
 * FIXED: Removed all excessive spacing and resolved text overlapping.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#020617] font-body text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Section */}
          <div className="space-y-4">
            <Logo
              variant="dark"
              align="left"
              imgClassName="h-[60px] md:h-[80px]"
            />
            <p className="max-w-[300px] text-sm leading-relaxed text-slate-400">
              Punjab's most advanced government exam platform for serious aspirants.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon href={TELEGRAM_GROUP} icon={<MessageCircle className="h-4 w-4" />} />
              <SocialIcon href={INSTAGRAM_PROFILE} icon={<Instagram className="h-4 w-4" />} />
            </div>
          </div>

          {/* Support Hub */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Support Hub</h3>
            <ul className="space-y-3">
              <FooterLink href="/support">Support Center</FooterLink>
              <FooterLink href="/help">Help Articles</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="/mocks">Mock Tests</FooterLink>
              <FooterLink href="/pyqs">Previous Papers</FooterLink>
              <FooterLink href="/notes">Study Notes</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Connect</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${SUPPORT_PHONE}`} className="hover:text-white transition-colors">{SUPPORT_PHONE}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">{SUPPORT_EMAIL}</a>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 uppercase font-bold">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Bathinda, Punjab</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20 py-4">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[12px] text-slate-500">© {currentYear} Cracklix. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-600">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Institutional Registry Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode; }) {
  return (
    <li>
      <Link href={href} className="text-sm text-slate-400 hover:text-primary transition-colors font-medium">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode; }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white hover:bg-primary transition-all border border-white/5">
      {icon}
    </a>
  );
}
