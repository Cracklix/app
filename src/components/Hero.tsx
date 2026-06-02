'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-punjab')?.imageUrl || "https://picsum.photos/seed/punjab-hero/1200/800";

  return (
    <section className="bg-gradient-to-r from-[#08152d] to-[#0f2450] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex bg-white/10 px-4 py-2 rounded-full mb-6 text-sm font-medium border border-white/10">
              #1 Punjab Exam Preparation Platform
            </div>

            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Prepare Smarter.
              <br />
              <span className="text-[#F97316]">
                Score Higher.
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-lg">
              Punjab Government Exams di Complete
              Preparation ik hi Platform te. Trust Cracklix for your career success.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link 
                href="/mocks" 
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
              >
                Start Free Mock
              </Link>

              <Link 
                href="/exams" 
                className="border border-white/30 hover:bg-white/10 px-8 py-4 rounded-xl font-bold transition-all"
              >
                Explore Exams
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[500px] w-full group">
            {/* Soft Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#1E5EFF] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={heroImage}
                alt="Golden Temple"
                fill
                className="object-cover"
                data-ai-hint="golden temple"
                priority
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08152d]/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                 <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Live Success</p>
                    <p className="text-xl font-black text-white">15,000+ Aspirants</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
