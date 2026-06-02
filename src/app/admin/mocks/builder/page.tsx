
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChevronLeft, 
  Database, 
  Zap,
  Sparkles,
  Settings,
  Filter,
  Layers,
  ClipboardCheck,
  Search
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

/**
 * @fileOverview Phase 18: Smart Mock Generation Portal.
 * Allows Admins to build test series by defining subject-weighting blueprints.
 */

export default function MockBuilderPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()

  // --- Data Fetching ---
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: questionBank } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  // --- State ---
  const [isPublishing, setIsPublishing] = useState(false)
  const [mockData, setMockData] = useState({
    title: "", boardId: "", examId: "", duration: 120, difficulty: "Medium", mockType: "FULL" as any
  })

  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [bankSearch, setBankSearch] = useState("")

  const [smartConfig, setSmartConfig] = useState({ 
    count: 100, 
    difficulty: "all",
    subjectId: "all"
  })

  // --- Handlers ---
  const handleAutoPick = () => {
    if (!questionBank || questionBank.length === 0) {
      toast({ variant: "destructive", title: "Bank Empty", description: "No questions available in the repository." })
      return
    }

    let pool = [...questionBank]
    
    // Apply blueprints
    if (smartConfig.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === smartConfig.difficulty)
    }
    if (smartConfig.subjectId !== 'all') {
      pool = pool.filter(q => q.subjectId === smartConfig.subjectId)
    }

    if (pool.length < smartConfig.count) {
      toast({ 
        variant: "destructive", 
        title: "Blueprint Error", 
        description: `Only ${pool.length} MCQs match this filter. Target: ${smartConfig.count}` 
      })
      return
    }

    // High-fidelity shuffling
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, smartConfig.count)
    setSelectedQuestions(selected)
    
    toast({ 
      title: "Assembly Complete", 
      description: `Structured ${selected.length} verified questions automatically.` 
    })
  }

  const handleAddFromBank = (q: any) => {
    if (selectedQuestions.find(item => item.id === q.id)) {
      toast({ title: "Audit Alert", description: "Question already linked." })
      return
    }
    setSelectedQuestions([...selectedQuestions, q])
  }

  const handleRemoveQuestion = (id: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== id))
  }

  const handlePublish = () => {
    if (!mockData.title || !mockData.examId || selectedQuestions.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Audit Failed", 
        description: "Title, Hub and at least 1 MCQ required." 
      })
      return
    }

    setIsPublishing(true)
    const mockId = `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", mockId)
    const payload = {
      ...mockData,
      id: mockId,
      totalQuestions: selectedQuestions.length,
      questionIds: selectedQuestions.map(q => q.id),
      published: true,
      createdAt: serverTimestamp(),
      author: "Arsh Grewal Audit"
    }

    setDoc(mockRef, payload)
      .then(() => {
        toast({ title: "Series Deployed", description: "Test series is now live on the student portal." })
        router.push("/admin/mocks")
      })
      .catch(async () => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({ 
          path: mockRef.path, 
          operation: 'create', 
          requestResourceData: payload 
        }))
      })
      .finally(() => setIsPublishing(false))
  }

  const filteredBank = useMemo(() => {
    if (!questionBank) return []
    return questionBank.filter(q => 
      (q.questionEn || "").toLowerCase().includes(bankSearch.toLowerCase()) || 
      (q.id || "").includes(bankSearch)
    )
  }, [bankSearch, questionBank])

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl h-14 w-14 border border-foreground/5 bg-card/30">
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Layers className="h-5 w-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scale Operations</span>
            </div>
            <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Smart Builder</h1>
          </div>
        </div>
        <div className="flex gap-4">
           <Button className="bg-primary hover:bg-primary/90 gap-3 font-black px-12 h-16 shadow-3xl rounded-[1.5rem]" onClick={handlePublish} disabled={isPublishing}>
            <ClipboardCheck className="h-5 w-5" /> {isPublishing ? "Deploying..." : "Publish Series"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10">
               <CardTitle className="text-2xl font-headline font-black uppercase text-slate-100">Audit Profile</CardTitle>
               <CardDescription>Target hub and series metadata.</CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Series Title</Label>
                <Input placeholder="e.g. PSSSB Clerk Full Mock 01" value={mockData.title} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-2xl h-14 bg-background border-none shadow-inner" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Authority</Label>
                  <Select onValueChange={val => setMockData({...mockData, boardId: val})}>
                    <SelectTrigger className="rounded-2xl h-14 bg-background border-none"><SelectValue placeholder="Select Board" /></SelectTrigger>
                    <SelectContent>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Exam Hub</Label>
                  <Select onValueChange={val => setMockData({...mockData, examId: val})}>
                    <SelectTrigger className="rounded-2xl h-14 bg-background border-none"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                    <SelectContent>{exams?.filter(e => e.boardId === mockData.boardId).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Time (Min)</Label>
                  <Input type="number" value={mockData.duration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value)})} className="rounded-2xl h-14 bg-background border-none text-center font-black" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Type</Label>
                  <Select onValueChange={val => setMockData({...mockData, mockType: val as any})} defaultValue="FULL">
                    <SelectTrigger className="rounded-2xl h-14 bg-background border-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Full Length</SelectItem>
                      <SelectItem value="SUBJECT">Subject Wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-primary/5 rounded-[3rem] p-12 space-y-6 text-center">
             <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-2xl">
                <Database className="h-10 w-10" />
             </div>
             <div>
                <p className="text-6xl font-black font-headline leading-none text-slate-100">{selectedQuestions.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-4">Linked Statements</p>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-8">
           <Tabs defaultValue="smart" className="space-y-10">
              <TabsList className="bg-slate-100/50 rounded-[2rem] p-1.5 h-20 w-fit">
                 <TabsTrigger value="smart" className="rounded-[1.5rem] h-full px-12 font-black uppercase text-[10px] gap-3 text-primary data-[state=active]:bg-white shadow-sm transition-all"><Sparkles className="h-5 w-5" /> Smart Assembler</TabsTrigger>
                 <TabsTrigger value="manual" className="rounded-[1.5rem] h-full px-12 font-black uppercase text-[10px] gap-3 data-[state=active]:bg-white transition-all"><Database className="h-5 w-5" /> Manual Library</TabsTrigger>
              </TabsList>

              <TabsContent value="smart" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <Card className="border-none shadow-3xl rounded-[4rem] bg-white p-20 text-center space-y-12">
                    <div className="max-w-md mx-auto space-y-10">
                       <div className="h-28 w-28 bg-primary/10 rounded-[3rem] flex items-center justify-center mx-auto text-primary shadow-3xl">
                          <Zap className="h-14 w-14" />
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-4xl font-headline font-black text-slate-800 uppercase leading-none">Smart Extraction</h3>
                          <p className="text-slate-500 font-medium text-lg">Instant assembly based on verified repository blueprints.</p>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-8 text-left">
                          <div className="space-y-4">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Blueprint</Label>
                             <Select onValueChange={val => setSmartConfig({...smartConfig, subjectId: val})} defaultValue="all">
                                <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none shadow-inner"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="all">Across All Segments</SelectItem>
                                   {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                             </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">MCQ Quantity</Label>
                                <Input type="number" value={smartConfig.count} onChange={e => setSmartConfig({...smartConfig, count: parseInt(e.target.value)})} className="h-16 rounded-2xl bg-slate-50 border-none shadow-inner text-2xl font-black text-center" />
                             </div>
                             <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</Label>
                                <Select onValueChange={val => setSmartConfig({...smartConfig, difficulty: val})} defaultValue="all">
                                   <SelectTrigger className="h-16 rounded-2xl bg-slate-50 border-none shadow-inner"><SelectValue /></SelectTrigger>
                                   <SelectContent><SelectItem value="all">Mixed</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
                                </Select>
                             </div>
                          </div>
                       </div>

                       <Button onClick={handleAutoPick} className="w-full h-20 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] text-sm rounded-[2rem] gap-4 shadow-3xl group transition-all">
                          <Zap className="h-6 w-6 text-primary group-hover:scale-125" /> Build Series Blueprint
                       </Button>
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="manual" className="space-y-8 animate-in fade-in duration-500">
                 <div className="flex flex-col md:flex-row items-center justify-between bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 gap-8">
                    <div className="relative w-full max-w-lg">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                       <Input className="pl-16 h-16 rounded-[1.5rem] bg-slate-50 border-none shadow-inner text-lg" placeholder="Search Global Bank..." value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-5 max-h-[700px] overflow-y-auto pr-6">
                    {filteredBank.slice(0, 50).map(q => {
                      const isAdded = selectedQuestions.find(s => s.id === q.id)
                      return (
                        <div key={q.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white flex items-center justify-between group hover:border-primary transition-all shadow-sm">
                           <div className="space-y-3 flex-1 pr-12">
                              <p className="font-bold text-lg text-slate-700 line-clamp-1 leading-snug">{q.questionEn}</p>
                              <div className="flex gap-4">
                                 <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-100 text-slate-400">{q.subjectId || 'GK'}</Badge>
                                 <Badge className="text-[10px] font-black uppercase bg-orange-50 text-orange-500 border-none">{q.difficulty}</Badge>
                              </div>
                           </div>
                           <Button 
                            onClick={() => isAdded ? handleRemoveQuestion(q.id) : handleAddFromBank(q)} 
                            className={`rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-[0.2em] ${isAdded ? 'bg-emerald-500 text-white' : 'bg-[#0F172A] text-white'}`}
                           >
                             {isAdded ? 'Linked' : 'Add Statement'}
                           </Button>
                        </div>
                      )
                    })}
                 </div>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}
