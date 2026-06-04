"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { Zap, Database, ChevronLeft, Rocket, CheckCircle2, FileWarning, AlertTriangle, Settings2, DatabaseBackup, Layers, Globe, GraduationCap, Clock, ClipboardCheck } from "lucide-react"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import QuestionRenderer from "@/components/questions/QuestionRenderer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MockType } from "@/types"

/**
 * @fileOverview Institutional Bulk Ingestion Hub.
 * Optimized to prevent 'undefined' field errors in WriteBatch.
 */

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [rawText, setRawText] = useState("")
  const [metadata, setMetadata] = useState({
    boardId: "",
    examId: "",
    subjectId: "",
    chapterId: "",
    difficulty: "Medium" as any,
    status: "PUBLISHED" as any,
    languagePreference: "bilingual" as any,
    duration: 120,
    mockType: "FULL" as MockType
  })
  
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [showMockCreator, setShowMockCreator] = useState(false)
  const [lastImportedIds, setLastImportedIds] = useState<string[]>([])

  const handleParse = () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.subjectId) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Select Board and Subject first." })
      return
    }
    
    // Updated parser call logic matching current engine capabilities
    const results = parseBulkQuestions(rawText, {
      ...metadata,
      status: metadata.status || "PUBLISHED",
      difficulty: metadata.difficulty || "Medium"
    })
    
    if (results.errors.length > 0) {
      setParseErrors(results.errors)
      setParsedQuestions([])
      toast({ variant: "destructive", title: "Template Match Failed", description: "Correct block markers and try again." })
    } else {
      setParseErrors([])
      setParsedQuestions(results.questions)
      toast({ title: "Extraction Success", description: `${results.questions.length} nodes successfully structured.` })
    }
  }

  const handleCommitToBank = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsImporting(true)
    const batch = writeBatch(db)
    const ids: string[] = []

    parsedQuestions.forEach(q => {
      const newRef = doc(collection(db, "questions"))
      
      // Sanitization: Firestore does not accept 'undefined'. Purge them.
      const payload = JSON.parse(JSON.stringify({
        ...q,
        id: newRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isStandalone: true
      }));

      batch.set(newRef, payload)
      ids.push(newRef.id)
    })

    try {
      await batch.commit()
      setLastImportedIds(ids)
      toast({ title: "Bank Updated", description: `${parsedQuestions.length} nodes deployed.` })
      setShowMockCreator(true)
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'questions/bulk', operation: 'write' }));
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeployMock = async () => {
    if (!db || lastImportedIds.length === 0) return
    
    const mockId = `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", mockId)
    
    const payload = JSON.parse(JSON.stringify({
      id: mockId,
      title: `${metadata.boardId} ${metadata.mockType} Series - ${new Date().toLocaleDateString()}`,
      boardId: metadata.boardId,
      examId: metadata.examId,
      mockType: metadata.mockType,
      duration: metadata.duration,
      totalQuestions: lastImportedIds.length,
      questionIds: lastImportedIds,
      difficulty: metadata.difficulty,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPremium: true
    }));

    try {
      await setDoc(mockRef, payload)
      toast({ title: "Series Deployed", description: "Mock test is now live for all aspirants." })
      router.push("/admin/mocks")
    } catch (e) {
      toast({ variant: "destructive", title: "Deployment Failed", description: "Could not initialize mock series." })
    }
  }

  const placeholderText = `[BLOCK_ID: Q71]
ENG_Q: Question in English?
PUN_Q: ਸਵਾਲ ਪੰਜਾਬੀ ਵਿੱਚ?
ENG_OPT: A. Option 1 | B. Option 2 | C. Option 3 | D. Option 4
PUN_OPT: A. ਵਿਕਲਪ 1 | B. ਵਿਕਲਪ 2 | C. ਵਿਕਲਪ 3 | D. ਵਿਕਲਪ 4
ENG_ANS: B
ENG_EXP: Explanation in English.
PUN_EXP: ਵਿਆਖਿਆ ਪੰਜਾਬੀ ਵਿੱਚ.`;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto text-[#0F172A]">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border border-slate-200 bg-white h-14 w-14 shadow-sm">
            <ChevronLeft className="h-8 w-8 text-[#0F172A]" />
          </Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Bulk Ingestion Hub</h1>
            <p className="text-slate-500 font-medium">Inject metadata and parse tagged institutional content.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 border-slate-200 bg-white shadow-sm" onClick={() => { setRawText(""); setParsedQuestions([]); setParseErrors([]); }}>
              <DatabaseBackup className="h-5 w-5" /> Reset Buffer
           </Button>
           <Button onClick={handleCommitToBank} disabled={isImporting || parsedQuestions.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl h-16 px-12 gap-3 shadow-3xl shadow-emerald-900/20">
              <Rocket className="h-5 w-5" /> {isImporting ? 'Syncing Repo...' : 'Deploy to Bank'}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-5 space-y-8 text-left">
          <Card className="border-none bg-white shadow-3xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="font-headline font-black text-2xl uppercase flex items-center gap-4">
                <Settings2 className="h-6 w-6 text-primary" /> Protocol & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Recruiting Board</Label>
                  <Select value={metadata.boardId} onValueChange={val => setMetadata({...metadata, boardId: val})}>
                    <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm text-[#0F172A]"><SelectValue placeholder="Select Board" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Target Exam</Label>
                   <Select value={metadata.examId} onValueChange={val => setMetadata({...metadata, examId: val})}>
                     <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm text-[#0F172A]"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                     <SelectContent>{exams?.filter((e: any) => e.boardId === metadata.boardId).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Subject</Label>
                   <Select value={metadata.subjectId} onValueChange={val => setMetadata({...metadata, subjectId: val})}>
                     <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm text-[#0F172A]"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                     <SelectContent>{subjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Topic / Chapter</Label>
                   <Input 
                      placeholder="e.g. Blood Relations" 
                      className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm"
                      value={metadata.chapterId}
                      onChange={(e) => setMetadata({...metadata, chapterId: e.target.value})}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Duration (Mins)</Label>
                   <Input 
                      type="number"
                      placeholder="120" 
                      className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm"
                      value={metadata.duration}
                      onChange={(e) => setMetadata({...metadata, duration: parseInt(e.target.value) || 0})}
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mock Type</Label>
                   <Select value={metadata.mockType} onValueChange={(val: any) => setMetadata({...metadata, mockType: val})}>
                     <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm text-[#0F172A]"><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="FULL">Full Mock</SelectItem>
                        <SelectItem value="SUBJECT">Subject Test</SelectItem>
                        <SelectItem value="SECTIONAL">Sectional</SelectItem>
                        <SelectItem value="PYQ">PYQ Archive</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Paste Institutional Content (Batch 10–500)</Label>
                <Textarea 
                  placeholder={placeholderText}
                  className="min-h-[400px] rounded-[2.5rem] bg-slate-50 border-none p-10 text-sm font-mono leading-relaxed shadow-inner custom-scrollbar text-[#0F172A]"
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                />
              </div>
              
              <Button onClick={handleParse} className="w-full h-20 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] gap-4 rounded-[2rem] shadow-4xl">
                <Zap className="h-6 w-6 text-primary fill-current" /> Structure Nodes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 text-left">
          {parseErrors.length > 0 ? (
            <Card className="border-rose-100 bg-rose-50/50 shadow-3xl rounded-[4rem] p-16 space-y-10">
              <div className="flex items-center gap-6 text-rose-600">
                <FileWarning className="h-16 w-16" />
                <h3 className="text-3xl font-headline font-black uppercase">Ingestion Failed</h3>
              </div>
              <div className="space-y-4">
                {parseErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-rose-100 shadow-xl">
                    <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-1" />
                    <p className="text-base font-bold text-rose-900 leading-tight">{err}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : parsedQuestions.length > 0 ? (
            <Card className="border-none bg-white shadow-4xl rounded-[4rem] h-full flex flex-col overflow-hidden">
               <CardHeader className="p-16 bg-slate-50/50 border-b border-slate-50">
                  <CardTitle className="font-headline font-black text-3xl uppercase flex items-center gap-4 text-[#0F172A]">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" /> Structure Ready ({parsedQuestions.length})
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-16 flex-1 overflow-y-auto custom-scrollbar space-y-16">
                  {parsedQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-10 pb-16 border-b border-slate-100 last:border-0 last:pb-0">
                       <div className="flex items-center justify-between">
                          <Badge className="bg-primary/10 text-primary border-none text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-lg">Audit Node {idx + 1}</Badge>
                          <div className="flex gap-4">
                             <Badge variant="outline" className="text-[10px] font-bold uppercase">{q.difficulty}</Badge>
                             <Badge variant="outline" className="text-[10px] font-bold uppercase">{q.subjectId}</Badge>
                          </div>
                       </div>
                       <QuestionRenderer language="bilingual" question={q} />
                    </div>
                  ))}
               </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-20 py-60">
              <Database className="h-32 w-32 mb-8" />
              <p className="font-headline font-black uppercase tracking-[0.4em] text-xl text-center px-10">Awaiting Ingestion Input<br/><span className="text-sm">Metadata must be selected before structuring.</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Modal */}
      <Dialog open={showMockCreator} onOpenChange={setShowMockCreator}>
        <DialogContent className="sm:max-w-2xl rounded-[3rem] bg-[#0F172A] text-white border-white/10 p-0 overflow-hidden shadow-4xl">
          <div className="p-12 space-y-12">
            <div className="text-center space-y-4">
               <div className="h-20 w-20 bg-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                  <Rocket className="h-10 w-10" />
               </div>
               <h2 className="text-4xl font-headline font-black uppercase tracking-tight">Deploy Active Series</h2>
               <p className="text-slate-400 text-lg font-medium px-10">
                  {parsedQuestions.length} questions successfully saved. Create a live mock series using these nodes immediately?
               </p>
            </div>

            <div className="grid grid-cols-2 gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
               <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Duration</span>
                  <p className="text-2xl font-headline font-black text-primary">{metadata.duration} Mins</p>
               </div>
               <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</span>
                  <p className="text-2xl font-headline font-black text-white">{metadata.mockType} Mock</p>
               </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-4">
               <Button variant="ghost" onClick={() => router.push("/admin/questions")} className="h-14 px-8 rounded-2xl text-slate-400 hover:text-white font-bold uppercase text-[10px] tracking-widest">
                  View in Bank
               </Button>
               <Button onClick={handleDeployMock} className="flex-1 h-16 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-3xl shadow-primary/20 gap-3">
                  <ClipboardCheck className="h-5 w-5" /> Initialize Live Series
               </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
