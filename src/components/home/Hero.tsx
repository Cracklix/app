
'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck,
  Zap,
  Search,
  ChevronRight
} from "lucide-react";
import { useUser } from "@/firebase";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

/**
 * @fileOverview High-Fidelity Hero Restoration v65.0.
 * UPDATED: Optimized text sizes for better layout balance.
 * UPDATED: Maintained massive Punjabi tagline and multi-vertical list.
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-police')?.imageUrl || "https://grppunjab.org/wp-content/uploads/2025/09/PP10_slider.jpg";

  const handleAction = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-[#0B1528] overflow-hidden text-left">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          
          {/* LEFT: CONTENT HUB */}
          <div className="lg:col-span-7 space-y-6 md:space-y-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-2xl">
              <Zap className="h-3 w-3 text-primary fill-current" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary">PUNJAB'S NO. 1 STUDY CENTER</span>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <h1 className="text-2xl md:text-5xl font-black leading-tight tracking-tight uppercase text-white flex flex-col">
                     <span>ਤਿਆਰੀ ਪੰਜਾਬ ਦੀ,</span>
                     <span className="text-primary">ਸੁਪਨਾ ਸਰਕਾਰੀ</span>
                     <span className="text-primary">ਅਫ਼ਸਰ ਦਾ!</span>
                  </h1>
               </div>
               
               <div className="space-y-4">
                  <h2 className="text-lg md:text-2xl font-headline font-black text-white uppercase tracking-tight leading-tight">
                     CRACK PSSSB, POLICE, PSPCL, PSTET, CTET, MASTER CADRE, ETT CADRE & OTHER PUNJAB GOVT EXAMS.
                  </h2>
                  <p className="text-sm md:text-lg font-medium text-slate-400 max-w-xl leading-relaxed">
                     The most trusted practice tests for Punjab Government Exams. Latest pattern based study plans verified by experts.
                  </p>
               </div>
            </div>

            {/* INTEGRATED SEARCH HUB */}
            <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
               <div className="relative flex items-center bg-white rounded-2xl md:rounded-[1.2rem] overflow-hidden p-1 shadow-2xl">
                  <Search className="absolute left-6 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Patwari, SI, PPSC..." 
                    className="h-12 md:h-14 pl-14 border-none bg-transparent text-slate-900 font-bold text-base md:text-lg focus-visible:ring-0 placeholder:text-slate-400"
                  />
                  <Button type="submit" className="bg-[#0B1528] hover:bg-black text-white px-6 md:px-10 h-10 md:h-12 rounded-xl md:rounded-lg font-black uppercase text-[10px] md:text-xs tracking-widest border-none ml-2">
                     SEARCH
                  </Button>
               </div>
            </form>

            <div className="pt-2">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="bg-primary hover:bg-orange-600 transition-all font-black px-12 h-14 md:h-16 rounded-2xl text-white flex items-center justify-center gap-4 shadow-4xl uppercase text-[10px] md:text-xs tracking-[0.2em] border-none active:scale-95"
              >
                START PRACTICE <Zap className="h-5 w-5 fill-current" />
              </Button>
            </div>
          </div>

          {/* RIGHT: VISUAL HUB */}
          <div className="lg:col-span-5 relative group">
             <div className="relative aspect-[4/3] md:aspect-[16/11] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-5xl border-[6px] border-white/5 bg-[#0F172A]">
                <Image 
                  src={heroImage} 
                  fill 
                  alt="Punjab Police Official Hub" 
                  className="object-cover opacity-90 transition-transform duration-[3s] group-hover:scale-105" 
                  priority
                  data-ai-hint="punjab police"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* STATUS OVERLAY */}
                <div className="absolute bottom-8 left-8">
                   <div className="bg-black/30 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border border-white/10 shadow-4xl flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xl">
                         <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                         <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-0.5">OFFICIAL HUB</p>
                         <p className="text-base font-black text-white uppercase tracking-tight">VERIFIED CONTENT</p>
                      </div>
                   </div>
                </div>

                {/* LIVE STUDENT OVERLAY */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 animate-in fade-in zoom-in duration-700">
                   <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 flex items-center gap-4 shadow-5xl border border-white shadow-orange-500/10">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                         <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary fill-current" />
                      </div>
                      <div className="text-left pr-2">
                         <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">LIVE STUDENTS</p>
                         <p className="text-2xl md:text-4xl font-black text-[#0B1528] leading-none tabular-nums">15k+</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
