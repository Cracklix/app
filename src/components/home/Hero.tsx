
'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Trophy, Target } from "lucide-react";

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-punjab')?.imageUrl || "https://picsum.photos/seed/punjab-hero/1200/800";

  return (
    <header className="relative min-h-[900px] flex items-center pt-24 pb-32 bg-[#08152D] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        {/* Punjab Map Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full object-contain fill-white">
             <path d="M40 35 L55 40 L60 60 L45 70 L35 55 Z" />
          </svg>
        </div>
        
        {/* Subtle Glowing Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                #1 Punjab Exam Preparation Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-[4rem] lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-white font-headline">
                Prepare Smarter.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-500">
                  Score Higher.
                </span>
              </h1>
              <p className="text-xl text-[#7A8B9E] leading-relaxed max-w-xl font-body">
                Punjab Government Exams di Complete Preparation ik hi Platform te. 
                Premium full-length mocks designed for your absolute success.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-5">
              <Button asChild className="h-16 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl gap-3 shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 text-lg">
                <Link href="/mocks">
                  Start Free Mock <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-16 px-10 border-white/10 text-white hover:bg-white/5 bg-transparent backdrop-blur-sm rounded-2xl font-bold transition-all text-lg">
                <Link href="/exams">Explore Exams</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-4">
              <TrustItem label="10,000+ Questions" />
              <TrustItem label="500+ Mock Tests" />
              <TrustItem label="50+ Exams Covered" />
            </div>
          </motion.div>

          {/* Right Column: Premium Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={heroImage}
                alt="Golden Temple at Night"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                data-ai-hint="golden temple"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08152D] via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Card 1: Rank Indicator */}
            <FloatingCard 
              delay={0.5} 
              className="top-10 -left-10 bg-emerald-500/10 border-emerald-500/20"
              icon={<Trophy className="h-5 w-5 text-emerald-400" />}
              label="Aspirant Rank"
              value="AIR #4"
              subValue="+12 Last Week"
            />

            {/* Floating Card 2: Performance Score */}
            <FloatingCard 
              delay={0.7} 
              className="bottom-20 -right-6 bg-primary/10 border-primary/20"
              icon={<Target className="h-5 w-5 text-primary" />}
              label="Mock Accuracy"
              value="92%"
              subValue="Sectional Hero"
            />

            {/* Floating Card 3: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hidden md:block"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Growth Insights</p>
                    <p className="text-sm font-bold text-white">Punjab GK Mastery: 88%</p>
                  </div>
                </div>
                <div className="flex gap-1 items-end h-8">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1.2 + (i * 0.1), duration: 0.5 }}
                      className="w-1.5 bg-primary rounded-full" 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </header>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 group">
      <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}

function FloatingCard({ className, icon, label, value, subValue, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ y: -5 }}
      className={`absolute p-4 rounded-2xl backdrop-blur-xl border shadow-2xl z-20 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</p>
          <p className="text-lg font-black text-white leading-none mt-1">{value}</p>
          <p className="text-[10px] font-bold text-emerald-400 mt-1">{subValue}</p>
        </div>
      </div>
    </motion.div>
  );
}
