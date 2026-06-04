"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions, ImportFormat } from "@/lib/parser"
import { Zap, Database, ChevronLeft, Rocket, CheckCircle2, FileWarning, AlertTriangle, LayoutList, Settings2, Eye, DatabaseBackup } from "lucide-react"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

/**
 * @fileOverview Institutional Content Extraction Engine.
 * Supports Tagged Bilingual (ENG_Q, PUN_Q) and OCR formats.
 */

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [rawText, setRawText] = useState("")
  const [importFormat, setImportFormat] = useState<ImportFormat>("BILINGUAL_MCQ")
  const [metadata, setMetadata] = useState({
    boardId: "",
    examId: "",
    subjectId: "",
    topicId: "",
    difficulty: "Medium" as any,
    status: "PUBLISHED" as any
  })
  
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleParse = () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.subjectId) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Select Board and Subject first." })
      return
    }
    
    const results = parseBulkQuestions(rawText, importFormat, { ...metadata })
    
    if (results.errors.length > 0) {
      setParseErrors(results.errors)
      setParsedQuestions([])
      toast({ variant: "destructive", title: "Template Match Failed", description: "Audit failed. Correct markers in the text." })
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

    parsedQuestions.forEach(q => {
      const newRef = doc(collection(db, "questions"))
      batch.set(newRef, {
        ...q,
        id: newRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    })

    try {
      await batch.commit()
      toast({ title: "Bank Updated", description: `${parsedQuestions.length} nodes deployed.` })
      router.push("/admin/questions")
    } catch (e) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'questions/bulk', operation: 'write' }));
    } finally {
      setIsImporting(false)
    }
  }

  const placeholderText = `[BLOCK_ID: Q71]
ENG_Q: Enter English Question Here?
PUN_Q: ਪੰਜਾਬੀ ਸਵਾਲ ਇੱਥੇ ਦਰਜ ਕਰੋ?
ENG_OPT: A. Opt 1 | B. Opt 2 | C. Opt 3 | D. Opt 4
PUN_OPT: A. ਵਿਕਲਪ 1 | B. ਵਿਕਲਪ 2 | C. ਵਿਕਲਪ 3 | D. ਵਿਕਲਪ 4
ENG_ANS: B
ENG_EXP: Detailed explanation here.
PUN_EXP: ਵਿਸਤ੍ਰਿਤ ਵਿਆਖਿਆ ਇੱਥੇ.`;

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto text-[#0F172A]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border border-slate-200 bg-white h-14 w-14 shadow-sm">
            <ChevronLeft className="h-8 w-8 text-[#0F172A]" />
          </Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Bulk Ingestion</h1>
            <p className="text-slate-500 font-medium">Tagged Bilingual (ENG_Q, PUN_Q) and OCR Support.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8 text-left">
          <Card className="border-none bg-white shadow-3xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="font-headline font-black text-2xl uppercase flex items-center gap-4">
                <Settings2 className="h-6 w-6 text-primary" /> Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-slate-500 ml-1">Board</p>
                  <Select value={metadata.boardId} onValueChange={val => setMetadata({...metadata, boardId: val})}>
                    <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm"><SelectValue placeholder="Select Board" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-black uppercase text-slate-500 ml-1">Subject</p>
                   <Select value={metadata.subjectId} onValueChange={val => setMetadata({...metadata, subjectId: val})}>
                     <SelectTrigger className="rounded-xl bg-slate-50 border-none h-14 font-bold text-sm"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                     <SelectContent>{subjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-primary ml-1 flex items-center gap-2"><LayoutList className="h-3 w-3" /> Parser Logic</p>
                <Select value={importFormat} onValueChange={(val: any) => setImportFormat(val)}>
                  <SelectTrigger className="rounded-xl bg-primary/5 border-primary/20 h-14 font-black uppercase text-[10px] tracking-widest"><SelectValue placeholder="Select Format" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BILINGUAL_MCQ">Line-Based / Tagged (ENG_Q/PUN_Q)</SelectItem>
                    <SelectItem value="OCR_COLUMNAR">OCR Columnar (Layout-Aware)</SelectItem>
                    <SelectItem value="STANDARD_MCQ">Standard Text (Q1, 1.)</SelectItem>
                    <SelectItem value="STRUCTURED_JSON">API JSON Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Paste Content (Tagged Format Recommended)</Label>
                <Textarea 
                  placeholder={placeholderText}
                  className="min-h-[500px] rounded-[2.5rem] bg-slate-50 border-none p-10 text-sm font-mono leading-relaxed shadow-inner custom-scrollbar"
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                />
              </div>
              
              <Button onClick={handleParse} className="w-full h-24 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] gap-4 rounded-[2rem] shadow-4xl">
                <Zap className="h-6 w-6 text-primary fill-current" /> Run Ingestion Engine
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 text-left">
          {parseErrors.length > 0 ? (
            <Card className="border-rose-100 bg-rose-50/50 shadow-3xl rounded-[4rem] p-16 space-y-10">
              <div className="flex items-center gap-6 text-rose-600">
                <FileWarning className="h-16 w-16" />
                <div>
                   <h3 className="text-3xl font-headline font-black uppercase">Audit Failed</h3>
                   <p className="text-sm font-bold uppercase tracking-widest opacity-70">{parseErrors.length} Errors Found</p>
                </div>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {parseErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-rose-100 shadow-xl">
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
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" /> Extraction Ready
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-16 flex-1 overflow-y-auto custom-scrollbar space-y-16">
                  {parsedQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-10 pb-16 border-b border-slate-100 last:border-0 last:pb-0">
                       <Badge className="bg-primary/10 text-primary border-none text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-lg">Audit Node {idx + 1}</Badge>
                       <QuestionRenderer language="bilingual" question={q} />
                       <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Logic Output</p>
                          <p className="font-bold text-emerald-900 mt-1">Answer: {q.correctAnswer}</p>
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-20 py-60">
              <Database className="h-32 w-32 mb-8" />
              <p className="font-headline font-black uppercase tracking-[0.4em] text-xl">Awaiting Ingestion Input</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
