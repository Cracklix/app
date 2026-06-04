"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  ChevronLeft, 
  Database, 
  ClipboardCheck,
  Search,
  CheckCircle2,
  Layers,
  Loader2,
  Settings2,
  Clock,
  Target,
  Zap,
  Calendar,
  BookOpen,
  Layout,
  Lock,
  Plus,
  Trash2,
  ShieldCheck
} from "lucide-react"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp, query, where } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { cn } from "@/lib/utils"
import { MockType, CAQuizType, MockSection } from "@/types"

export default function MockBuilderPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <MockBuilderContent />
    </Suspense>
  )
}

function MockBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const db = useFirestore()
  const { toast } = useToast()

  const mockId = searchParams.get("id")
  const isEditing = !!mockId

  const { data: existingMock } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  const { data: questionBank } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))

  const [isPublishing, setIsPublishing] = useState(false)
  const [mockData, setMockData] = useState<any>({
    title: "", 
    boardId: "", 
    examId: "", 
    duration: 120, 
    difficulty: "Medium", 
    mockType: "FULL" as MockType, 
    isPremium: false,
    subjectId: "",
    chapterId: "",
    year: new Date().getFullYear(),
    caCategory: "Punjab",
    paperName: "",
    language: "bilingual",
    sections: [] as MockSection[]
  })

  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [bankSearch, setBankSearch] = useState("")

  useEffect(() => {
    if (existingMock) {
      setMockData({ ...existingMock })
    }
  }, [existingMock])

  useEffect(() => {
    if (existingMock && questionBank && existingMock.questionIds) {
      const selected = questionBank.filter((q: any) => existingMock.questionIds.includes(q.id))
      setSelectedQuestions(selected)
    }
  }, [existingMock, questionBank])

  const addSection = () => {
    const newSections = [...(mockData.sections || []), { id: `sec-${Date.now()}`, name: `Section ${(mockData.sections?.length || 0) + 1}`, subjectId: '', questionCount: 0, duration: 30, marksPerQuestion: 1 }]
    setMockData({ ...mockData, sections: newSections })
  }

  const removeSection = (id: string) => {
    setMockData({ ...mockData, sections: (mockData.sections || []).filter((s: any) => s.id !== id) })
  }

  const updateSection = (idx: number, field: keyof MockSection, val: any) => {
     const newSecs = [...mockData.sections];
     newSecs[idx] = { ...newSecs[idx], [field]: val };
     setMockData({...mockData, sections: newSecs});
  }

  const totalQuestions = useMemo(() => {
    if (mockData.mockType !== 'FULL') return selectedQuestions.length
    return (mockData.sections || []).reduce((acc: number, s: any) => acc + (parseInt(s.questionCount) || 0), 0)
  }, [mockData.mockType, mockData.sections, selectedQuestions])

  const totalDuration = useMemo(() => {
    if (mockData.mockType !== 'FULL') return mockData.duration
    return (mockData.sections || []).reduce((acc: number, s: any) => acc + (parseInt(s.duration) || 0), 0)
  }, [mockData.mockType, mockData.sections, mockData.duration])

  const handlePublish = () => {
    if (!mockData.title || !mockData.boardId) {
      toast({ variant: "destructive", title: "Audit Failed", description: "Title and Board are mandatory." })
      return
    }

    setIsPublishing(true)
    const finalId = mockId || `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", finalId)
    const payload = {
      ...mockData,
      id: finalId,
      totalQuestions: totalQuestions,
      duration: totalDuration,
      questionIds: selectedQuestions.map(q => q.id),
      published: true,
      updatedAt: serverTimestamp(),
      createdAt: isEditing ? (existingMock?.createdAt || serverTimestamp()) : serverTimestamp(),
    }

    setDoc(mockRef, payload, { merge: true })
      .then(() => {
        toast({ title: isEditing ? "Series Updated" : "Series Deployed", description: "Test series is now live." })
        router.push("/admin/mocks")
      })
      .catch(async () => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({ path: mockRef.path, operation: 'write' }))
      })
      .finally(() => setIsPublishing(false))
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto text-[#0F172A]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl h-14 w-14 border border-slate-200 bg-white shadow-sm"><ChevronLeft className="h-7 w-7 text-[#0F172A]" /></Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Test Architect</h1>
            <p className="text-slate-500 mt-1 font-medium">Design Full Mocks with multi-section support.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white shadow-sm">Save Draft</Button>
           <Button className="bg-primary hover:bg-primary/90 gap-3 font-black px-12 h-16 shadow-2xl rounded-2xl uppercase tracking-widest text-[10px]" onClick={handlePublish} disabled={isPublishing}>
            <ClipboardCheck className="h-5 w-5" /> {isPublishing ? "Syncing..." : "Publish & Go Live"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
        <div className="lg:col-span-7 space-y-8 text-left">
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 border-b border-slate-50">
               <CardTitle className="text-xl font-headline font-black uppercase flex items-center gap-3"><Settings2 className="h-5 w-5 text-primary" /> Configuration Hub</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Title</Label>
                <Input placeholder="e.g. PSSSB Clerk Full Mock 01" value={mockData.title} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-xl h-14 bg-slate-50 border-none font-bold text-lg text-[#0F172A]" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mock Type</Label>
                    <Select value={mockData.mockType} onValueChange={(v: MockType) => setMockData({...mockData, mockType: v})}>
                       <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="FULL">Entire Exam Pattern (Full Mock)</SelectItem>
                          <SelectItem value="SUBJECT">Subject Mastery</SelectItem>
                          <SelectItem value="SECTIONAL">Sectional / Topic</SelectItem>
                          <SelectItem value="PYQ">Previous Year Paper</SelectItem>
                          <SelectItem value="CA_QUIZ">Current Affairs Quiz</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Difficulty</Label>
                    <Select value={mockData.difficulty} onValueChange={v => setMockData({...mockData, difficulty: v})}>
                       <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              {/* Dynamic Metadata based on Type */}
              <div className="p-6 md:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                 {mockData.mockType === 'FULL' ? (
                    <div className="space-y-8">
                       <div className="flex justify-between items-center">
                          <h4 className="font-headline font-black text-sm uppercase text-[#0F172A] flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Section Builder</h4>
                          <Button variant="ghost" size="sm" onClick={addSection} className="h-8 rounded-lg bg-white border border-slate-200 font-black uppercase text-[9px]"><Plus className="h-3 w-3 mr-1" /> Add Section</Button>
                       </div>
                       <div className="space-y-5">
                          {(mockData.sections || []).map((sec: any, idx: number) => (
                             <div key={sec.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm relative group space-y-4">
                                <Button variant="ghost" size="icon" onClick={() => removeSection(sec.id)} className="absolute top-2 right-2 h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
                                
                                <div className="grid grid-cols-1 gap-4">
                                   <div className="space-y-1.5">
                                      <Label className="text-[10px] font-black uppercase text-slate-500 tracking-tight">Section Name</Label>
                                      <Input value={sec.name} onChange={e => updateSection(idx, 'name', e.target.value)} className="h-9 rounded-xl bg-slate-50 border-none text-xs font-bold text-[#0F172A]" />
                                   </div>
                                   <div className="space-y-1.5">
                                      <Label className="text-[10px] font-black uppercase text-slate-500 tracking-tight">Focus Subject</Label>
                                      <Select value={sec.subjectId} onValueChange={v => updateSection(idx, 'subjectId', v)}>
                                         <SelectTrigger className="h-9 rounded-xl bg-slate-50 border-none text-xs font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                                         <SelectContent>{subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                      </Select>
                                   </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-50">
                                   <div className="space-y-1 text-center">
                                      <Label className="text-[8px] font-black uppercase text-slate-400">QS</Label>
                                      <Input type="number" value={sec.questionCount} onChange={e => updateSection(idx, 'questionCount', e.target.value)} className="h-8 rounded-lg bg-slate-50 border-none text-[10px] font-black text-center text-emerald-600 px-1" />
                                   </div>
                                   <div className="space-y-1 text-center">
                                      <Label className="text-[8px] font-black uppercase text-slate-400">MINS</Label>
                                      <Input type="number" value={sec.duration} onChange={e => updateSection(idx, 'duration', e.target.value)} className="h-8 rounded-lg bg-slate-50 border-none text-[10px] font-black text-center text-primary px-1" />
                                   </div>
                                   <div className="space-y-1 text-center">
                                      <Label className="text-[8px] font-black uppercase text-slate-400">MARKS</Label>
                                      <Input type="number" value={sec.marksPerQuestion} onChange={e => updateSection(idx, 'marksPerQuestion', e.target.value)} className="h-8 rounded-lg bg-slate-50 border-none text-[10px] font-black text-center text-blue-600 px-1" />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-slate-500">Target Subject</Label>
                          <Select value={mockData.subjectId} onValueChange={v => setMockData({...mockData, subjectId: v})}>
                             <SelectTrigger className="rounded-xl h-12 bg-white border-none font-bold text-[#0F172A]"><SelectValue /></SelectTrigger>
                             <SelectContent>{subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                          </Select>
                       </div>
                       {mockData.mockType === 'SECTIONAL' ? (
                          <div className="space-y-3">
                             <Label className="text-[10px] font-black uppercase text-slate-500">Topic / Chapter</Label>
                             <Input value={mockData.chapterId} onChange={e => setMockData({...mockData, chapterId: e.target.value})} className="rounded-xl h-12 bg-white border-none font-bold text-[#0F172A]" />
                          </div>
                       ) : mockData.mockType === 'PYQ' ? (
                          <div className="space-y-3">
                             <Label className="text-[10px] font-black uppercase text-slate-500">Exam Year</Label>
                             <Input type="number" value={mockData.year} onChange={e => setMockData({...mockData, year: parseInt(e.target.value) || 2025})} className="rounded-xl h-12 bg-white border-none font-bold text-[#0F172A]" />
                          </div>
                       ) : (
                          <div className="space-y-3">
                             <Label className="text-[10px] font-black uppercase text-slate-500">CA Category</Label>
                             <Select value={mockData.caCategory} onValueChange={v => setMockData({...mockData, caCategory: v})}>
                                <SelectTrigger className="rounded-xl h-12 bg-white border-none font-bold text-[#0F172A]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="Punjab">Punjab Focus</SelectItem>
                                   <SelectItem value="National">National</SelectItem>
                                   <SelectItem value="International">International</SelectItem>
                                   <SelectItem value="Economy">Economy</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       )}
                    </div>
                 )}
                 
                 <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-slate-200">
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Manual Duration (Mins)</Label>
                       <Input disabled={mockData.mockType === 'FULL'} type="number" value={totalDuration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value) || 0})} className="rounded-xl h-12 bg-white border-none font-black text-lg text-[#0F172A] disabled:bg-slate-100 shadow-inner" />
                    </div>
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Negative Marking</Label>
                       <Input type="number" step="0.25" value={mockData.negativeMarking} onChange={e => setMockData({...mockData, negativeMarking: parseFloat(e.target.value) || 0})} className="rounded-xl h-12 bg-white border-none font-black text-lg text-rose-500 shadow-inner" />
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <Card className="border-none shadow-2xl bg-[#0F172A] text-white p-10 rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Layout className="h-32 w-32 rotate-12" /></div>
              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Summary Audit</p>
                    <h3 className="text-3xl font-headline font-black uppercase">Series Breakdown</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total MCQs</p>
                       <p className="text-4xl font-headline font-black text-primary mt-1">{totalQuestions}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Time Limit</p>
                       <p className="text-4xl font-headline font-black text-white mt-1">{totalDuration}m</p>
                    </div>
                 </div>
                 <div className="p-8 bg-primary/10 rounded-[2rem] border border-primary/20 flex items-center gap-6">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary">Institutional Access</p>
                       <p className="text-sm font-medium text-slate-300 text-left leading-relaxed">This series is set to <strong>Premium</strong> and requires a Gold Pass to attempt.</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Linked Nodes ({selectedQuestions.length})</h3>
              <div className="max-h-[500px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                 {selectedQuestions.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-30">
                       <Database className="h-12 w-12 mx-auto mb-4" />
                       <p className="font-bold text-sm uppercase">No Questions Linked</p>
                    </div>
                 ) : selectedQuestions.map((q, i) => (
                    <div key={q.id} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all shadow-sm">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-300">#{i + 1}</span>
                          <p className="font-bold text-[#0F172A] text-sm line-clamp-1">{q.questionEn}</p>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => setSelectedQuestions(selectedQuestions.filter(sq => sq.id !== q.id))} className="h-9 w-9 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
