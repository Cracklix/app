'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  ArrowRight,
  BookOpen,
  ClipboardList,
  Tv,
  FileText as FileTextIcon,
  Users,
  CheckCheck,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";
import Logo from "@/components/brand/Logo";

// Card for the floating features
const FeatureCard = ({ icon, label, href, className }: { icon: React.ReactNode, label: string, href: string, className?: string }) => (
  <Link href={href}>
    <motion.div 
      className={cn("absolute bg-white rounded-xl md:rounded-2xl shadow-lg px-3 py-2 md:px-4 md:py-3 cursor-pointer flex items-center gap-2 group z-20", className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-1.5 bg-blue-50 rounded-md">
        {icon}
      </div>
      <span className="text-[10px] md:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors whitespace-nowrap">{label}</span>
    </motion.div>
  </Link>
);

// Card for the bottom stats bar
const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-2 h-12 w-12 flex items-center justify-center bg-blue-50 rounded-2xl text-primary">{icon}</div>
    <p className="text-xl md:text-2xl font-black text-slate-900">{value}</p>
    <p className="text-xs text-slate-500 font-medium">{label}</p>
  </div>
);

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);
  
  const formatStat = (num: number, fallback: string) => {
      if (!num || !mounted) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + 'k+';
      return num.toString();
  };
  
  const trustStat = formatStat(stats?.totalUsers, "10,000+");
  const practiceQuestionsStat = formatStat(stats?.totalQuestions, "10,000+");
  const mockTestsStat = formatStat(stats?.totalMocks, "100+");

  if (!mounted) {
    return <section className="w-full bg-background pt-8 pb-12 md:py-24 min-h-[90vh]"></section>;
  }

  return (
    <section className="w-full bg-background pt-8 pb-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col items-center text-center">

          {/* Top Bar */}
          <div className="w-full flex justify-between items-center mb-8 md:mb-12">
            <Logo variant="dark" />
            <div className="bg-white rounded-full shadow-md px-3 py-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-current" />
              <div>
                <p className="text-sm font-black text-slate-800 leading-none">{trustStat}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-none">Students Trust Us</p>
              </div>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight"
          >
            Your Journey to <br/>
            <span className="text-primary">Government Job</span> Starts Here!
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-xl text-slate-600 text-base md:text-lg"
          >
            Best preparation platform for all major Punjab Government Exams.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex items-center justify-center gap-3 md:gap-4 text-sm md:text-base text-slate-600 font-semibold"
          >
            <span>PSSSB</span><span className="text-slate-300">•</span>
            <span>PCS</span><span className="text-slate-300">•</span>
            <span>PSPCL</span><span className="text-slate-300">•</span>
            <span>CTET</span><span className="text-slate-300">•</span>
            <span>PSTET</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mt-8 md:mt-12 w-full max-w-[450px] mx-auto h-[350px] md:h-[400px]"
          >
            <img
              src="/images/hero-student.png"
              alt="Student preparing for exams"
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/student/500/500"; }}
            />
            <FeatureCard icon={<Tv className="h-4 w-4 text-primary"/>} label="Live Classes" href="#" className="top-[15%] left-[5%] sm:left-[-10%]" />
            <FeatureCard icon={<CheckCheck className="h-4 w-4 text-green-500"/>} label="Mock Tests" href="/mocks" className="top-[45%] left-[-5%] sm:left-[-15%]" />
            <FeatureCard icon={<BookOpen className="h-4 w-4 text-purple-500"/>} label="Study Material" href="/notes" className="top-[15%] right-[5%] sm:right-[-10%]" />
            <FeatureCard icon={<FileTextIcon className="h-4 w-4 text-orange-500"/>} label="Previous Papers" href="/pyqs" className="top-[45%] right-[-5%] sm:right-[-15%]" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 space-y-4 w-full max-w-sm mx-auto"
          >
            <Button asChild size="lg" className="w-full h-14 rounded-full bg-primary text-base font-bold shadow-lg">
              <Link href="/mocks">
                Start Learning <ArrowRight className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full h-14 rounded-full border-primary text-primary bg-transparent text-base font-bold">
              <Link href="/mocks">
                <ClipboardList className="mr-2 h-5 w-5"/> Take Free Mock Test
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.5 }}
             className="mt-12 md:mt-20 pt-8 border-t border-slate-200 w-full"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <StatItem icon={<Tv className="h-8 w-8"/>} value="500+" label="Live Classes" />
              <StatItem icon={<FileTextIcon className="h-8 w-8"/>} value={practiceQuestionsStat} label="Practice Questions" />
              <StatItem icon={<CheckCheck className="h-8 w-8"/>} value={mockTestsStat} label="Mock Tests" />
              <StatItem icon={<Trophy className="h-8 w-8"/>} value="Top Faculty" label="Expert Guidance" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="bg-primary rounded-2xl p-6 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/seed/avatar1/100" alt="" data-ai-hint="person"/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/seed/avatar2/100" alt="" data-ai-hint="person"/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/seed/avatar3/100" alt="" data-ai-hint="person"/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://picsum.photos/seed/avatar4/100" alt="" data-ai-hint="person"/>
              </div>
              <p className="text-white font-bold text-sm md:text-base">Join {trustStat} Successful Aspirants Today!</p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
