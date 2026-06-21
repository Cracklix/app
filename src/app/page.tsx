import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import GlobalSearch from "@/components/home/GlobalSearch";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import LatestMocks from "@/components/home/LatestMocks";
import ContinueLearning from "@/components/home/ContinueLearning";
import CurrentAffairsPreview from "@/components/home/CurrentAffairsPreview";
import MeritPreview from "@/components/home/MeritPreview";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";

/**
 * @fileOverview Official Home Page v190.0 (Clean Architecture).
 * UPDATED: Removed PopularExams to strictly enforce the 8-Category Discover flow.
 */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-body pb-safe text-left">
      <Navbar />
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Global Search */}
      <div className="relative z-40 py-8 md:py-12 bg-white">
        <GlobalSearch />
      </div>

      {/* 3. Exam Categories (The only top-level discovery point) */}
      <FeaturedCategories />

      {/* 4. Latest Mock Tests */}
      <LatestMocks />

      {/* 5. Preparation Hub */}
      <Features />

      {/* 6. Personal Progress */}
      <ContinueLearning />

      {/* 7. Knowledge Hub */}
      <CurrentAffairsPreview />

      {/* 8. Merit Rankings */}
      <MeritPreview />

      {/* 9. Mobile App */}
      <AppPreview />

      {/* 10. Leadership Section */}
      <MeetFounder />
      
      <Footer />
    </main>
  );
}
