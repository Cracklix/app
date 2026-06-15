import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ChevronLeft } from 'lucide-react';

/**
 * @fileOverview Institutional 404 Node (High Density).
 * FIXED: Typography scaling for small mobile screens.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="space-y-10 max-w-lg w-full">
        <div className="relative">
           <p className="text-[120px] md:text-[180px] font-headline font-black text-slate-50 leading-none select-none animate-pulse">404</p>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-primary/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl backdrop-blur-sm border border-primary/20">
                 <Search className="h-8 w-8 md:h-10 md:w-10" />
              </div>
           </div>
        </div>

        <div className="space-y-3 px-4">
          <h1 className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-tight">Node Not Found</h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg leading-relaxed antialiased">
            The exam vertical or preparation asset you are looking for does not exist in the official registry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
           <Button asChild className="h-14 md:h-16 px-10 bg-[#0F172A] hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl gap-3 w-full transition-all active:scale-95 border-none">
              <Link href="/"><Home className="h-4 w-4 text-primary" /> Return Hub</Link>
           </Button>
           <Button asChild variant="outline" className="h-14 md:h-16 px-10 rounded-2xl border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest gap-2 w-full transition-all active:scale-95 hover:bg-slate-50">
              <Link href="/mocks"><ChevronLeft className="h-4 w-4" /> All Mocks</Link>
           </Button>
        </div>
      </div>
    </div>
  );
}