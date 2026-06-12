"use client"

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ContinueLearning from "@/components/home/ContinueLearning";
import LatestMocks from "@/components/home/LatestMocks";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";
import PopularExams from "@/components/home/PopularExams";
import TrendingExams from "@/components/home/TrendingExams";

/**
 * @fileOverview Official Home Hub v130.0 (Institutional Alignment).
 * FLOW: Hero -> Popular Exams -> Continue Learning -> Featured Categories -> Mocks.
 */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      
      {/* 1. HERO HUB (Command Center with Background Image + Stats) */}
      <Hero />

      {/* 2. POPULAR EXAMS HUB (White card with features checklist) */}
      <PopularExams />

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl space-y-16 md:space-y-32">
         {/* 3. CONTINUITY HUB */}
         <ContinueLearning />
         
         {/* 4. DISCOVERY HUB */}
         <FeaturedCategories />
         
         {/* 5. RECENT CONTENT FEED */}
         <LatestMocks />
      </div>

      {/* 6. TRUST & BRAND IDENTITY */}
      <AppPreview />
      <MeetFounder />
      
      <Footer />
    </main>
  );
}
