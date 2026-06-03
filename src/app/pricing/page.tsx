
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, ShieldCheck, Trophy, ArrowRight, Star, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

/**
 * @fileOverview Final Cracklix Pass Center (Phase 156).
 * Tiered monetization gateway for Punjab Government aspirants.
 */

const PLANS = [
  {
    id: "free",
    name: "Aspirant Basic",
    price: 0,
    tier: "Free",
    desc: "Start your journey with verified patterns.",
    features: [
      "10 Free Mocks (PSSSB/Police)",
      "Daily Analysis Feed",
      "Public Exam Calendar",
      "Limited PYQ Previews"
    ],
    icon: <Zap className="h-6 w-6 text-slate-400" />
  },
  {
    id: "silver",
    name: "Silver Pass",
    price: 99,
    tier: "Silver",
    desc: "Targeted subject mastery for state exams.",
    features: [
      "All Subject-wise Mocks",
      "Detailed Daily Analysis",
      "All Official PYQs (PDF)",
      "Performance Dashboard",
      "Bilingual Support Node"
    ],
    icon: <ShieldCheck className="h-6 w-6 text-blue-500" />
  },
  {
    id: "gold",
    name: "Gold Pass",
    price: 199,
    tier: "Gold",
    recommended: true,
    desc: "Institutional accuracy for the serious aspirant.",
    features: [
      "Everything in Silver",
      "All Full Length Mocks (500+)",
      "AI Rationale Tutors",
      "Readiness Score Index",
      "Revision Vault Access",
      "Priority WhatsApp Alerts"
    ],
    icon: <Trophy className="h-6 w-6 text-amber-500" />
  },
  {
    id: "premium",
    name: "Elite Pass",
    price: 499,
    tier: "Premium",
    desc: "Full institutional access to the elite vault.",
    features: [
      "Everything in Gold",
      "Live Mentorship (Arsh Grewal)",
      "Advance Video Courses",
      "Early Access to Test Series",
      "Dedicated Technical Support",
      "Zero Advertisements"
    ],
    icon: <Star className="h-6 w-6 text-primary" />
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="text-center space-y-8 mb-20">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] mb-6 shadow-sm">
                 Monetization Node v1.0
              </Badge>
              <h1 className="text-6xl md:text-8xl font-headline font-black text-[#0F172A] tracking-tight uppercase leading-[0.9]">
                 Select Your <br/> <span className="text-primary">Cracklix Pass</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
                 Invest in institutional precision. Unlock verified patterns and AI-powered audit rationalizations for 2026 recruitments.
              </p>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {PLANS.map((plan, idx) => (
             <motion.div 
               key={plan.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
                <Card className={`h-full border-none shadow-3xl rounded-[3rem] overflow-hidden flex flex-col group hover:translate-y-[-10px] transition-all duration-500 ${plan.recommended ? 'ring-4 ring-primary ring-offset-8 scale-105 z-10' : 'bg-white'}`}>
                   {plan.recommended && (
                      <div className="bg-primary text-white py-3 text-center text-[10px] font-black uppercase tracking-[0.3em]">
                        Recommended by Management
                      </div>
                   )}
                   <CardHeader className="p-10 pb-6 text-center space-y-6">
                      <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                         {plan.icon}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="font-headline font-black text-2xl text-[#0F172A] uppercase">{plan.name}</CardTitle>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">{plan.desc}</p>
                      </div>
                      <div className="pt-4">
                         <span className="text-5xl font-black text-[#0F172A]">₹{plan.price}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">/ month</span>
                      </div>
                   </CardHeader>
                   <CardContent className="p-10 pt-0 flex-1">
                      <div className="h-px w-full bg-slate-50 mb-8" />
                      <ul className="space-y-5">
                         {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-4">
                               <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                               <span className="text-sm font-bold text-slate-600 leading-tight">{f}</span>
                            </li>
                         ))}
                      </ul>
                   </CardContent>
                   <CardFooter className="p-10 pt-0">
                      <Button asChild className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all ${plan.recommended ? 'bg-primary hover:bg-orange-600 text-white' : 'bg-[#0F172A] hover:bg-black text-white'}`}>
                         <Link href={`/checkout?plan=${plan.id}`}>
                            {plan.price === 0 ? 'Get Started' : 'Unlock Pass'} <ArrowRight className="ml-3 h-4 w-4" />
                         </Link>
                      </Button>
                   </CardFooter>
                </Card>
             </motion.div>
           ))}
        </div>

        <div className="mt-32 p-16 rounded-[4rem] bg-[#0F172A] text-white relative overflow-hidden shadow-4xl group">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Sparkles className="h-64 w-64" /></div>
           <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10 text-left">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Institutional Integrity Check</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-headline font-black leading-tight uppercase">Bulk Institution <br/> Licensing</h2>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    Are you a coaching center or library in Punjab? Get custom multi-user passes for your aspirants with central management and analytics.
                 </p>
                 <Button asChild className="bg-white text-[#0F172A] hover:bg-slate-100 h-16 px-12 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl">
                    <Link href="/contact">Inquire for Library Node</Link>
                 </Button>
              </div>
              <div className="hidden lg:block">
                 <div className="grid grid-cols-2 gap-8">
                    <TrustPoint val="15k+" label="Aspirant Nodes" />
                    <TrustPoint val="500+" label="HQs Mocks" />
                    <TrustPoint val="22" label="Punjab Districts" />
                    <TrustPoint val="94%" label="Accuracy Node" />
                 </div>
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function TrustPoint({ val, label }: any) {
   return (
      <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
         <p className="text-4xl font-headline font-black text-primary mb-1">{val}</p>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      </div>
   )
}
