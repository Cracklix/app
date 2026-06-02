import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Shield, BookOpen, Clock, Target, ChartColumn, ArrowRight, Smartphone, CircleCheckBig, Star, Zap, GraduationCap, Scale, Landmark, Stethoscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ExamCard from "@/components/exams/ExamCard"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import { PsssbIcon, PoliceIcon, TeachingIcon, PpscIcon } from "@/lib/exam-icons"
import Logo from "@/components/brand/Logo"

export default function Home() {
  const boards = [
    { name: "PSSSB", sub: "Patwari, Clerk, Excise", icon: <PsssbIcon />, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "PPSC", sub: "PCS, Naib Tehsildar, SDE", icon: <PpscIcon />, color: "text-green-500", bg: "bg-green-50" },
    { name: "Punjab Police", sub: "Constable, SI, Intelligence", icon: <PoliceIcon />, color: "text-rose-500", bg: "bg-rose-50" },
    { name: "Teaching Exams", sub: "PSTET, Master Cadre", icon: <TeachingIcon />, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "High Court", sub: "Clerk, Stenographer", icon: <Scale className="h-10 w-10" />, color: "text-slate-500", bg: "bg-slate-50" },
    { name: "PSPCL & PSTCL", sub: "ALM, LDC, JE", icon: <Zap className="h-10 w-10" />, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "BFUHS", sub: "Staff Nurse, Pharmacist", icon: <Stethoscope className="h-10 w-10" />, color: "text-cyan-500", bg: "bg-cyan-50" },
    { name: "Banking & Cooperative", sub: "Coop Bank, MARKFED", icon: <Landmark className="h-10 w-10" />, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden hero-gradient">
        {/* Punjab Map Watermark */}
        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="h-64 w-64 text-white">
            <path d="M50 5 L70 15 L85 40 L80 70 L50 95 L20 70 L15 40 L30 15 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm border border-white/10">
                <Shield className="h-3 w-3" />
                Punjab's Most Trusted Platform
              </div>
              <h1 className="text-6xl md:text-7xl font-black font-headline leading-tight text-white">
                Prepare Smarter.<br />
                <span className="text-primary">Score Higher.</span>
              </h1>
              <p className="text-xl text-white/70 max-w-xl leading-relaxed">
                Punjab Government Exams di Complete Preparation ik hi Platform te.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <HeroStat icon={<BookOpen className="h-4 w-4" />} value="10,000+" label="Practice Questions" />
                <HeroStat icon={<Clock className="h-4 w-4" />} value="500+" label="Mock Tests" />
                <HeroStat icon={<Target className="h-4 w-4" />} value="50+" label="Exams Covered" />
                <HeroStat icon={<ChartColumn className="h-4 w-4" />} value="Detailed" label="Analytics" />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-xl gap-2 shadow-xl shadow-primary/20">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 px-10 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold backdrop-blur-sm">
                  <Link href="/exams">Explore Exams</Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[16/10]">
                <Image
                  src="https://picsum.photos/seed/punjab/1200/800"
                  alt="Golden Temple"
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="golden temple"
                />
                <div className="absolute inset-0 bg-secondary/30" />
                <div className="absolute bottom-6 right-6 bg-[#0F172A]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3 shadow-2xl">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tighter leading-none">Punjab Focused</p>
                    <p className="text-[10px] text-white/60 mt-1 uppercase font-bold tracking-widest">100% Real Exam Level</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR EXAMS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black font-headline text-secondary leading-none">Popular Boards</h2>
              <p className="text-muted-foreground mt-3 text-lg">Browse tests by primary Punjab recruitment boards.</p>
            </div>
            <Link href="/exams" className="text-primary font-bold text-sm flex items-center hover:underline group">
              View All Boards <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {boards.map(board => (
              <Link href={`/exams?board=${board.name}`} key={board.name}>
                <div className={`group ${board.bg} p-8 rounded-[2rem] border-b-4 border-transparent hover:border-primary/20 hover:shadow-xl transition-all h-full flex flex-col items-center text-center`}>
                  <div className={`${board.color} mb-6 transform group-hover:scale-110 transition-transform`}>
                    {board.icon}
                  </div>
                  <h3 className="font-headline text-xl font-black text-secondary group-hover:text-primary transition-colors">{board.name}</h3>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">{board.sub}</p>
                  <div className="mt-6 pt-6 border-t border-black/5 w-full flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">15+ Exams</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">50+ Mocks</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LATEST MOCK TESTS SECTION */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black font-headline text-secondary">Latest Mock Tests</h2>
              <p className="text-muted-foreground mt-3 text-lg">Fresh series based on latest 2026-27 exam patterns.</p>
            </div>
            <Link href="/mocks" className="text-primary font-bold text-sm flex items-center hover:underline group">
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <MockHighlightCard title="PSSSB Patwari Mock 01" board="PSSSB" qs={120} mins={120} badge="New" icon={<PsssbIcon />} />
             <MockHighlightCard title="Punjab Police SI Prelims" board="Police" qs={100} mins={120} badge="Trending" icon={<PoliceIcon />} />
             <MockHighlightCard title="PPSC PCS CSAT Set" board="PPSC" qs={80} mins={120} badge="Premium" icon={<PpscIcon />} />
             <MockHighlightCard title="PSTET Paper 1 Assessment" board="PSEB" qs={150} mins={150} badge="New" icon={<TeachingIcon />} />
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-12 bg-secondary border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureItem icon={<CircleCheckBig />} title="Real Exam Pattern" desc="Based Mocks" />
            <FeatureItem icon={<BookOpen />} title="Detailed Solutions" desc="for Every Question" />
            <FeatureItem icon={<ChartColumn />} title="Performance" desc="Analytics" />
            <FeatureItem icon={<Smartphone />} title="Study Anytime" desc="Anywhere" />
          </div>
        </div>
      </section>

      {/* 5. MOBILE APP PREVIEW */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-[#0F172A] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase">
                  <Star className="h-3 w-3 fill-current" />
                  Upcoming Mobile Experience
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white font-headline leading-tight">
                  Your Preparation<br />
                  Now in Your Pocket.
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-md">
                  Experience the fastest test engine in Punjab with our native mobile app. Offline support, daily current affairs notifications, and more.
                </p>
                <div className="flex gap-4">
                   <div className="h-14 w-40 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-white font-bold text-sm">App Store</span>
                   </div>
                   <div className="h-14 w-40 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-white font-bold text-sm">Play Store</span>
                   </div>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end gap-6">
                {/* iPhone Mockups */}
                <div className="relative w-64 h-[520px] rounded-[3rem] border-[8px] border-[#1E293B] shadow-2xl overflow-hidden translate-y-12 shrink-0">
                  <Image src="https://picsum.photos/seed/mobile1/400/800" alt="App Screenshot 1" fill className="object-cover" data-ai-hint="iphone app screen" />
                </div>
                <div className="relative w-64 h-[520px] rounded-[3rem] border-[8px] border-[#1E293B] shadow-2xl overflow-hidden -translate-y-4 shrink-0 hidden sm:block">
                  <Image src="https://picsum.photos/seed/mobile2/400/800" alt="App Screenshot 2" fill className="object-cover" data-ai-hint="mobile app mockup" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-20 border-t bg-white">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <Logo />
            <p className="text-muted-foreground font-medium max-w-sm mt-4">Punjab's #1 Dedicated Platform for State Government Competitive Exams.</p>
          </div>
          <div className="flex justify-center gap-12 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
          <div className="pt-10 border-t border-black/5 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">
            © 2026 CRACKLIX • Punjab Government Exam Preparation Platform
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1 text-white/80">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-black text-white">{value}</span>
      </div>
      <p className="text-[9px] uppercase tracking-[0.1em] text-white/40 font-bold whitespace-nowrap">{label}</p>
    </div>
  )
}

function MockHighlightCard({ title, board, qs, mins, badge, icon }: { title: string, board: string, qs: number, mins: number, badge: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-black/5 hover:border-primary/20 hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-start mb-8">
        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
          {icon}
        </div>
        <div className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/10">
          {badge}
        </div>
      </div>
      <h4 className="text-secondary font-headline font-black text-xl leading-tight group-hover:text-primary transition-colors flex-grow">
        {title}
      </h4>
      <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{qs} Questions</span>
        <span>{mins} Mins</span>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 text-white group">
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform border border-white/10 shadow-lg">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-black uppercase tracking-tighter">{title}</p>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
      </div>
    </div>
  )
}