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
 * @fileOverview Official Home Hub v135.0 (Institutional Reference Match).
 * FLOW: Hero (with Integrated Stats) -> Trending -> Popular Exams Card -> Categories -> Mocks.
 */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      
      {/* 1. INSTITUTIONAL HERO HUB (Dark Navy + Police BG + Stats Strip) */}
      <Hero />

      {/* 2. TRENDING VERTICALS HUB (Badge Strip) */}
      <TrendingExams />

      {/* 3. POPULAR EXAMS HUB (Refined White Card with Icons & Feature Checklist) */}
      <PopularExams />

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl space-y-16 md:space-y-32">
         {/* 4. CONTINUITY HUB (Only visible for logged-in students) */}
         <ContinueLearning />
         
         {/* 5. DISCOVERY HUB (Category Grids) */}
         <FeaturedCategories />
         
         {/* 6. RECENT CONTENT FEED (Latest Practice Mocks) */}
         <LatestMocks />
      </div>

      {/* 7. TRUST & BRAND IDENTITY (App Installation & Founder Bio) */}
      <AppPreview />
      <MeetFounder />
      
      <Footer />
    </main>
  );
}
