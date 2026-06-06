
"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useFirestore, useUser, useCollection } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  Info,
  Lock,
  Edit,
  ShieldAlert,
  Zap,
  Gem
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Mock Overview Node with Tiered Pass Enforcement.
 * FREE content is open to all. PREMIUM requires specific tier or any active pass.
 */

export default function MockOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user, profile } = useUser()
  const mockId = params.id as string
  
  const { data: mock, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: passes } = useCollection<any>(useMemo(() => (db ? collection(db, "passes") : null), [db]))

  const requiredPass = useMemo(() => {
    if (!mock?.passId || !passes) return null;
    return passes.find((p: any) => p.id === mock.passId);
  }, [mock, passes])

  const isAuthority = useMemo(() => {
    if (!profile) return false;
    const isFounder = user?.email === 'arshdeepgrewal1122@gmail.com';
    return profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN' || isFounder;
  }, [profile, user])

  const isLocked = useMemo(() => {
    if (!mock || !profile) return true;
    if (isAuthority) return false;

    // Content level is Free - Everyone enters
    if (mock.accessType === 'FREE') return false;
    
    // Content is Premium
    const userPassStatus = profile.status || 'Free';
    if (userPassStatus === 'Free') return true;

    // Specific Pass Check: If mock requires a specific tier (e.g. Gold)
    if (mock.passId && userPassStatus !== mock.passId) {
      // NOTE: Here we could add "Heirarchy" logic, but as per current MVP, 
      // we check for specific Tier ID or match.
      return true;
    }

    return false;
  }, [mock, profile, isAuthority])

  if (mockLoading) return <div className="h-screen flex items-center justify-center bg-white"><Skeleton className="h-20 w-20 rounded-full" /></div>
  if (!mock) return <div className="h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">Mock node not found.</div>

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <Navbar />
      
      {isAuthority && (
         <div className="bg-[#0F172A] border-b border-white/5 py-3 px-6 flex items-center justify-between shadow-2xl relative z-50">
            <div className="flex items-center gap-4 text-left">
               <ShieldAlert className="h-4 w-4 text-primary" />
               <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Authority Bypass Active</p>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-orange-600 text-white rounded-xl h-10 px-6 font-black uppercase text-[9px] tracking-widest gap-2 shadow-xl">
               <Link href={`/admin/mocks/builder?id=${mockId}`}><Edit className="h-3.5 w-3.5" /> Modify Blueprint</Link>
            </Button>
         </div>
      )}

      <main className="flex-1">
        <section className="bg-slate-50 border-b border-slate-100 py-10 md:py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <Button variant="ghost" onClick={() => router.back()} className="rounded-xl text-slate-400 hover:text-[#0F172A] gap-2 mb-6 p-0 h-auto">
              <ChevronLeft className="h-4 w-4" /> Back to Hub
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4 max-w-2xl text-left">
                 <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-orange-50 text-primary border-none px-3 py-1 rounded-lg font-black uppercase text-[9px] tracking-widest">
                       {mock.boardId?.toUpperCase() || "STATE"} OFFICIAL
                    </Badge>
                    {mock.accessType === 'PREMIUM' && (
                      <Badge className="bg-amber-100 text-amber-600 border-none px-3 py-1 rounded-lg font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5">
                         <Lock className="h-3 w-3" /> {requiredPass?.name || 'PREMIUM'} NODE
                      </Badge>
                    )}
                 </div>

                 <h1 className="text-3xl md:text-5xl font-headline font-black text-[#000000] uppercase leading-tight tracking-tight">
                   {mock.title}
                 </h1>

                 <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4 text-primary" /><span className="text-xs font-bold">{mock.duration || 120} Mins</span></div>
                    <div className="flex items-center gap-2 text-slate-500"><BookOpen className="h-4 w-4 text-primary" /><span className="text-xs font-bold">{mock.totalQuestions || 150} Questions</span></div>
                 </div>
              </div>

              <div className="w-full md:w-auto">
                 {isLocked ? (
                    <Button asChild className="w-full h-16 md:h-20 md:px-12 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-amber-900/20 gap-4">
                      <Link href={requiredPass ? `/checkout?plan=${requiredPass.id}` : "/pass"}>
                        <Lock className="h-5 w-5" /> Get {requiredPass?.name || 'Premium'} Pass
                      </Link>
                    </Button>
                 ) : (
                    <Button asChild className="w-full h-16 md:h-20 md:px-12 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-slate-300 gap-4 group">
                      <Link href={`/mocks/${mockId}/attempt`}>Start Practice <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                 )}
              </div>
            </div>
          </div>
        </section>

        {isLocked ? (
           <div className="container mx-auto px-6 py-24 max-w-4xl text-center">
              <div className="space-y-12">
                 <div className="relative inline-block">
                    <div className="h-32 w-32 bg-amber-50 rounded-[3rem] flex items-center justify-center mx-auto text-amber-500 shadow-xl border border-amber-100">
                       <Lock className="h-12 w-12" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                       <Gem className="h-6 w-6 text-primary" />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-4xl font-headline font-black text-[#0F172A] uppercase">{requiredPass?.name || 'Premium'} Vault Gated</h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                       This high-fidelity practice series requires the {requiredPass?.name || 'Premium'} tier. Upgrade your pass to unlock upcoming exam patterns and AI rationalizations.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <LockFeature icon={<Zap />} label="500+ Full Mocks" />
                    <LockFeature icon={<ShieldCheck />} iconColor="text-emerald-500" label="Official PYQs" />
                    <LockFeature icon={<CheckCircle2 />} iconColor="text-blue-500" label="AI Solutions" />
                 </div>

                 <Button asChild className="h-16 px-16 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-3xl shadow-primary/30">
                    <Link href={requiredPass ? `/checkout?plan=${requiredPass.id}` : "/pass"}>Unlock {requiredPass?.name || 'Premium'} Now</Link>
                 </Button>
              </div>
           </div>
        ) : (
          <div className="container mx-auto px-6 py-12 max-w-6xl">
             <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 text-left space-y-8 shadow-inner">
                <h3 className="text-xl font-headline font-black uppercase text-[#0F172A] flex items-center gap-4"><Info className="h-6 w-6 text-primary" /> Institutional Guidelines</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Guideline text="Ensure stable connectivity throughout the attempt node." />
                   <Guideline text="Bilingual toggle available inside the CBT engine." />
                   <Guideline text="Audit results generated instantly after submission." />
                   <Guideline text="Access Protocol: Upcoming exam patterns." />
                </ul>
             </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function Guideline({ text }: { text: string }) {
   return (
      <li className="flex gap-4 items-start text-left">
         <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
         <span className="text-sm font-bold text-slate-600 leading-snug">{text}</span>
      </li>
   )
}

function LockFeature({ icon, label, iconColor = "text-primary" }: any) {
   return (
      <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
         <div className={cn("h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center", iconColor)}>
            {icon}
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]">{label}</span>
      </div>
   )
}
