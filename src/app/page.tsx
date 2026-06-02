import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Shield, Zap, BookOpen, Trophy, ArrowRight, Smartphone, CircleCheckBig, Headphones, BarChart3, Clock, Target, ClipboardCheck, BookOpenText, ChartColumn } from "lucide-react"
import Link from "next/link"
import ExamCard from "@/components/exams/ExamCard"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Badge } from "@/components/ui/badge"
import { PsssbIcon, PoliceIcon, TeachingIcon, PpscIcon } from "@/lib/exam-icons"

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-punjab")

  const latestMocks = [
    { title: "PSSSB CLERK Full Length Mock 01", icon: <PsssbIcon />, questions: 100, time: 120, badge: "New" },
    { title: "PUNJAB POLICE SI Mock Test 02", icon: <PoliceIcon />, questions: 100, time: 120, badge: "New" },
    { title: "PSTET PAPER 1 Assessment 01", icon: <TeachingIcon />, questions: 150, time: 150, badge: "New" },
    { title: "PPSC PCS Full Length Mock 01", icon: <PpscIcon />, questions: 100, time: 120, badge: "New" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden hero-gradient">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
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
                <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-xl gap-2">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold">
                  Explore Exams
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[16/10]">
                <Image
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/punjab/1200/800"}
                  alt="Golden Temple"
                  fill
                  className="object-cover"
                  data-ai-hint="golden temple"
                />
                <div className="absolute inset-0 bg-secondary/30" />
                <div className="absolute bottom-6 right-6 bg-[#0F172A]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tighter">Punjab Focused</p>
                    <p className="text-[10px] text-white/60">100% Real Exam Level</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none text-white">
                 <svg viewBox="0 0 100 100" className="h-64 w-64"><path d="M50 5 L70 15 L85 40 L80 70 L50 95 L20 70 L15 40 L30 15 Z" fill="currentColor" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Exams Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black font-headline text-secondary">Popular Exams</h2>
            <Link href="/exams" className="text-primary font-bold text-sm flex items-center hover:underline">
              View All Exams <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXAMS.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Mock Tests */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black font-headline text-secondary">Latest Mock Tests</h2>
            <Link href="/mocks" className="text-primary font-bold text-sm flex items-center hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestMocks.map((mock, i) => (
              <MockCard key={i} {...mock} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-secondary border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem icon={<CircleCheckBig />} title="Real Exam Pattern" desc="Based Mocks" />
            <FeatureItem icon={<BookOpen />} title="Detailed Solutions" desc="for Every Question" />
            <FeatureItem icon={<ChartColumn />} title="Performance" desc="Analytics" />
            <FeatureItem icon={<Smartphone />} title="Study Anytime" desc="Anywhere" />
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center">
            <span className="font-headline text-2xl font-black uppercase text-secondary">
              CRACK<span className="text-primary">LIX</span>
            </span>
          </div>
          <div className="flex justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/contact" className="hover:text-primary">Contact Us</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms & Conditions</Link>
          </div>
          <div className="pt-8 border-t text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 CRACKLIX • Punjab Government Exam Preparation Platform
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1 text-white/60">
        {icon}
        <span className="text-xs font-black text-white">{value}</span>
      </div>
      <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold whitespace-nowrap">{label}</p>
    </div>
  )
}

function MockCard({ title, icon, questions, time, badge }: { title: string, icon: React.ReactNode, questions: number, time: number, badge: string }) {
  return (
    <div className="bg-[#0F172A] p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] font-black uppercase tracking-widest">{badge}</Badge>
      </div>
      <h4 className="text-white font-headline font-bold text-lg mb-4 leading-tight group-hover:text-primary transition-colors h-12 overflow-hidden">
        {title}
      </h4>
      <div className="flex items-center gap-4 text-white/50 text-[10px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {questions} Qs</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {time} Min</span>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 text-white group">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-black uppercase tracking-tighter">{title}</p>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{desc}</p>
      </div>
    </div>
  )
}
