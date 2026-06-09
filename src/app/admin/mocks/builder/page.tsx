"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  ChevronLeft, 
  Database, 
  ClipboardCheck,
  Search,
  Layers,
  Loader2,
  Plus,
  Trash2,
  Zap,
  Clock,
  Lock,
  Target,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  GraduationCap,
  Languages,
  BookOpen,
  X,
  Globe,
  LayoutGrid,
  Tags,
  SearchCode,
  Box,
  Check,
  FileWarning
} from "lucide-react"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp, query, limit, getDocs, writeBatch, where, documentId, orderBy, deleteDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { MockType, Difficulty, AccessLevel, LanguageDisplayMode, MockAssignmentMode } from "@/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/**
 * @fileOverview Institutional Mock Architect v26.0 (High-Fidelity Update).
 * MATCHED: Left-side white selection cards and dark-themed Global Bank Hub.
 */

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

  // --- DATA LISTENERS ---
  const { data: existingMock } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: categories } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? query(collection(db, "boards"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: rawExams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? query(collection(db, "subjects"), orderBy("name", "asc")) : null), [db]))
  
  // --- STATE HUB ---
  const [bankLoading, setBankLoading] = useState(false)
  const [questionBank, setQuestionBank] = useState<any[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  
  // Question Bank Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBoard, setFilterBoard] = useState("all")
  const [filterExam, setFilterExam] = useState("all")
  const [filterSubject, setFilterSubject] = useState("all")
  const [hideUsed, setHideUsed] = useState(true)
  const [blockDuplicates, setBlockDuplicates] = useState(true)
  const [bankSelection, setBankSelection] = useState<string[]>([])
  
  // Subject Picker State
  const [subjectSearch, setSubjectSearch] = useState("")

  // Mock Metadata & Architecture
  const [mockData, setMockData] = useState<any>({
    title: "", 
    assignmentMode: "SINGLE" as MockAssignmentMode,
    targetCategoryId: "",
    boardIds: [] as string[],
    examIds: [] as string[],
    mockType: "FULL" as MockType, 
    duration: 120, 
    difficulty: "Medium" as Difficulty, 
    accessLevel: "FREE" as AccessLevel,
    published: true,
    languageMode: "ENGLISH_PUNJABI" as LanguageDisplayMode,
    positiveMarks: 1,
    negativeMarks: 0.25,
    attemptLimit: 0,
  })

  // Assembly State
  const [sections, setSections] = useState<any[]>([
    { id: 'sec-1', name: 'General Hub', questions: [] }
  ])
  const [activeSectionId, setActiveSectionId] = useState('sec-1')

  // --- DATA SYNC ---
  const fetchBank = async () => {
    if (!db) return
    setBankLoading(true)
    try {
      const q = query(collection(db, "questions"), limit(1000))
      const snap = await getDocs(q)
      setQuestionBank(snap.docs.map(d => ({ ...d.data(), id: d.id })))
    } finally {
      setBankLoading(false)
    }
  }

  useEffect(() => {
    fetchBank()
  }, [db])

  useEffect(() => {
    if (existingMock && questionBank.length > 0) {
      setMockData({ 
        ...existingMock,
        assignmentMode: existingMock.assignmentMode || "SINGLE",
        boardIds: existingMock.boardIds || (existingMock.boardId ? [existingMock.boardId] : []),
        examIds: existingMock.examIds || (existingMock.examId ? [existingMock.examId] : [])
      });

      if (existingMock.questionIds) {
        let currentIndex = 0;
        const hydratedSections = (existingMock.sections || [{ name: 'General Hub', count: existingMock.questionIds.length }]).map((s: any, idx: number) => {
          const count = parseInt(s.count) || 0;
          const sectionQIds = existingMock.questionIds.slice(currentIndex, currentIndex + count);
          currentIndex += count;
          return { 
            id: `sec-${idx + 1}`, 
            name: s.name, 
            questions: sectionQIds.map(id => questionBank.find(q => q.id === id)).filter(Boolean) 
          };
        });
        setSections(hydratedSections);
      }
    }
  }, [existingMock, questionBank])

  const uniqueExams = useMemo(() => {
    if (!rawExams) return [];
    const seen = new Set();
    const filtered = rawExams.filter((e: any) => {
      const key = e.name?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a: any, b: any) => a.name.localeCompare(b.name));

    if (mockData.targetCategoryId && mockData.targetCategoryId !== 'all') {
       // Filter exams belonging to hubs in the selected category
       const validBoardIds = boards?.filter(b => b.categoryId === mockData.targetCategoryId).map(b => b.id) || [];
       return filtered.filter(e => validBoardIds.includes(e.boardId));
    }
    return filtered;
  }, [rawExams, boards, mockData.targetCategoryId]);

  const filteredBoardsByCat = useMemo(() => {
     if (!boards) return [];
     if (!mockData.targetCategoryId || mockData.targetCategoryId === 'all') return boards;
     return boards.filter(b => b.categoryId === mockData.targetCategoryId);
  }, [boards, mockData.targetCategoryId]);

  const filteredBank = useMemo(() => {
    const allSelectedIds = sections.flatMap(s => s.questions.map(q => q.id));
    const assemblyHashes = new Set(
      sections.flatMap(s => s.questions.map(q => 
        `${q.englishQuestion?.trim()}_${q.correctAnswer}`.toLowerCase()
      ))
    );

    return questionBank.filter((q: any) => {
      const matchesSearch = !searchTerm || (q.englishQuestion?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesBoard = filterBoard === "all" || q.boardId === filterBoard;
      const matchesExam = filterExam === "all" || q.examId === filterExam;
      const matchesSub = filterSubject === "all" || q.subjectId === filterSubject;
      
      const notInThisMock = !allSelectedIds.includes(q.id);
      const usedGuard = !hideUsed || (q.status !== 'USED');
      
      const qHash = `${q.englishQuestion?.trim()}_${q.correctAnswer}`.toLowerCase();
      const isContentDuplicate = assemblyHashes.has(qHash);
      const duplicateGuard = !blockDuplicates || (!isContentDuplicate && q.status !== 'DUPLICATE');
      
      return matchesSearch && matchesBoard && matchesExam && matchesSub && notInThisMock && usedGuard && duplicateGuard;
    })
  }, [questionBank, searchTerm, filterBoard, filterExam, filterSubject, hideUsed, blockDuplicates, sections])

  const filteredSubjectsForPicking = useMemo(() => {
    if (!subjects) return [];
    return subjects.filter((s: any) => 
      s.name?.toLowerCase().includes(subjectSearch.toLowerCase())
    ).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [subjects, subjectSearch]);

  // --- ACTIONS ---
  const handleLinkQuestions = () => {
    const toAdd = questionBank.filter(q => bankSelection.includes(q.id));
    setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, questions: [...s.questions, ...toAdd] } : s));
    setBankSelection([]);
    toast({ title: `Linked ${toAdd.length} Assets` });
  }

  const handleSelectAllInBank = () => {
    if (bankSelection.length === filteredBank.length) {
      setBankSelection([]);
    } else {
      setBankSelection(filteredBank.map(q => q.id));
    }
  }

  const handleDeleteFromBank = async (qId: string) => {
    if (!db) return
    if (!confirm("CRITICAL: Permanently purge this question from Global Bank?")) return
    try {
      await deleteDoc(doc(db, "questions", qId))
      setQuestionBank(prev => prev.filter(q => q.id !== qId))
      toast({ title: "Asset Purged" })
    } catch (e) {
      toast({ variant: "destructive", title: "Purge Failed" })
    }
  }

  const handlePublish = async () => {
    if (!db || isPublishing) return
    if (!mockData.title) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Series Title is mandatory." })
      return
    }

    const flatQuestionIds = sections.flatMap(s => s.questions.map(q => q.id));
    if (flatQuestionIds.length === 0) {
       toast({ variant: "destructive", title: "Link Blocked", description: "Add questions first." });
       return;
    }

    setIsPublishing(true)
    const finalId = mockId || `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", finalId)
    const sectionMetadata = sections.map(s => ({ name: s.name, count: s.questions.length })).filter(s => s.count > 0);

    const payload = {
      ...mockData,
      id: finalId,
      boardId: mockData.boardIds[0] || "",
      totalQuestions: flatQuestionIds.length,
      questionIds: flatQuestionIds,
      sections: sectionMetadata,
      totalMarks: flatQuestionIds.length * (mockData.positiveMarks || 1),
      updatedAt: serverTimestamp(),
      createdAt: existingMock?.createdAt || serverTimestamp(),
    };

    try {
      await setDoc(mockRef, payload, { merge: true });
      const batch = writeBatch(db);
      flatQuestionIds.forEach(id => {
        batch.update(doc(db, "questions", id), { 
          status: 'USED', 
          updatedAt: serverTimestamp() 
        });
      });
      await batch.commit();
      toast({ title: "Series Deployed", description: "Mock series is now live." });
      router.push("/admin/mocks")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsPublishing(false)
    }
  }

  const toggleExamId = (id: string) => {
     const current = mockData.examIds || [];
     if (mockData.assignmentMode === 'SINGLE') {
        setMockData({ ...mockData, examIds: [id] });
     } else {
        setMockData({
           ...mockData,
           examIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
        });
     }
  };

  const toggleBoardId = (id: string) => {
    const current = mockData.boardIds || [];
    setMockData({
       ...mockData,
       boardIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    });
  };

  const addNewSection = (name: string) => {
    const newId = `sec-${Date.now()}`;
    setSections([...sections, { id: newId, name: name, questions: [] }]);
    setSubjectSearch("");
    setActiveSectionId(newId);
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-32 text-left pt-2 md:pt-4">
      
      {/* TOP COMMAND BAR */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm">
             <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-headline font-black uppercase tracking-tight text-[#0F172A]">{isEditing ? "Modify Series" : "Mock Architect"}</h1>
            <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Institutional Assembly Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button onClick={handlePublish} disabled={isPublishing} className="bg-[#0F172A] hover:bg-black text-white font-black px-8 md:px-12 h-14 md:h-16 rounded-2xl uppercase text-[10px] md:text-[11px] tracking-[0.2em] gap-3 shadow-3xl border-none">
             {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-5 w-5" />} {isEditing ? "Sync Hub" : "Deploy Series"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 px-4">
        
        {/* LEFT: ASSIGNMENT HUB */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-4">ASSIGNMENT HUB</h2>
              
              <div className="space-y-8">
                 <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">TARGET CATEGORY</Label>
                    <Select value={mockData.targetCategoryId} onValueChange={(v: any) => setMockData({...mockData, targetCategoryId: v, boardIds: [], examIds: []})}>
                       <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-sm">
                          <SelectValue placeholder="Select Category" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">DISTRIBUTION MODE</Label>
                    <Select 
                      value={mockData.assignmentMode || "SINGLE"} 
                      onValueChange={(v: any) => setMockData({...mockData, assignmentMode: v, examIds: [], boardIds: []})}
                    >
                       <SelectTrigger className="h-14 bg-[#0F172A] text-white border-none rounded-2xl px-6 font-black uppercase text-[10px] outline-none shadow-xl">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="SINGLE">Single Vertical</SelectItem>
                          <SelectItem value="MULTIPLE">Multiple Verticals</SelectItem>
                          <SelectItem value="AUTHORITY">Authority Hub (Broadcast)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                      {mockData.assignmentMode === 'AUTHORITY' ? 'TARGET AUTHORITY HUBS' : 'TARGET RECRUITMENT VERTICALS'}
                    </Label>
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-2 space-y-3 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 shadow-inner">
                       {mockData.assignmentMode === 'AUTHORITY' ? (
                         filteredBoardsByCat.map((b: any) => (
                            <div 
                               key={b.id} 
                               onClick={() => toggleBoardId(b.id)}
                               className="flex items-center space-x-4 p-4 bg-white rounded-2xl hover:bg-slate-100 transition-all cursor-pointer shadow-sm border border-slate-100 group"
                            >
                               <div className={cn(
                                  "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                  mockData.boardIds?.includes(b.id) ? "border-primary bg-primary shadow-lg" : "border-slate-200"
                               )}>
                                  {mockData.boardIds?.includes(b.id) && <Check className="h-3.5 w-3.5 text-white" />}
                               </div>
                               <span className="text-[11px] font-black text-[#0F172A] uppercase tracking-tight">{b.abbreviation} Hub</span>
                            </div>
                         ))
                       ) : (
                         uniqueExams.map((e: any) => (
                            <div 
                               key={e.id} 
                               onClick={() => toggleExamId(e.id)}
                               className="flex items-center space-x-4 p-4 bg-white rounded-2xl hover:bg-slate-100 transition-all cursor-pointer shadow-sm border border-slate-100 group"
                            >
                               <div className={cn(
                                  "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                  mockData.examIds?.includes(e.id) ? "border-primary bg-primary shadow-lg" : "border-slate-200"
                               )}>
                                  {mockData.examIds?.includes(e.id) && <Check className="h-3.5 w-3.5 text-white" />}
                               </div>
                               <span className="text-[11px] font-black text-[#0F172A] uppercase tracking-tight">{e.name}</span>
                            </div>
                         ))
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                    <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Test Type</Label>
                       <Select value={mockData.mockType || "FULL"} onValueChange={(v: any) => setMockData({...mockData, mockType: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-[10px] uppercase">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="FULL">Full Length Mock</SelectItem>
                             <SelectItem value="SUBJECT">Subject-Wise Test</SelectItem>
                             <SelectItem value="SECTIONAL">Sectional Test</SelectItem>
                             <SelectItem value="PYQ">PYQ Paper</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Access Level</Label>
                       <Select value={mockData.accessLevel || "FREE"} onValueChange={(v: any) => setMockData({...mockData, accessLevel: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-[10px] uppercase">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="FREE">Public (FREE)</SelectItem>
                             <SelectItem value="PREMIUM">Elite (PREMIUM)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: GLOBAL QUESTION BANK */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
           <div className="bg-[#0B1528] rounded-[2.5rem] p-10 md:p-14 text-white space-y-10 shadow-4xl relative overflow-hidden border border-white/5 flex-1 flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-5"><Zap className="h-40 w-40" /></div>
              
              <div className="relative z-10 space-y-8 flex-1 flex flex-col">
                 <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Search question statements..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="h-16 pl-16 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-500 text-lg font-medium focus-visible:ring-primary" 
                    />
                 </div>

                 {/* GLOBAL BANK QUESTION LIST */}
                 <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden flex-1 flex flex-col min-h-[400px]">
                    <ScrollArea className="flex-1 w-full">
                       <div className="divide-y divide-white/5">
                          {bankLoading ? (
                             Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-24 w-full bg-white/5" />)
                          ) : filteredBank.length > 0 ? filteredBank.map((q) => (
                             <div key={q.id} className="p-6 flex items-center justify-between group/q hover:bg-white/5 transition-all cursor-pointer" onClick={() => {
                                const checked = bankSelection.includes(q.id);
                                setBankSelection(prev => checked ? prev.filter(id => id !== q.id) : [...prev, q.id]);
                             }}>
                                <div className="flex items-center gap-6 min-w-0">
                                   <div className={cn(
                                     "h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                                     bankSelection.includes(q.id) ? "border-primary bg-primary" : "border-white/10"
                                   )}>
                                      {bankSelection.includes(q.id) && <Check className="h-3.5 w-3.5 text-white" />}
                                   </div>
                                   <div className="min-w-0 text-left space-y-1">
                                      <p className="text-base font-bold text-slate-100 truncate max-w-2xl">{q.englishQuestion}</p>
                                      <div className="flex items-center gap-3">
                                         <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{subjects?.find(s => s.id === q.subjectId)?.name || 'General Node'}</span>
                                         <div className="h-1 w-1 rounded-full bg-white/10" />
                                         <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{boards?.find(b => b.id === q.boardId)?.abbreviation || 'GOVT'}</span>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover/q:opacity-100 transition-all ml-4">
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     onClick={(e) => { e.stopPropagation(); handleDeleteFromBank(q.id); }}
                                     className="h-11 w-11 rounded-xl text-rose-500 hover:bg-rose-500/20 shadow-xl"
                                   >
                                      <Trash2 className="h-5 w-5" />
                                   </Button>
                                </div>
                             </div>
                          )) : (
                             <div className="py-32 text-center opacity-20 flex flex-col items-center">
                                <Search className="h-12 w-12 mb-4" />
                                <p className="font-black uppercase tracking-widest text-[10px]">No matching preparation nodes found</p>
                             </div>
                          )}
                       </div>
                    </ScrollArea>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-10 border-t border-white/5 relative z-10">
                 <div className="lg:col-span-5 space-y-3 text-left">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">TARGET SECTION HUB</Label>
                    <select 
                      value={activeSectionId} 
                      onChange={e => setActiveSectionId(e.target.value)} 
                      className="w-full h-16 bg-[#F97316] text-white border-none rounded-2xl px-6 font-black uppercase text-[12px] md:text-[14px] outline-none shadow-2xl tracking-[0.1em] cursor-pointer"
                    >
                       {sections.map(s => <option key={s.id} value={s.id} className="bg-[#0B1528]">{s.name.toUpperCase()}</option>)}
                    </select>
                 </div>

                 <div className="lg:col-span-7 flex flex-wrap items-center justify-end gap-6 h-16">
                    <div className="flex items-center gap-4 bg-white/5 px-6 h-full rounded-2xl border border-white/5 shadow-inner">
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">UNUSED ONLY</span>
                       <Switch checked={hideUsed} onCheckedChange={setHideUsed} className="data-[state=checked]:bg-primary" />
                    </div>
                    
                    <button 
                      onClick={handleSelectAllInBank} 
                      className="h-full px-8 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl"
                    >
                       {bankSelection.length === filteredBank.length && filteredBank.length > 0 ? 'DESELECT ALL' : 'SELECT ALL HUB'}
                    </button>
                 </div>
              </div>

              <div className="pt-6">
                <Button 
                   onClick={handleLinkQuestions}
                   disabled={bankSelection.length === 0}
                   className="w-full h-20 bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase text-[14px] tracking-[0.3em] rounded-3xl shadow-4xl border-none transition-all active:scale-95 gap-4"
                >
                   LINK {bankSelection.length} ASSETS <Zap className="h-6 w-6 fill-current" />
                </Button>
              </div>
           </div>

           {/* ACTIVE ASSEMBLY WORKSPACE */}
           <div className="space-y-6 pt-10">
              <div className="flex items-center justify-between px-4">
                 <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-headline font-black text-[#0F172A] uppercase">Active Assembly</h3>
                 </div>
                 <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-black uppercase text-[9px]">{sections.reduce((acc,s) => acc + s.questions.length, 0)} TOTAL LINKED</Badge>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-10">
                  {sections.map((sec, sIdx) => (
                    <Card key={sec.id} className="border-none shadow-3xl rounded-[3rem] bg-white overflow-hidden border border-slate-100 hover:border-primary/20 transition-all group">
                       <div className="flex items-center justify-between p-8 bg-slate-50/50 border-b border-slate-50">
                          <div className="flex items-center gap-6">
                             <div className="h-10 w-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl shrink-0">{sIdx + 1}</div>
                             <div className="space-y-1 text-left">
                                <Input 
                                  value={sec.name} 
                                  onChange={e => setSections(p => p.map(s => s.id === sec.id ? { ...s, name: e.target.value } : s))} 
                                  className="h-10 w-full md:w-80 bg-transparent border-none font-black uppercase text-xl focus-visible:ring-0 p-0 text-[#0F172A]" 
                                />
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <Button variant="ghost" size="icon" onClick={() => setSections(p => p.filter(s => s.id !== sec.id))} className="h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"><Trash2 className="h-5 w-5" /></Button>
                          </div>
                       </div>
                       <div className="p-8 space-y-4">
                          {sec.questions.map((q: any, qIdx: number) => (
                             <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group/item hover:bg-white hover:shadow-lg transition-all">
                                <div className="flex items-center gap-6 min-w-0">
                                   <span className="text-[10px] font-black text-slate-300 w-6 uppercase">#{qIdx + 1}</span>
                                   <p className="text-sm font-bold text-slate-600 truncate max-w-2xl text-left">{q.englishQuestion}</p>
                                </div>
                                <button 
                                  onClick={() => setSections(p => p.map(s => s.id === sec.id ? { ...s, questions: s.questions.filter((item: any) => item.id !== q.id) } : s))} 
                                  className="text-rose-400 hover:text-rose-600 p-2 transition-all active:scale-90"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                          ))}
                          {sec.questions.length === 0 && (
                            <div className="py-10 text-center opacity-20 italic font-black uppercase text-[10px] tracking-widest">
                               Awaiting link node synchronization...
                            </div>
                          )}
                       </div>
                    </Card>
                  ))}
                  
                  {/* SEARCHABLE SUBJECT PICKER */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="h-24 w-full bg-white border-dashed border-2 border-slate-200 rounded-[2.5rem] shadow-xl hover:border-primary transition-all flex items-center justify-center gap-4 text-slate-400 font-black uppercase text-[11px] tracking-widest group">
                         <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" /> ADD NEW SUBJECT HUB
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 rounded-[2.5rem] bg-[#0F172A] text-white border-white/10 shadow-5xl overflow-hidden" align="center">
                       <div className="p-8 border-b border-white/5 space-y-4">
                          <p className="text-[11px] font-black uppercase text-[#F97316] tracking-[0.3em] text-center">SELECT SUBJECT HUB</p>
                          <div className="relative">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                             <Input 
                               placeholder="Search registry..." 
                               value={subjectSearch}
                               onChange={(e) => setSubjectSearch(e.target.value)}
                               className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl font-bold text-sm focus-visible:ring-[#F97316] text-white placeholder:text-slate-500" 
                             />
                          </div>
                       </div>
                       <ScrollArea className="h-[380px]">
                          <div className="p-4 space-y-1">
                             {filteredSubjectsForPicking.map((s: any) => (
                                <button 
                                   key={s.id}
                                   onClick={() => addNewSection(s.name)}
                                   className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all text-left group"
                                >
                                   <div className="flex items-center gap-4">
                                      <SearchCode className="h-4 w-4 text-slate-500 group-hover:text-[#F97316]" />
                                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-200 group-hover:text-white">{s.name}</span>
                                   </div>
                                   <Plus className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                             ))}
                             <div className="p-2 pt-6 border-t border-white/5 mt-4">
                                <button 
                                   onClick={() => addNewSection(`Section ${sections.length + 1}`)}
                                   className="w-full flex items-center justify-center h-14 rounded-xl bg-primary/10 border border-[#F97316]/20 text-[#F97316] font-black uppercase text-[10px] tracking-widest hover:bg-[#F97316] hover:text-white transition-all shadow-lg"
                                >
                                   + Custom Section Node
                                </button>
                             </div>
                          </div>
                          <ScrollBar className="bg-white/10" />
                       </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
              </ScrollArea>
           </div>
        </div>
      </div>
    </div>
  )
}
