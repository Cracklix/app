
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gem, Loader2, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCollection, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { useMemo } from "react"

/**
 * @fileOverview Final Cracklix Pass Center v15.0.
 * Updated: High-Fidelity Premium Dark Aesthetic (Black & Gold).
 */
export default function PassPage() {
  const db = useFirestore()
  const passQuery = useMemo(() => (db ? collection(db, "passes") : null), [db])
  const { data: rawPasses, loading } = useCollection<any>(passQuery)

  const passes = useMemo(() => {
    if (!rawPasses) return []
    return rawPasses.filter((p: any) => p.active === true).sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [rawPasses])

  return (
    <div className="min-h-screen bg-[#020817] font-body pb-safe overflow-x-hidden text-white">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <main className="container mx-auto px-4 py-16 md:py-32 max-w-7xl relative z-10">
        <div className="text-center space-y-6 md:space-y-10 mb-16 md:mb-24">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-primary/20 text-primary border-primary/30 px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] mb-8 shadow-2xl">
                 Official Registry 2026
              </Badge>
              <h1 className="text-4xl md:text-8xl font-headline font-black tracking-tight uppercase leading-[0.9]">
                 UNLOCK YOUR <br/> <span className="text-primary">ELITE PASS</span>
              </h1>
              <p className="text-sm md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mt-8 leading-relaxed">
                 Gain institutional-grade access to verified exam patterns, bilingual rationalizations, and all Punjab merit rankings.
              </p>
           </motion.div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-500">Synchronizing Registry...</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 items-stretch">
              {passes?.map((plan: any, idx: number) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="h-full">
                   <Card className={`h-full border-white/5 shadow-5xl rounded-[3rem] overflow-hidden flex flex-col transition-all duration-500 ${plan.recommended ? 'bg-primary text-white scale-105 ring-8 ring-primary/10 z-10' : 'bg-white/5 backdrop-blur-2xl hover:bg-white/10 text-white'}`}>
                      {plan.recommended && (
                         <div className="bg-white text-primary py-2 text-center text-[9px] font-black uppercase tracking-[0.3em]">
                           Most Popular Node
                         </div>
                      )}
                      <CardHeader className="p-8 md:p-12 pb-6 md:pb-8 text-center space-y-6">
                         <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl ${plan.recommended ? 'bg-white text-primary' : 'bg-primary/20 text-primary'}`}>
                            {plan.type === 'FREE' ? <Zap className="h-8 w-8" /> : <Gem className="h-8 w-8" />}
                         </div>
                         <div className="space-y-2">
                           <CardTitle className={`font-headline font-black text-2xl md:text-3xl uppercase tracking-tight ${plan.recommended ? 'text-white' : 'text-white'}`}>{plan.name}</CardTitle>
                           <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed line-clamp-2 px-2 ${plan.recommended ? 'text-white/80' : 'text-slate-400'}`}>{plan.description}</p>
                         </div>
                         <div className="pt-4">
                            <span className="text-5xl md:text-6xl font-black">₹{plan.price}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${plan.recommended ? 'text-white/70' : 'text-slate-500'}`}>/ {plan.durationDays} Days</span>
                         </div>
                      </CardHeader>
                      <CardContent className="px-8 md:px-12 pb-8 md:pb-10 flex-1">
                         <div className={`h-px w-full mb-8 ${plan.recommended ? 'bg-white/20' : 'bg-white/5'}`} />
                         <ul className="space-y-4">
                            {plan.features?.map((feat: string, i: number) => (
                               <li key={i} className="flex items-start gap-4 text-left">
                                  <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${plan.recommended ? 'text-white' : 'text-primary'}`} />
                                  <span className={`text-xs md:text-sm font-bold uppercase leading-tight ${plan.recommended ? 'text-white' : 'text-slate-300'}`}>{feat}</span>
                               </li>
                            ))}
                         </ul>
                      </CardContent>
                      <CardFooter className="p-8 md:p-12 pt-0">
                         <Button asChild className={`w-full h-16 md:h-20 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-4xl transition-all active:scale-95 ${plan.recommended ? 'bg-white text-primary hover:bg-slate-100' : 'bg-primary hover:bg-orange-600 text-white'}`}>
                            <Link href={`/checkout?plan=${plan.id}`}>
                               Activate Node <ArrowRight className="ml-3 h-5 w-5" />
                            </Link>
                         </Button>
                      </CardFooter>
                   </Card>
                </motion.div>
              ))}
           </div>
        )}

        <div className="mt-24 md:mt-48 p-12 md:p-24 rounded-[4rem] bg-gradient-to-r from-primary to-orange-600 text-white relative overflow-hidden shadow-5xl group text-left">
           <div className="absolute top-0 right-0 p-12 opacity-20 rotate-12 group-hover:scale-125 transition-transform"><Star className="h-64 w-64 md:h-96 md:w-96" /></div>
           <div className="max-w-4xl relative z-10 space-y-8 md:space-y-12">
              <div className="flex items-center gap-6">
                 <ShieldCheck className="h-12 w-12 md:h-20 md:w-20 text-white" />
                 <h2 className="text-4xl md:text-8xl font-headline font-black uppercase leading-[0.85] tracking-tighter">Your Future <br/> Is Gated.</h2>
              </div>
              <p className="text-lg md:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl antialiased">
                 Every mastery pass node includes 24/7 access to the official PSSSB registry and real-time current affairs verification.
              </p>
              <Button asChild className="h-16 md:h-20 px-12 md:px-20 bg-[#020817] text-white hover:bg-black rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] md:text-sm shadow-5xl transition-all active:scale-95">
                 <Link href="/mocks">Explore All Hubs</Link>
              </Button>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
