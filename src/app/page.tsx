import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ContinueLearning from "@/components/home/ContinueLearning";
import LatestMocks from "@/components/home/LatestMocks";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";

/**
 * @fileOverview Official Home Hub v171.0.
 * REBUILT: Integrated the new interactive Hero architecture as the primary entry node.
 */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] font-body pb-safe overflow-x-hidden text-left selection:bg-orange-500/30">
      <Navbar />
      
      {/* PHASE 1: REBUILT HERO & PORTALS */}
      <Hero />

      {/* PHASE 2: STUDENT CONTEXT */}
      <ContinueLearning />

      {/* PHASE 3: DISCOVERY LAYERS */}
      <div className="bg-white rounded-t-[3rem] md:rounded-t-[5rem] -mt-10 relative z-20 overflow-hidden">
        <FeaturedCategories />
        <LatestMocks />
        <AppPreview />
        <MeetFounder />
        <Footer />
      </div>
    </main>
  );
}
