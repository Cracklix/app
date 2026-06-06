import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ChevronLeft } from 'lucide-react';

/**
 * @fileOverview Institutional 404 Node.
 * Replaces standard browser errors with a branded, helpful navigation path.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-10 max-w-lg">
        <div className="relative">
           <p className="text-[180px] font-headline font-black text-slate-50 leading-none select-none">404</p>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl backdrop-blur-sm border border-primary/20">
                 <Search className="h-10 w-10" />
              </div>
           </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Node Not Found</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            The exam vertical or preparation asset you are looking for does not exist in the official registry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button asChild className="h-16 px-10 bg-[#0F172A] hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl gap-3 w-full sm:w-auto">
              <Link href="/"><Home className="h-4 w-4 text-primary" /> Return to Hub</Link>
           </Button>
           <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2 w-full sm:w-auto">
              <Link href="/mocks"><ChevronLeft className="h-4 w-4" /> View All Mocks</Link>
           </Button>
        </div>
      </div>
    </div>
  );
}