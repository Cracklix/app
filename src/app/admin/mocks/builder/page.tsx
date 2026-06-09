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
  FileWarning,
  History,
  RefreshCw,
  Award,
  AlertTriangle
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
 * @fileOverview FINAL HIGH-FIDELITY Mock Architect v66.0.
 * UPDATED: Hardened typography and responsive layouts for maximum visibility.
 * FIXED: Marks cards redesigned to match high-fidelity oval screenshot exactly.
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
  const { data: categories } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? query(collection(db, "boards"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: rawExams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? query(collection(db, "subjects"), orderBy("name", "asc")) : null), [db]))
  const { data: existingMock } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  // --- STATE HUB ---
  const [bankLoading, setBankLoading] = useState(false)
  const [questionBank, setQuestionBank] = useState<any[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeRightTab, setActiveRightTab] = useState<'BANK' | 'ASSEMBLY'>('BANK')
  
  // Question Bank Filters
  const [filterBoard, setFilterBoard] = useState("all")
  const [filterExam, setFilterExam] = useState("all")
  const [filterSubject, setSubjectFilter] = useState("all")
  const [hideUsed, setHideUsed] = useState(true)
  const [blockDuplicates, setBlockDuplicates] = useState(true)
  const [bankSelection, setBankSelection] = useState<string[]>([])
  
  // Subject Picker State
  const [subjectSearch, setSubjectSearch] = useState("")

  // Mock Metadata & Architecture
  const [mockData, setMockData] = useState<any>({
    title: "", 
    assignmentMode: "MULTIPLE" as MockAssignmentMode,
    targetCategoryId: "all",
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
    { id: 'sec-1', name: 'GENERAL HUB', questions: [] }
  ])
  const [activeSectionId, setActiveSectionId] = useState('sec-1')

  // --- DATA SYNC ---
  const fetchBank = async () => {
    if (!db) return
    setBankLoading(true)
    try {
      const q = query(collection(db, "questions"), limit(2000))
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
        assignmentMode: existingMock.assignmentMode || "MULTIPLE",
        boardIds: existingMock.boardIds || (existingMock.boardId ? [existingMock.boardId] : []),
        examIds: existingMock.examIds || (existingMock.examId ? [existingMock.examId] : [])
      });

      if (existingMock.questionIds) {
        let currentIndex = 0;
        const hydratedSections = (existingMock.sections || [{ name: 'GENERAL HUB', count: existingMock.questionIds.length }]).map((s: any, idx: number) => {
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

    if (mockData.boardIds?.length > 0) {
       return filtered.filter(e => mockData.boardIds.includes(e.boardId));
    }
    return filtered;
  }, [rawExams, mockData.boardIds]);

  // CASCADING BANK FILTERS
  const bankExams = useMemo(() => {
    if (!rawExams) return [];
    if (filterBoard === "all") return rawExams;
    return rawExams.filter(e => e.boardId === filterBoard);
  }, [rawExams, filterBoard]);

  const filteredBank = useMemo(() => {
    const allSelectedIds = sections.flatMap(s => s.questions.map(q => q.id));
    return questionBank.filter((q: any) => {
      const matchesBoard = filterBoard === "all" || q.boardId === filterBoard;
      const matchesExam = filterExam === "all" || q.examId === filterExam;
      const matchesSub = filterSubject === "all" || q.subjectId === filterSubject;
      const notInThisMock = !allSelectedIds.includes(q.id) || !blockDuplicates;
      const usedGuard = !hideUsed || (q.status !== 'USED');
      return matchesBoard && matchesExam && matchesSub && notInThisMock && usedGuard;
    })
  }, [questionBank, filterBoard, filterExam, filterSubject, hideUsed, blockDuplicates, sections])

  const filteredSubjectsForPicking = useMemo(() => {
    if (!subjects) return [];
    const seen = new Set();
    return subjects.filter((s: any) => {
      const key = s.name?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return s.name?.toLowerCase().includes(subjectSearch.toLowerCase());
    }).sort((a: any, b: any) => a.name.localeCompare(b.name));
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

  const toggleBoardId = (id: string) => {
     const current = mockData.boardIds || [];
     setMockData({
        ...mockData,
        boardIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
     });
  };

  const toggleExamId = (id: string) => {
     const current = mockData.examIds || [];
     setMockData({
        ...mockData,
        examIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
     });
  };

  const addNewSection = (name: string) => {
    const newId = `sec-${Date.now()}`;
    setSections([...sections, { id: newId, name: name.toUpperCase(), questions: [] }]);
    setSubjectSearch("");
    setActiveSectionId(newId);
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-40 text-left pt-2 md:pt-4 px-2 md:px-6">
      
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 md:h-14 md:w-14 shadow-sm active:scale-95">
             <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
          <div className="text-left">
            <h1 className="text-2xl md:text-5xl font-headline font-black uppercase tracking-tight text-[#0F172A] leading-none">{isEditing ? "Modify Series" : "Mock Architect"}</h1>
            <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.3em] text-slate-400 mt-2">Institutional Assembly Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button onClick={handlePublish} disabled={isPublishing} className="bg-[#0F172A] hover:bg-black text-white font-black px-8 md:px-12 h-14 md:h-16 rounded-xl md:rounded-2xl uppercase text-[11px] tracking-[0.2em] gap-3 shadow-3xl active:scale-95">
            {isPublishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ClipboardCheck className="h-6 w-6" />} Deploy Series
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* LEFT COLUMN: ASSIGNMENT HUB */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-6 md:p-12 space-y-12 border border-slate-100">
              
              <div className="space-y-4">
                 <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">SERIES TITLE</Label>
                 <Input 
                   value={mockData.title} 
                   onChange={e => setMockData({...mockData, title: e.target.value})}
                   className="h-16 md:h-20 rounded-2xl bg-slate-50/50 border-none font-black text-lg md:text-2xl px-8 shadow-inner focus-visible:ring-primary text-[#0F172A]" 
                   placeholder="e.g. Patwari High Fidelity Mock 1"
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">TEST TYPE</Label>
                    <Select value={mockData.mockType} onValueChange={(v: MockType) => setMockData({...mockData, mockType: v})}>
                       <SelectTrigger className="h-14 md:h-16 rounded-xl bg-slate-50/50 border-none font-black text-[11px] uppercase px-6">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="FULL">Full Length Mock</SelectItem>
                          <SelectItem value="SUBJECT">Subject-Wise Test</SelectItem>
                          <SelectItem value="SECTIONAL">Sectional Test</SelectItem>
                          <SelectItem value="PYQ">PYQ Paper</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-4">
                    <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">ACCESS LEVEL</Label>
                    <Select value={mockData.accessLevel} onValueChange={(v: AccessLevel) => setMockData({...mockData, accessLevel: v})}>
                       <SelectTrigger className="h-14 md:h-16 rounded-xl bg-slate-50/50 border-none font-black text-[11px] uppercase px-6">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="FREE">Public (FREE)</SelectItem>
                          <SelectItem value="PREMIUM">Elite (PREMIUM)</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-4">
                <Select value={mockData.assignmentMode} onValueChange={(v: MockAssignmentMode) => setMockData({...mockData, assignmentMode: v})}>
                  <SelectTrigger className="h-16 md:h-20 rounded-2xl bg-[#0B1528] text-white border-none font-black uppercase text-[12px] tracking-[0.2em] px-8 shadow-2xl flex items-center justify-between group">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B1528] text-white border-white/10 rounded-2xl p-2">
                     <SelectItem value="SINGLE" className="rounded-xl py-3 focus:bg-white/10 font-bold uppercase text-[10px] tracking-widest">SINGLE VERTICAL</SelectItem>
                     <SelectItem value="MULTIPLE" className="rounded-xl py-3 focus:bg-white/10 font-bold uppercase text-[10px] tracking-widest">MULTIPLE VERTICALS</SelectItem>
                     <SelectItem value="AUTHORITY" className="rounded-xl py-3 focus:bg-white/10 font-bold uppercase text-[10px] tracking-widest">AUTHORITY HUB (BROADCAST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 text-left">
                <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">TARGET AUTHORITY BOARDS</Label>
                <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-3">
                   {boards?.map((b: any) => (
                      <div 
                         key={b.id} 
                         onClick={() => toggleBoardId(b.id)}
                         className="flex items-center space-x-4 p-4 md:p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group"
                      >
                         <div className={cn(
                            "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                            mockData.boardIds?.includes(b.id) ? "border-[#F97316] bg-[#F97316] shadow-lg shadow-orange-500/20" : "border-slate-300 bg-white"
                         )}>
                            {mockData.boardIds?.includes(b.id) && <Check className="h-4 w-4 text-white" />}
                         </div>
                         <span className="text-[12px] font-black text-[#0F172A] uppercase tracking-tight truncate">{b.abbreviation} HUB</span>
                      </div>
                   ))}
                </div>
              </div>

              <div className="space-y-4 text-left">
                <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">TARGET RECRUITMENT VERTICALS</Label>
                <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-3">
                   {uniqueExams.map((e: any) => {
                      const isSelected = mockData.examIds?.includes(e.id);
                      return (
                        <div 
                           key={e.id} 
                           onClick={() => toggleExamId(e.id)}
                           className="flex items-center space-x-4 p-4 md:p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer group"
                        >
                           <div className={cn(
                              "h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                              isSelected ? "border-[#F97316] bg-[#F97316]" : "border-slate-300 bg-white"
                           )}>
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                           </div>
                           <span className="text-[12px] font-black text-[#0F172A] uppercase tracking-tight truncate">{e.name}</span>
                        </div>
                      )
                   })}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.2em] ml-1">LANGUAGE HUB</Label>
                <Select value={mockData.languageMode} onValueChange={(v: LanguageDisplayMode) => setMockData({...mockData, languageMode: v})}>
                  <SelectTrigger className="h-16 md:h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm font-black text-[12px] uppercase px-8 tracking-[0.1em] flex items-center justify-between">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2">
                    <SelectItem value="ENGLISH_PUNJABI" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">ENGLISH & ਪੰਜਾਬੀ</SelectItem>
                    <SelectItem value="ENGLISH_HINDI" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">ENGLISH & हिन्दी</SelectItem>
                    <SelectItem value="ENGLISH" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">ENGLISH ONLY</SelectItem>
                    <SelectItem value="PUNJABI" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">ਪੰਜਾਬੀ ONLY</SelectItem>
                    <SelectItem value="HINDI" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">हिन्दी ONLY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                 <div className="space-y-4">
                    <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                       <Clock className="h-4 w-4" /> DURATION (MIN)
                    </Label>
                    <Input 
                       type="number" 
                       value={isNaN(mockData.duration) ? "" : mockData.duration} 
                       onChange={e => setMockData({...mockData, duration: parseInt(e.target.value) || 0})} 
                       className="h-16 md:h-20 rounded-2xl bg-slate-50/50 border-none font-black text-center text-2xl shadow-inner focus-visible:ring-primary" 
                    />
                 </div>
                 <div className="space-y-4">
                    <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                       <Lock className="h-4 w-4" /> ATTEMPT LIMIT
                    </Label>
                    <Select 
                       value={mockData.attemptLimit?.toString()} 
                       onValueChange={v => setMockData({...mockData, attemptLimit: parseInt(v) || 0})}
                    >
                       <SelectTrigger className="h-16 md:h-20 rounded-2xl bg-white border-2 border-[#F97316] font-black text-[12px] uppercase px-6 shadow-xl focus:ring-0">
                          <SelectValue placeholder="UNLIMITED" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl">
                          <SelectItem value="0" className="py-3 font-bold">UNLIMITED</SelectItem>
                          <SelectItem value="1" className="py-3 font-bold">1 ATTEMPT</SelectItem>
                          <SelectItem value="2" className="py-3 font-bold">2 ATTEMPTS</SelectItem>
                          <SelectItem value="3" className="py-3 font-bold">3 ATTEMPTS</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                 {/* POSITIVE MARKS CARD - MATCHED TO OVAL SCREENSHOT */}
                 <div className="bg-[#F0FDF4] p-8 md:p-12 rounded-[4rem] md:rounded-[5rem] border-2 border-[#DCFCE7] text-center space-y-6 shadow-lg group hover:shadow-2xl transition-all duration-500 flex flex-col items-center">
                    <div className="space-y-2">
                       <p className="text-[11px] md:text-[14px] font-black text-[#10B981] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                          POSITIVE
                       </p>
                       <p className="text-[10px] md:text-[14px] font-black text-[#10B981] uppercase tracking-[0.2em] leading-none">(+)</p>
                    </div>
                    <Input 
                       type="number" 
                       step="0.1"
                       value={isNaN(mockData.positiveMarks) ? "" : mockData.positiveMarks} 
                       onChange={e => setMockData({...mockData, positiveMarks: parseFloat(e.target.value) || 0})}
                       className="h-20 bg-transparent border-none text-center font-black text-5xl md:text-7xl text-[#10B981] p-0 focus-visible:ring-0 tabular-nums" 
                    />
                 </div>
                 {/* PENALTY MARKS CARD - MATCHED TO OVAL SCREENSHOT */}
                 <div className="bg-[#FEF2F2] p-8 md:p-12 rounded-[4rem] md:rounded-[5rem] border-2 border-[#FEE2E2] text-center space-y-6 shadow-lg group hover:shadow-2xl transition-all duration-500 flex flex-col items-center">
                    <div className="space-y-2">
                       <p className="text-[11px] md:text-[14px] font-black text-[#F43F5E] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                          PENALTY
                       </p>
                       <p className="text-[10px] md:text-[14px] font-black text-[#F43F5E] uppercase tracking-[0.2em] leading-none">(-)</p>
                    </div>
                    <Input 
                       type="number" 
                       step="0.01"
                       value={isNaN(mockData.negativeMarks) ? "" : mockData.negativeMarks} 
                       onChange={e => setMockData({...mockData, negativeMarks: parseFloat(e.target.value) || 0})}
                       className="h-20 bg-transparent border-none text-center font-black text-5xl md:text-7xl text-[#F43F5E] p-0 focus-visible:ring-0 tabular-nums" 
                    />
                 </div>
              </div>
           </Card>
        </div>

        {/* RIGHT COLUMN: TACTICAL HUB */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
           
           <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={() => setActiveRightTab('BANK')}
                className={cn(
                  "px-8 md:px-12 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center gap-3",
                  activeRightTab === 'BANK' ? "bg-[#0B1528] text-white shadow-2xl" : "text-slate-400 hover:text-[#0B1528] hover:bg-slate-50"
                )}
              >
                 <Database className="h-5 w-5" /> Global Bank
              </button>
              <button 
                onClick={() => setActiveRightTab('ASSEMBLY')}
                className={cn(
                  "px-8 md:px-12 py-4 rounded-xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center gap-3",
                  activeRightTab === 'ASSEMBLY' ? "bg-[#0B1528] text-white shadow-2xl" : "text-slate-400 hover:text-[#0B1528] hover:bg-slate-50"
                )}
              >
                 <Layers className="h-5 w-5" /> Assembly Hub
              </button>
           </div>

           <div className="flex-1 flex flex-col space-y-10">
              {activeRightTab === 'BANK' ? (
                <>
                  <div className="bg-[#0B1528] rounded-[3rem] p-8 md:p-14 text-white space-y-12 shadow-5xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Zap className="h-64 w-64" /></div>
                    
                    <div className="relative z-10 flex flex-col space-y-12">
                        {/* 1. TOP STATS BOXES */}
                        <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-white/5">
                           <div className="flex flex-wrap items-center gap-4 md:gap-8">
                              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-inner">
                                 <span className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">REGISTRY FILTERED</span>
                                 <span className="text-sm md:text-xl font-black text-primary tabular-nums">{filteredBank.length} ASSETS</span>
                              </div>
                              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-inner">
                                 <span className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">TOTAL BANK</span>
                                 <span className="text-sm md:text-xl font-black text-white tabular-nums">{questionBank.length} ASSETS</span>
                              </div>
                           </div>
                           <Badge className="bg-[#F97316] text-white border-none text-[10px] md:text-[12px] font-black px-6 py-2 rounded-xl shadow-3xl uppercase tracking-[0.1em]">
                              Official Hub
                           </Badge>
                        </div>

                        {/* 2. THREE COLUMN FILTER */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-left">
                           <div className="space-y-4">
                              <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.3em] ml-1">SOURCE BOARD HUB</Label>
                              <Select value={filterBoard} onValueChange={(v) => { setFilterBoard(v); setFilterExam("all"); }}>
                                 <SelectTrigger className="h-16 md:h-20 bg-white/5 border-white/10 rounded-2xl font-black text-[12px] text-white px-8 shadow-xl transition-all focus:ring-0"><SelectValue placeholder="All..." /></SelectTrigger>
                                 <SelectContent className="bg-[#0B1528] text-white border-white/10 rounded-2xl p-2">
                                    <SelectItem value="all" className="rounded-xl py-3 font-bold uppercase text-[10px]">All Board Hubs</SelectItem>
                                    {boards?.map(b => <SelectItem key={b.id} value={b.id} className="rounded-xl py-3 font-bold uppercase text-[10px]">{b.abbreviation} Hub</SelectItem>)}
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.3em] ml-1">RECRUITMENT VERTICAL</Label>
                              <Select value={filterExam} onValueChange={setFilterExam}>
                                 <SelectTrigger className="h-16 md:h-20 bg-white/5 border-white/10 rounded-2xl font-black text-[12px] text-white px-8 shadow-xl transition-all focus:ring-0"><SelectValue placeholder="All..." /></SelectTrigger>
                                 <SelectContent className="bg-[#0B1528] text-white border-white/10 rounded-2xl p-2 max-h-[350px]">
                                    <SelectItem value="all" className="rounded-xl py-3 font-bold uppercase text-[10px]">All Verticals</SelectItem>
                                    {bankExams.map(e => <SelectItem key={e.id} value={e.id} className="rounded-xl py-3 font-bold uppercase text-[10px]">{e.name}</SelectItem>)}
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.3em] ml-1">SUBJECT NODE</Label>
                              <Select value={filterSubject} onValueChange={setSubjectFilter}>
                                 <SelectTrigger className="h-16 md:h-20 bg-white/5 border-white/10 rounded-2xl font-black text-[12px] text-white px-8 shadow-xl transition-all focus:ring-0"><SelectValue placeholder="All..." /></SelectTrigger>
                                 <SelectContent className="bg-[#0B1528] text-white border-white/10 rounded-2xl p-2 max-h-[350px]">
                                    <SelectItem value="all" className="rounded-xl py-3 font-bold uppercase text-[10px]">All Subject Nodes</SelectItem>
                                    {subjects?.map(s => <SelectItem key={s.id} value={s.id} className="rounded-xl py-3 font-bold uppercase text-[10px]">{s.name}</SelectItem>)}
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="h-px w-full bg-white/10" />

                        {/* 3. TACTICAL COMMAND BAR */}
                        <div className="space-y-12">
                          <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                              <div className="flex-1 space-y-4 text-left w-full">
                                <div className="text-[10px] md:text-xs font-black uppercase text-slate-500 tracking-[0.4em] leading-tight">
                                   TARGET<br/>SECTION HUB
                                </div>
                                <Popover>
                                   <PopoverTrigger asChild>
                                      <button className="w-full h-20 md:h-24 bg-[#F97316] hover:bg-orange-600 text-white rounded-[1.8rem] md:rounded-[2.5rem] font-black uppercase text-[18px] md:text-[24px] shadow-5xl tracking-[0.1em] transition-all flex items-center justify-center px-8 border-none active:scale-95 group">
                                         {sections.find(s => s.id === activeSectionId)?.name || "GENERAL HUB"}
                                      </button>
                                   </PopoverTrigger>
                                   <PopoverContent className="w-[320px] md:w-[400px] bg-[#0F172A] border-white/10 p-0 rounded-[3rem] shadow-5xl z-[1001] overflow-hidden">
                                      <div className="p-10 pb-6 border-b border-white/5 flex items-center justify-between">
                                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">GENERAL HUB</p>
                                         <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black">{sections.length} NODES</Badge>
                                      </div>
                                      <ScrollArea className="h-72">
                                         <div className="space-y-2 p-6">
                                            {sections.map(s => (
                                               <button 
                                                  key={s.id} 
                                                  onClick={() => setActiveSectionId(s.id)}
                                                  className={cn(
                                                     "w-full p-5 rounded-2xl text-left font-black uppercase text-[13px] tracking-widest transition-all",
                                                     activeSectionId === s.id ? "bg-[#F97316] text-white shadow-xl" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                                  )}
                                               >
                                                  {s.name}
                                               </button>
                                            ))}
                                         </div>
                                      </ScrollArea>
                                   </PopoverContent>
                                </Popover>
                              </div>
                              
                              <div className="flex-[2] flex gap-4 md:gap-6 w-full">
                                <div className="flex-1 flex items-center justify-between bg-white/5 px-8 py-4 rounded-[1.8rem] md:rounded-[2.5rem] border border-white/10 h-20 md:h-24 group hover:bg-white/10 transition-all cursor-pointer shadow-inner">
                                    <div className="flex flex-col text-left">
                                       <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 leading-tight">UNUSED</span>
                                       <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 leading-tight">ONLY</span>
                                    </div>
                                    <Switch checked={hideUsed} onCheckedChange={setHideUsed} className="data-[state=checked]:bg-[#F97316] scale-110 md:scale-125" />
                                </div>
                                <div className="flex-1 flex items-center justify-between bg-white/5 px-8 py-4 rounded-[1.8rem] md:rounded-[2.5rem] border border-white/10 h-20 md:h-24 group hover:bg-white/10 transition-all cursor-pointer shadow-inner">
                                    <div className="flex flex-col text-left">
                                       <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 leading-tight">BLOCK</span>
                                       <span className="text-[10px] md:text-xs font-black uppercase text-slate-300 leading-tight">REPEATS</span>
                                    </div>
                                    <Switch checked={blockDuplicates} onCheckedChange={setBlockDuplicates} className="data-[state=checked]:bg-[#10B981] scale-110 md:scale-125" />
                                </div>
                              </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                              <Button 
                                  onClick={handleSelectAllInBank} 
                                  variant="outline"
                                  className="h-20 md:h-24 flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[12px] md:text-[14px] tracking-[0.3em] rounded-[1.8rem] md:rounded-[2.5rem] shadow-xl active:scale-95"
                              >
                                  SELECT ALL ASSETS
                              </Button>
                              <Button 
                                onClick={handleLinkQuestions}
                                disabled={bankSelection.length === 0}
                                className="h-20 md:h-24 flex-[2] bg-[#10B981] hover:bg-[#0E946A] text-white font-black uppercase text-[18px] md:text-[26px] tracking-[0.3em] rounded-[1.8rem] md:rounded-[2.5rem] shadow-5xl border-none transition-all active:scale-95 gap-5"
                              >
                                LINK {bankSelection.length} ASSETS <Zap className="h-8 w-8 md:h-10 md:w-10 fill-current" />
                              </Button>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* QUESTION LIST HUB */}
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {bankLoading ? (
                      Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-[3rem] bg-slate-50" />)
                    ) : filteredBank.map((q) => {
                      const isSelected = bankSelection.includes(q.id);
                      const board = boards?.find(b => b.id === q.boardId);
                      const sub = subjects?.find(s => s.id === q.subjectId);
                      return (
                        <Card 
                          key={q.id} 
                          onClick={() => setBankSelection(prev => isSelected ? prev.filter(id => id !== q.id) : [...prev, q.id])}
                          className={cn(
                            "border-none shadow-xl rounded-[3rem] bg-white p-8 md:p-12 flex items-center gap-8 md:gap-12 cursor-pointer transition-all duration-500 hover:translate-y-[-6px] border border-slate-100 group overflow-hidden relative",
                            isSelected && "ring-2 ring-primary/20 bg-primary/5"
                          )}
                        >
                           <div className={cn(
                              "h-12 w-12 md:h-16 md:w-16 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-500",
                              isSelected ? "border-[#F97316] bg-[#F97316] shadow-2xl" : "border-slate-200 bg-white"
                           )}>
                              {isSelected && <Check className="h-6 w-6 md:h-8 md:w-8 text-white stroke-[4px]" />}
                           </div>
                           
                           <div className="flex-1 min-w-0 space-y-6 text-left">
                              <div className="flex flex-wrap items-center gap-4">
                                 <Badge className="bg-[#0B1528] text-white border-none font-black text-[10px] px-4 py-1 rounded-lg uppercase tracking-widest shadow-lg">{board?.abbreviation || 'PSSSB'}</Badge>
                                 <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px] font-black uppercase px-4 py-1 rounded-lg bg-slate-50">{sub?.name || 'ICT'}</Badge>
                                 {q.status === 'USED' && <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">USED</Badge>}
                              </div>
                              <p className="font-black text-lg md:text-3xl text-[#0F172A] leading-[1.2] antialiased break-words tracking-tight group-hover:text-primary transition-colors">
                                {q.englishQuestion}
                              </p>
                           </div>

                           <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteFromBank(q.id); }}
                              className="h-14 w-14 text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all shrink-0 rounded-2xl"
                           >
                              <Trash2 className="h-8 w-8" />
                           </Button>
                        </Card>
                      )
                    })}
                    {filteredBank.length === 0 && !bankLoading && (
                      <div className="py-40 text-center opacity-20 flex flex-col items-center gap-6 grayscale">
                         <Database className="h-24 w-24" />
                         <p className="font-black font-headline text-2xl uppercase tracking-[0.4em]">Registry Hub Empty</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-8 flex-1 flex flex-col animate-in fade-in duration-500">
                    <div className="flex items-center justify-between px-6">
                      <h3 className="text-2xl font-headline font-black text-[#0F172A] uppercase flex items-center gap-4">
                          <Layers className="h-7 w-7 text-primary" /> Active Assembly Hub
                      </h3>
                      <Badge className="bg-[#0F172A] text-white border-none px-6 py-2 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl">
                         {sections.reduce((acc,s) => acc + s.questions.length, 0)} ASSETS LINKED
                      </Badge>
                    </div>

                    <ScrollArea className="h-[800px] pr-6 flex-1">
                      <div className="space-y-10">
                          {sections.map((sec, sIdx) => (
                            <Card key={sec.id} className="border-none shadow-3xl rounded-[3.5rem] bg-white overflow-hidden border border-slate-100 group/sec">
                                <div className="flex items-center justify-between p-10 bg-slate-50/50 border-b border-slate-50">
                                  <div className="flex items-center gap-8 text-left">
                                      <div className="h-14 w-14 bg-[#0F172A] text-white rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-2xl shrink-0 group-hover/sec:bg-primary transition-colors">
                                         {sIdx + 1}
                                      </div>
                                      <div>
                                        <Input 
                                            value={sec.name} 
                                            onChange={e => setSections(p => p.map(s => s.id === sec.id ? { ...s, name: e.target.value.toUpperCase() } : s))} 
                                            className="h-10 w-full md:w-[450px] bg-transparent border-none font-black uppercase text-2xl md:text-3xl focus-visible:ring-0 p-0 text-[#0F172A]" 
                                        />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{sec.questions.length} Linked Prep Nodes</p>
                                      </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => setSections(p => p.filter(s => s.id !== sec.id))} className="h-14 w-14 text-rose-500 hover:bg-rose-50 rounded-[1.2rem] transition-all"><Trash2 className="h-7 w-7" /></Button>
                                </div>
                                <div className="p-10 space-y-6">
                                  {sec.questions.map((q: any, qIdx: number) => (
                                      <div key={q.id} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group/item hover:bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
                                        <div className="flex items-center gap-8 min-w-0 flex-1">
                                            <span className="text-xl font-black text-slate-300 w-8 shrink-0">#{qIdx + 1}</span>
                                            <p className="text-base font-bold text-slate-600 truncate text-left">{q.englishQuestion}</p>
                                        </div>
                                        <button 
                                            className="text-slate-300 hover:text-rose-600 p-3 shrink-0 transition-colors"
                                            onClick={() => setSections(p => p.map(s => s.id === sec.id ? { ...s, questions: s.questions.filter((item: any) => item.id !== q.id) } : s))} 
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </button>
                                      </div>
                                  ))}
                                  {sec.questions.length === 0 && (
                                      <div className="py-20 text-center opacity-20 italic font-black uppercase text-[12px] tracking-widest flex flex-col items-center gap-4">
                                         <Zap className="h-12 w-12" />
                                         Awaiting link node synchronization...
                                      </div>
                                  )}
                                </div>
                            </Card>
                          ))}

                          <Popover>
                            <PopoverTrigger asChild>
                                <Button className="h-28 w-full bg-white border-dashed border-4 border-slate-200 rounded-[3rem] shadow-xl hover:border-primary hover:shadow-2xl transition-all flex items-center justify-center gap-6 text-slate-300 hover:text-primary font-black uppercase text-[12px] md:text-[14px] tracking-[0.4em] group active:scale-[0.98]">
                                  <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform" /> ADD NEW SUBJECT HUB
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[340px] md:w-[450px] p-0 rounded-[3.5rem] bg-[#0F172A] text-white border-white/10 shadow-5xl overflow-hidden z-[1001]">
                                <div className="p-10 border-b border-white/5 space-y-6">
                                  <p className="text-[12px] font-black uppercase text-[#F97316] tracking-[0.4em] text-center leading-none">SELECT SUBJECT HUB</p>
                                  <div className="relative">
                                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                      <Input 
                                        placeholder="Search master registry..." 
                                        value={subjectSearch}
                                        onChange={(e) => setSubjectSearch(e.target.value)}
                                        className="h-14 md:h-16 pl-14 bg-white/5 border-white/10 rounded-2xl font-bold text-base focus-visible:ring-[#F97316] text-white placeholder:text-slate-600" 
                                      />
                                  </div>
                                </div>
                                <ScrollArea className="h-[450px]">
                                  <div className="p-6 space-y-2">
                                      {filteredSubjectsForPicking.map((s: any) => (
                                        <button 
                                            key={s.id}
                                            onClick={() => addNewSection(s.name)}
                                            className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-6">
                                              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#F97316] transition-colors">
                                                 <SearchCode className="h-5 w-5" />
                                              </div>
                                              <span className="text-[13px] font-black uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors">{s.name}</span>
                                            </div>
                                            <Plus className="h-5 w-5 text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                      ))}
                                  </div>
                                  <ScrollBar className="bg-white/10" />
                                </ScrollArea>
                            </PopoverContent>
                          </Popover>
                      </div>
                    </ScrollArea>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
