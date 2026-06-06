
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, ChevronLeft, AlertCircle, Settings2, Loader2, Trash2, Zap, Copy, Save, FileCode, DatabaseBackup, CheckCircle2, Rocket, SearchCode } from "lucide-react"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp, getDocs, query, where } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { Difficulty, Question, ContentStatus } from "@/types"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))

  const [metadata, setMetadata] = useState({
    boardId: "",
    examId: "",
    subjectId: "",
    chapterId: "",
    difficulty: "Medium" as Difficulty,
    status: "PUBLISHED" as ContentStatus,
  })

  const [rawText, setRawText] = useState("")
  const [parsedQuestions, setParsedQuestions] = useState<Partial<Question>[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [duplicateCount, setDuplicateCount] = useState(0)

  const handleAnalyze = async () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.subjectId || !metadata.examId) {
      toast({ variant: "destructive", title: "Config Required", description: "Select Board, Exam and Subject before analysis." })
      return
    }

    const { questions, errors, confidence: conf } = parseBulkQuestions(rawText, metadata, subjects || [])
    
    // Simple Collision Detection Hub
    let dupes = 0;
    if (db) {
       const hashes = questions.map(q => q.questionEn?.substring(0, 50).toLowerCase());
       const existingSnap = await getDocs(query(collection(db, "questions"), where("examId", "==", metadata.examId), limit(500)));
       const existingTexts = existingSnap.docs.map(d => d.data().questionEn?.substring(0, 50).toLowerCase());
       dupes = hashes.filter(h => existingTexts.includes(h)).length;
    }

    setParsedQuestions(questions)
    setParseErrors(errors)
    setConfidence(conf)
    setDuplicateCount(dupes)

    if (errors.length > 0) {
      toast({ variant: "destructive", title: "Audit Warnings", description: `Parsed ${questions.length} blocks, but found ${errors.length} errors.` })
    } else if (dupes > 0) {
      toast({ variant: "destructive", title: "Collisions Detected", description: `${dupes} questions appear to already exist in this hub.` })
    } else {
      toast({ title: "Structure Validated", description: `${questions.length} nodes ready for bank sync.` })
    }
  }

  const handleSaveToBank = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsSyncing(true)

    const batch = writeBatch(db)
    parsedQuestions.forEach(q => {
      const qRef = doc(collection(db, "questions"))
      const payload: any = {
        ...q,
        id: qRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isStandalone: true,
        status: metadata.status
      };
      Object.keys(payload).forEach(key => (payload[key] === undefined || payload[key] === null) && delete payload[key]);
      batch.set(qRef, payload)
    })

    try {
      await batch.commit()
      toast({ title: "Bank Sync Success", description: `${parsedQuestions.length} reusable nodes successfully committed.` })
      router.push("/admin/questions")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-10 pb-24 text-left max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm"><ChevronLeft className="h-6 w-6" /></Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Institutional Ingestion</h1>
            <p className="text-slate-500 font-medium">Auto-stripping numbering and generating sequential audit IDs.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={() => { setRawText(""); setParsedQuestions([]); }} className="h-16 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-sm bg-white">
              <DatabaseBackup className="h-5 w-5" /> Reset Buffer
           </Button>
           <Button onClick={handleSaveToBank} disabled={isSyncing || parsedQuestions.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl h-16 px-12 gap-3 shadow-3xl shadow-emerald-900/20">
              {isSyncing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />} Commit to Question Bank
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none bg-white shadow-3xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="font-headline font-black text-2xl uppercase flex items-center gap-4"><Settings2 className="h-6 w-6 text-primary" /> Target Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Board</Label>
                  <Select value={metadata.boardId} onValueChange={v => setMetadata({...metadata, boardId: v, examId: ""})}>
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Exam Hub</Label>
                  <Select value={metadata.examId} onValueChange={v => setMetadata({...metadata, examId: v})}>
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{exams?.filter(e => e.boardId === metadata.boardId).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Subject Node</Label>
                   <Select value={metadata.subjectId} onValueChange={v => setMetadata({...metadata, subjectId: v})}>
                      <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Chapter / Topic</Label>
                   <Input value={metadata.chapterId} onChange={e => setMetadata({...metadata, chapterId: e.target.value})} placeholder="e.g. Ratio" className="h-11 bg-slate-50 border-none rounded-xl font-bold" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {duplicateCount > 0 && (
             <Card className="border-none bg-rose-50 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-lg border border-rose-100">
                <SearchCode className="h-10 w-10 text-rose-500 shrink-0" />
                <div className="text-left">
                   <p className="text-sm font-black text-rose-900 uppercase">Integrity Alert</p>
                   <p className="text-xs font-bold text-rose-600 uppercase mt-1">{duplicateCount} Collisions Detected</p>
                </div>
             </Card>
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Ingestion Buffer (Auto-Sanitized)</Label>
              <Textarea 
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste content with any numbering (1., Q1., Question 1)..."
                className="min-h-[500px] rounded-[3.5rem] bg-white border-none p-12 text-sm font-mono shadow-4xl custom-scrollbar text-[#0F172A]"
              />
              <Button onClick={handleAnalyze} className="w-full h-20 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-4xl mt-6 gap-4">
                 <Zap className="h-6 w-6 text-primary fill-current" /> Clean & Structure Batch
              </Button>
           </div>

           {parsedQuestions.length > 0 && (
             <Card className="border-none shadow-4xl rounded-[4rem] bg-white overflow-hidden text-left">
                <CardHeader className="p-12 border-b border-slate-50 bg-slate-50/30 flex flex-row justify-between items-center">
                   <div className="space-y-2">
                      <CardTitle className="font-headline font-black text-3xl uppercase">Extraction Matrix ({parsedQuestions.length})</CardTitle>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confidence: {confidence}% • Generated IDs: {parsedQuestions[0]?.displayId} onwards</p>
                   </div>
                   <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest">VALIDATED NODES</Badge>
                </CardHeader>
                <CardContent className="p-12 space-y-12 max-h-[800px] overflow-y-auto custom-scrollbar">
                   {parsedQuestions.map((q, idx) => (
                      <div key={idx} className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 space-y-8">
                         <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase px-4 py-1 rounded-lg">Node {q.displayId}</Badge>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500" onClick={() => setParsedQuestions(parsedQuestions.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button>
                         </div>
                         <QuestionRenderer question={q} language="bilingual" />
                      </div>
                   ))}
                </CardContent>
             </Card>
           )}
        </div>
      </div>
    </div>
  )
}
