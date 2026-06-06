"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gem, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCollection, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { useMemo } from "react"

export default function PassPage() {
  const db = useFirestore()
  const passQuery = useMemo(() => (db ? collection(db, "passes") : null), [db])
  const { data: rawPasses, loading } = useCollection<any>(passQuery)

  const passes = useMemo(() => {
    if (!rawPasses) return []
    return rawPasses.filter((p: any) => p.active === true).sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [rawPasses])

  return (
    <div className="min-h-screen bg-slate-50/50 font-body pb-safe overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-10 md:py-24 max-w-7xl">
        <div className="text-center space-y-4 md:space-y-8 mb-12 md:mb-20">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest mb-4">
                 Official Registry
              </Badge>
              <h1 className="text-3xl md:text-7xl lg:text-8xl font-headline font-black text-[#0F172A] tracking-tight uppercase leading-none">
                 SELECT YOUR <br/> <span className="text-primary">MASTERY PASS</span>
              </h1>
              <p className="text-xs md:text-lg text-slate-500 font-medium max-w-xl mx-auto mt-4 leading-relaxed">
                 Invest in institutional precision. Unlock upcoming exam patterns and AI rationalizations for all recruitments.
              </p>
           </motion.div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="font-black uppercase text-[9px] tracking-widest text-slate-400">Syncing Registry...</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 items-stretch">
              {passes?.map((plan: any, idx: number) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="h-full">
                   <Card className={`h-full border-none shadow-xl rounded-2xl md:rounded-[3.5rem] overflow-hidden flex flex-col bg-white group hover:shadow-2xl transition-all ${plan.recommended ? 'ring-2 md:ring-4 ring-primary ring-offset-4 md:ring-offset-8 z-10' : ''}`}>
                      {plan.recommended && (
                         <div className="bg-primary text-white py-1.5 md:py-3 text-center text-[7px] md:text-[10px] font-black uppercase tracking-widest">
                           Management Choice
                         </div>
                      )}
                      <CardHeader className="p-6 md:p-10 pb-4 md:pb-6 text-center space-y-4 md:space-y-6">
                         <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto shadow-inner">
                            {plan.type === 'FREE' ? <Zap className="h-5 w-5 md:h-7 md:w-7 text-slate-300" /> : <Gem className="h-5 w-5 md:h-7 md:w-7 text-amber-500" />}
                         </div>
                         <div className="space-y-1">
                           <CardTitle className="font-headline font-black text-lg md:text-2xl text-[#0F172A] uppercase">{plan.name}</CardTitle>
                           <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2">{plan.description}</p>
                         </div>
                         <div className="pt-2 md:pt-4">
                            <span className="text-3xl md:text-5xl font-black text-[#0F172A]">₹{plan.price}</span>
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">/ {plan.durationDays} Days</span>
                         </div>
                      </CardHeader>
                      <CardContent className="px-6 md:px-10 pb-6 md:pb-8 flex-1">
                         <div className="h-px w-full bg-slate-50 mb-6 md:mb-8" />
                         <ul className="space-y-3 md:space-y-4">
                            {plan.features?.map((feat: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-left">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-[10px] md:text-xs font-bold text-slate-600 leading-tight uppercase">{feat}</span>
                               </li>
                            ))}
                         </ul>
                      </CardContent>
                      <CardFooter className="p-6 md:p-10 pt-0">
                         <Button asChild className={`w-full h-12 md:h-16 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl transition-all ${plan.recommended ? 'bg-primary hover:bg-orange-600 text-white' : 'bg-[#0F172A] hover:bg-black text-white'}`}>
                            <Link href={`/checkout?plan=${plan.id}`}>
                               Initialize <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                         </Button>
                      </CardFooter>
                   </Card>
                </motion.div>
              ))}
           </div>
        )}

        <div className="mt-12 md:mt-32 p-8 md:p-24 rounded-2xl md:rounded-[5rem] bg-[#0F172A] text-white relative overflow-hidden shadow-4xl group text-left">
           <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Sparkles className="h-64 w-64 md:h-96 md:w-96" /></div>
           <div className="max-w-3xl relative z-10 space-y-6 md:space-y-12">
              <div className="flex items-center gap-4 md:gap-6">
                 <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                 <h2 className="text-3xl md:text-7xl font-headline font-black uppercase leading-tight">Audit Your <br/> Progress.</h2>
              </div>
              <p className="text-sm md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                 Official preparation nodes are audited daily to ensure absolute pattern accuracy for upcoming exams.
              </p>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
