
"use client"

import { useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Trophy, 
  Target, 
  ClipboardList, 
  ShieldCheck,
  ChevronRight,
  Zap,
  Clock
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch user performance stats
  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(
      collection(db, "results"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
  }, [db, user])

  const { data: results, loading: resultsLoading } = useCollection<any>(resultsQuery)

  const stats = useMemo(() => {
    if (!results) return { total: 0, avgAccuracy: 0, bestScore: 0 }
    const total = results.length
    const avgAccuracy = total > 0 ? Math.round(results.reduce((acc: number, curr: any) => acc + (curr.accuracy || 0), 0) / total) : 0
    const bestScore = total > 0 ? Math.max(...results.map((r: any) => r.score || 0)) : 0
    return { total, avgAccuracy, bestScore }
  }, [results])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <Skeleton className="h-64 w-full rounded-[3rem]" />
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Profile Hero */}
        <section className="relative mb-12">
          <div className="h-48 w-full bg-[#08152D] rounded-t-[3rem] overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-4 right-8 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cracklix Trust Member</span>
            </div>
          </div>

          <div className="px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
              <Avatar className="h-36 w-36 border-8 border-white shadow-2xl rounded-[2.5rem]">
                <AvatarImage src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`} />
                <AvatarFallback className="bg-slate-100 text-slate-400 text-3xl font-black">
                  {profile.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 h-8 w-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-headline font-black text-[#0F172A] tracking-tight">{profile.name}</h1>
                <Badge className={profile.status === 'Pro' ? "bg-primary text-white border-none px-4 py-1 rounded-xl font-black uppercase text-[10px]" : "bg-slate-200 text-slate-500 border-none px-4 py-1 rounded-xl font-black uppercase text-[10px]"}>
                  {profile.status} Aspirant
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                <span className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" /> {profile.email}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" /> Targeting {profile.targetExam || "All Punjab Boards"}
                </span>
              </div>
            </div>

            <div className="pb-4">
               <Button className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-2xl h-12 px-8 shadow-xl shadow-slate-200">
                 Edit My Profile
               </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stats & Information */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard 
                icon={<ClipboardList className="text-blue-500" />} 
                label="Mocks Attempted" 
                value={stats.total} 
                trend="Past 30 days"
              />
              <StatCard 
                icon={<Target className="text-[#F97316]" />} 
                label="Avg. Accuracy" 
                value={`${stats.avgAccuracy}%`} 
                trend="Institutional avg: 62%"
              />
              <StatCard 
                icon={<Trophy className="text-emerald-500" />} 
                label="Top Score" 
                value={stats.bestScore} 
                trend="Sectional high"
              />
            </div>

            {/* Performance History Snippet */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-headline font-black text-[#0F172A]">Recent Preparation History</CardTitle>
                      <CardDescription>Track your high-fidelity mock results.</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-widest gap-2">
                       View All Results <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {resultsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                    ) : results && results.length > 0 ? (
                      results.slice(0, 5).map((r: any) => (
                        <div key={r.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                           <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                 <Zap className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-800 text-sm">{r.mockTitle}</p>
                                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                   <Calendar className="h-3 w-3" /> {new Date(r.timestamp).toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-[#0F172A]">{r.score}/{r.totalQuestions}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${r.accuracy > 70 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                {r.accuracy}% Accuracy
                              </p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-400">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="font-bold">No test attempts recorded yet.</p>
                        <Button asChild variant="link" className="text-primary font-bold mt-2">
                          <a href="/mocks">Browse Mock Series</a>
                        </Button>
                      </div>
                    )}
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Account Details */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 space-y-8">
               <div className="space-y-6">
                 <h3 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-slate-400">Account Verified Information</h3>
                 
                 <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone Number" value={profile.phone} />
                 <InfoItem icon={<MapPin className="h-4 w-4" />} label="State Residency" value={profile.state} />
                 <InfoItem icon={<Calendar className="h-4 w-4" />} label="Joined Platform" value={new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} />
                 <InfoItem icon={<ShieldCheck className="h-4 w-4" />} label="Membership" value={`${profile.status} Portal Access`} />
               </div>

               <div className="pt-8 border-t border-slate-50 space-y-4">
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Target Achievement</p>
                     <p className="text-sm font-bold text-slate-700 leading-snug">Prepare for {profile.targetExam} 2026 notifications.</p>
                     <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[35%]" />
                     </div>
                     <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Preparation Progress: 35%</p>
                  </div>
               </div>
            </Card>

            <Card className="border-none bg-[#0B1528] text-white shadow-2xl rounded-[2.5rem] p-8 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-20 w-20" />
               </div>
               <div className="relative z-10 space-y-4">
                  <Badge className="bg-primary text-white border-none uppercase text-[9px] font-black px-3">Upgrade to Pro</Badge>
                  <h4 className="text-xl font-headline font-black">Unlock Elite Series</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Get access to 500+ premium mocks, AI rationalizations, and daily live analysis by Arsh Grewal.</p>
                  <Button className="w-full bg-white text-[#0B1528] hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl mt-4">
                    Explore Premium
                  </Button>
               </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] p-6 hover:translate-y-[-4px] transition-all duration-300 group">
       <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
             {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
       </div>
       <p className="text-3xl font-headline font-black text-[#0F172A] mb-1">{value}</p>
       <p className="text-[9px] font-bold text-slate-400 uppercase">{trend}</p>
    </Card>
  )
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
