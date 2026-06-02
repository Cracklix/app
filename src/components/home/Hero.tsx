'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="relative min-h-[700px] flex items-center pt-16 pb-24 bg-[#0B1528] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Tagline Badge */}
          <div className="inline-block text-[#FF8800] text-[0.9rem] font-bold tracking-[2px] uppercase mb-6 border border-[#FF8800]/20 bg-[#FF8800]/5 px-4 py-1.5 rounded-full">
            Punjab's No. 1 Mock Test Hub
          </div>
          
          <h1 className="text-[3.5rem] lg:text-[4.5rem] font-extrabold leading-[1.15] text-white tracking-tight mb-4">
            Prepare Smarter.<br />
            <span className="text-[#FF8800]">Score Higher.</span>
          </h1>
          
          <p className="text-[1.15rem] text-[#7A8B9E] leading-[1.6] mb-10 max-w-[650px]">
            Complete your Punjab Government Exam preparation with our premium high-yield mock tests, designed strictly according to latest patterns.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Button asChild className="h-[56px] px-8 bg-[#FF8800] hover:bg-[#E07700] text-white font-bold rounded-lg gap-2 shadow-lg shadow-[#FF8800]/25 transition-all hover:-translate-y-0.5">
              <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" asChild className="h-[56px] px-8 border-white/20 text-white hover:bg-white/5 hover:border-white rounded-lg font-bold bg-transparent transition-all">
              <Link href="/exams">Explore Exams</Link>
            </Button>
          </div>

          {/* Authentic Live Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#14223A] border border-white/5 p-6 rounded-xl flex items-center gap-5"
            >
              <div className="w-[50px] h-[50px] bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" className="w-6 h-6">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5a2.5 2.5 0 0 1-2.5-2.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white text-[1.75rem] font-extrabold leading-none mb-0.5">10,000+</h3>
                <p className="text-[#7A8B9E] text-[0.85rem] font-bold uppercase tracking-[0.5px]">
                  Practice Questions
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#14223A] border border-white/5 p-6 rounded-xl flex items-center gap-5"
            >
              <div className="w-[50px] h-[50px] bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8800" strokeWidth="2" className="w-6 h-6">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white text-[1.75rem] font-extrabold leading-none mb-0.5">500+</h3>
                <p className="text-[#7A8B9E] text-[0.85rem] font-bold uppercase tracking-[0.5px]">
                  Mock Tests
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
