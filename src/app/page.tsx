import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Shield, Zap, BookOpen, Trophy, CheckCircle2, Star, Users, ArrowRight, Smartphone } from "lucide-react"
import Link from "next/link"
import ExamCard from "@/components/exams/ExamCard"
import { EXAMS } from "@/lib/mock-data"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-punjab")

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden hero-gradient">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-full text-sm font-bold animate-fade-in">
                <Shield className="h-4 w-4" />
                Punjab's Most Trusted Platform
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-headline leading-[0.9] text-foreground">
                Prepare <span className="text-secondary italic">Smarter.</span><br />
                Score <span className="text-primary italic">Higher.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Punjab Government Exams di complete preparation ik hi platform te. Get high-quality mocks based on real patterns.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-lg h-14 px-10 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                  <Link href="/mocks/mock-punjab-1">Start Free Mock <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg h-14 px-10 border-foreground/10 hover:bg-foreground/5 font-bold">
                  Explore Exams
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                <HeroStat value="10,000+" label="Practice Qs" />
                <HeroStat value="500+" label="Mock Tests" />
                <HeroStat value="50+" label="Exams Covered" />
                <HeroStat value="Real-time" label="Analytics" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 blur-[120px] rounded-full -z-10" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3]">
                <Image
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/punjab/800/600"}
                  alt="Golden Temple"
                  fill
                  className="object-cover opacity-80"
                  data-ai-hint="golden temple"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary fill-current" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Targeting PSSSB Patwari?</p>
                      <p className="text-sm text-muted-foreground">New full length mocks are live now!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Exams Grid */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black font-headline">Popular Exams</h2>
              <p className="text-muted-foreground text-lg">Pick your goal and start preparing today.</p>
            </div>
            <Button variant="link" className="text-primary font-bold text-lg group">
              View All Exams <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXAMS.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </section>

      {/* Features - Why Cracklix */}
      <section className="py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-headline">Why Cracklix?</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Designed specifically for Punjab's competitive landscape.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Punjab Focused"
              description="Dedicated content for PSSSB, PPSC, Punjab Police and more."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-secondary" />}
              title="Fast Mock Experience"
              description="Instant starts, real exam simulation, and zero lag interface."
            />
            <FeatureCard 
              icon={<Trophy className="h-8 w-8 text-primary" />}
              title="Detailed Analytics"
              description="Track your rank, percentile, and subject-wise accuracy."
            />
            <FeatureCard 
              icon={<BookOpen className="h-8 w-8 text-secondary" />}
              title="PYQ Based Practice"
              description="Thousands of previous year questions with logical solutions."
            />
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-24 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-black font-headline">Crack Exams on the Go!</h2>
              <p className="text-white/80 text-xl leading-relaxed">
                Download the Cracklix mobile app for a seamless preparation experience. Practice anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90 h-16 px-8 rounded-2xl font-black gap-3">
                  <Smartphone className="h-6 w-6" /> App Store
                </Button>
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 h-16 px-8 rounded-2xl font-black gap-3">
                   Play Store
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="h-[600px] w-[300px] bg-card rounded-[3rem] border-8 border-white/10 overflow-hidden shadow-2xl relative">
                 <div className="absolute inset-0 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="h-32 w-full bg-secondary/20 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-2">
                       <div className="h-20 bg-muted rounded-xl" />
                       <div className="h-20 bg-muted rounded-xl" />
                       <div className="h-20 bg-muted rounded-xl" />
                       <div className="h-20 bg-muted rounded-xl" />
                    </div>
                    <div className="h-40 w-full bg-primary/5 rounded-2xl border border-primary/10" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t bg-card/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-headline text-3xl font-black uppercase">
                  CRACK<span className="text-primary">LIX</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-lg max-w-sm">
                Punjab's smartest platform for government exam preparation. Trusted by thousands of successful aspirants.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase tracking-widest text-sm">Platform</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="/exams" className="hover:text-primary transition-colors">Exams Catalog</Link></li>
                <li><Link href="/mocks" className="hover:text-primary transition-colors">Free Mock Tests</Link></li>
                <li><Link href="/pyqs" className="hover:text-primary transition-colors">Previous Year Papers</Link></li>
                <li><Link href="/results" className="hover:text-primary transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm font-bold">
            <p>© 2026 CRACKLIX. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Twitter</Link>
              <Link href="#" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Instagram</Link>
              <Link href="#" className="hover:text-primary transition-colors underline-offset-4 hover:underline">YouTube</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroStat({ value, label }: { value: string, label: string }) {
  return (
    <div className="bg-card/40 backdrop-blur-sm border border-foreground/5 p-4 rounded-2xl">
      <p className="text-2xl font-black font-headline text-secondary leading-none mb-1">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border bg-card/40 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all group">
      <div className="mb-6 p-4 bg-background rounded-2xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-black font-headline mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
