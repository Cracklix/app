import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, Target, BarChart3, Users, Star, CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { EXAMS } from "@/lib/mock-data"
import Logo from "@/components/brand/Logo"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-32 px-6 hero-gradient overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-secondary/5 text-secondary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-secondary/10">
                <ShieldCheck className="h-3 w-3" />
                Punjab's Most Trusted Learning System
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-headline leading-[1.1] text-primary">
                Prepare Smarter.<br />
                <span className="text-secondary">Score Higher.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Prepare for PSSSB, PPSC, Punjab Police, PSTET, PSPCL and more with structured mocks, real exam analytics, and proven results.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-10 bg-secondary hover:bg-secondary/90 text-white font-black rounded-xl gap-2 shadow-xl shadow-blue-200">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 px-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold">
                  <Link href="/exams">Explore Exams</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 50,000+ Questions</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 1000+ Mocks</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 8+ Boards</div>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 dashboard-preview-glow space-y-10">
                <div className="flex justify-between items-center border-b pb-6">
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Attempt</p>
                     <h3 className="text-lg font-black text-primary">Punjab Police SI Mock #04</h3>
                   </div>
                   <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                     <BarChart3 className="h-6 w-6" />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <DashboardStat label="Score" value="72/100" />
                  <DashboardStat label="Rank" value="128/4500" />
                  <DashboardStat label="Accuracy" value="81%" />
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Weekly Progress</span>
                     <span className="text-xs font-black text-green-500 flex items-center gap-1">
                       <TrendingUp className="h-3 w-3" /> +340 Rank improved
                     </span>
                   </div>
                   <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-secondary w-3/4" />
                   </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-primary bg-accent/10 px-4 py-3 rounded-xl">
                   <Target className="h-4 w-4 text-accent" />
                   Focus Areas: Medieval Punjab History, Syllogism
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="py-10 bg-primary">
        <div className="container mx-auto px-6">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-8">
            Trusted by Punjab Aspirants Preparing for Government Jobs
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-white/70 text-xs font-bold uppercase tracking-widest">
            <span>PSSSB</span>
            <span>PPSC</span>
            <span>Punjab Police</span>
            <span>PSTET</span>
            <span>PSPCL</span>
            <span>High Court</span>
            <span>BFUHS</span>
            <span>Cooperative Bank</span>
          </div>
        </div>
      </section>

      {/* 3. POPULAR EXAMS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-black font-headline text-primary">Popular Government Exams</h2>
              <p className="text-gray-500 mt-2 font-medium">Structured preparation for Punjab's biggest recruitments.</p>
            </div>
            <Link href="/exams" className="text-secondary font-black text-sm flex items-center hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXAMS.slice(0, 6).map(exam => (
              <div key={exam.id} className="bg-white border border-gray-100 rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="text-[10px] font-black text-secondary bg-secondary/5 px-3 py-1 rounded-full border border-secondary/10 uppercase tracking-widest">
                     {exam.category}
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exam.totalMocks} Mocks</span>
                 </div>
                 <h3 className="text-xl font-black text-primary mb-4 group-hover:text-secondary transition-colors">{exam.title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-8">{exam.description}</p>
                 <Button asChild variant="ghost" className="w-full justify-between p-0 hover:bg-transparent text-secondary font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                   <Link href={`/exams/${exam.id}`}>
                     Start Preparation <ArrowRight className="h-4 w-4" />
                   </Link>
                 </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CRACKLIX */}
      <section className="py-24 bg-[#F8FAFC] border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black font-headline text-primary">Built for Serious Aspirants</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">Not casual learners. We focus on real patterns, structured discipline, and measurable results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <WhyItem 
              icon={<Target className="text-secondary" />} 
              title="Exam-Focused Content" 
              desc="Every question is verified and aligned with actual government exam patterns and latest syllabus updates." 
            />
            <WhyItem 
              icon={<BarChart3 className="text-secondary" />} 
              title="Real Performance Analytics" 
              desc="Track your rank among thousands of real aspirants. Identify specific subject weaknesses instantly." 
            />
            <WhyItem 
              icon={<Users className="text-secondary" />} 
              title="Structured Learning Path" 
              desc="Designed to take you from basics to sectional mastery, finishing with full-length timed exam simulations." 
            />
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black font-headline text-primary">Simple, Result-Oriented Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <PricingCard 
                title="Free Explorer" 
                price="₹0" 
                features={["Limited Mock Tests", "Basic Analytics", "Daily Current Affairs"]} 
                cta="Start Free Mock"
             />
             <PricingCard 
                title="Cracklix Pro" 
                price="₹499" 
                isFeatured
                features={["Unlimited Mock Tests", "Full Subject Analytics", "Previous Year Papers", "Rank Prediction", "24/7 Support"]} 
                cta="Get Pro Access"
             />
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 text-center text-white space-y-10">
          <h2 className="text-4xl md:text-5xl font-black font-headline">Start Your Government Job Preparation Today</h2>
          <p className="text-white/70 max-w-xl mx-auto font-medium">No gaming. No distractions. Join 15,000+ serious aspirants on Punjab's most structured preparation platform.</p>
          <Button asChild size="lg" className="h-16 px-12 bg-white text-secondary hover:bg-gray-50 font-black rounded-xl text-lg gap-3">
             <Link href="/mocks">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-16 border-t bg-white">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center">
            <Logo variant="dark" />
          </div>
          <div className="flex justify-center gap-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
          <div className="pt-12 border-t border-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 CRACKLIX • Punjab Government Exam Preparation Platform
          </div>
        </div>
      </footer>
    </div>
  )
}

function DashboardStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-primary tracking-tight">{value}</p>
    </div>
  )
}

function WhyItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
      <div className="h-14 w-14 bg-secondary/5 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-2xl font-black font-headline text-primary">{title}</h4>
      <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

function PricingCard({ title, price, features, cta, isFeatured }: { title: string, price: string, features: string[], cta: string, isFeatured?: boolean }) {
  return (
    <div className={`p-10 rounded-[2.5rem] border ${isFeatured ? 'bg-primary text-white border-primary shadow-2xl' : 'bg-white text-primary border-gray-100'}`}>
       <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 opacity-70">{title}</h3>
       <div className="text-5xl font-black font-headline mb-10">{price}<span className="text-lg opacity-40">/year</span></div>
       <ul className="space-y-4 mb-12">
         {features.map(f => (
           <li key={f} className="flex items-center gap-3 text-sm font-bold">
             <CheckCircle2 className={`h-4 w-4 ${isFeatured ? 'text-accent' : 'text-secondary'}`} />
             {f}
           </li>
         ))}
       </ul>
       <Button className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest ${isFeatured ? 'bg-secondary text-white hover:bg-secondary/90' : 'bg-gray-100 text-primary hover:bg-gray-200'}`}>
         {cta}
       </Button>
    </div>
  )
}
