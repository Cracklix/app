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

/**
 * @fileOverview Official Home Hub v120.0 (Unified Content Design).
 * ORDER: Hero (inc. Stats) -> Popular Exams Hub -> Continue Learning -> Categories -> Latest Mocks.
 */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      
      {/* 1. HERO HUB (Background image + Main Headline + Stats) */}
      <Hero />

      {/* 2. POPULAR EXAMS HUB (White card with checklist) */}
      <PopularExams />

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl space-y-16 md:space-y-32">
         {/* 3. CONTINUITY ZONE */}
         <ContinueLearning />
         
         {/* 4. DISCOVERY ZONE */}
         <FeaturedCategories />
         
         {/* 5. RECENT CONTENT */}
         <LatestMocks />
      </div>

      {/* 6. TRUST & IDENTITY NODES */}
      <AppPreview />
      <MeetFounder />
      
      <Footer />
    </main>
  );
}
