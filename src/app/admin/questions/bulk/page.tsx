
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { FileText, Zap, CheckCircle2, AlertCircle, Database, ChevronLeft } from "lucide-react"

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [rawText, setRawText] = useState("")
  const [metadata, setMetadata] = useState({
    subjectId: "",
    difficulty: "Medium" as any
  })
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleParse = () => {
    if (!rawText.trim()) return
    const results = parseBulkQuestions(rawText, metadata)
    setParsedQuestions(results)
    if (results.length > 0) {
      toast({ title: "Parsing Complete", description: `Detected ${results.length} valid MCQs.` })
    } else {
      toast({ variant: "destructive", title: "Parsing Failed", description: "Could not identify any questions in standard format." })
    }
  }

  const handleImport = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsImporting(true)

    try {
      const batch = writeBatch(db)
      parsedQuestions.forEach(q => {
        const newRef = doc(collection(db, "questions"))
        batch.set(newRef, {
          ...q,
          id: newRef.id,
          createdAt: serverTimestamp(),
          author: "Arsh Grewal"
        })
      })

      await batch.commit()
      toast({ title: "Import Successful", description: `${parsedQuestions.length} questions added to global bank.` })
      router.push("/admin/questions")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Import Failed", description: e.message })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl border border-foreground/5 bg-card/30">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black font-headline text-primary uppercase tracking-tight">Institutional Bulk Import</h1>
          <p className="text-muted-foreground">Arsh Grewal Access: Scale the MCQ repository at high speed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-8">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="font-headline text-xl">MCQ Paste Engine</CardTitle>
                <Badge className="bg-primary text-white border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest">Speed Mode</Badge>
              </div>
              <CardDescription className="text-slate-400">
                Paste content from Word/PDF. <br/>
                Format: Q1. [Text] A. [Op] B. [Op] C. [Op] D. [Op] Answer: [A/B/C/D] Explanation: [Text]
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Target Subject</p>
                  <Select onValueChange={val => setMetadata({...metadata, subjectId: val})}>
                    <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Pattern Difficulty</p>
                  <Select onValueChange={val => setMetadata({...metadata, difficulty: val})} defaultValue="Medium">
                    <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy Pattern</SelectItem>
                      <SelectItem value="Medium">Standard Pattern</SelectItem>
                      <SelectItem value="Hard">Advanced Pattern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Textarea 
                placeholder="Paste MCQ blocks here... (e.g. Q1. What is... A. B. C. D. Answer: B)"
                className="min-h-[450px] rounded-[2rem] bg-background/50 border-none shadow-inner p-8 text-base leading-relaxed focus:bg-background transition-all custom-scrollbar font-mono"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
              
              <Button 
                onClick={handleParse} 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] gap-3 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1"
              >
                <Zap className="h-5 w-5" /> Run Extraction Engine
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-foreground/5 bg-card/30 backdrop-blur-sm shadow-2xl rounded-[2.5rem] h-full flex flex-col">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" /> Extraction Results
              </CardTitle>
              <CardDescription>Verified structured data awaiting commit.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 overflow-y-auto custom-scrollbar space-y-4">
              {parsedQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-20 py-20">
                  <FileText className="h-16 w-16 mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Waiting for Parse</p>
                </div>
              ) : (
                parsedQuestions.map((q, idx) => (
                  <div key={idx} className="p-6 rounded-[1.5rem] bg-background border border-foreground/5 space-y-3 group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest">Valid MCQ Q{idx+1}</Badge>
                       <span className="text-[10px] font-black text-slate-500">Correct: {String.fromCharCode(65 + q.correctAnswer)}</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed line-clamp-3 text-slate-700">{q.text}</p>
                  </div>
                ))
              )}
            </CardContent>
            {parsedQuestions.length > 0 && (
               <div className="p-8 border-t border-white/5 bg-muted/20 rounded-b-[2.5rem]">
                  <Button 
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest gap-2 rounded-2xl shadow-xl shadow-emerald-900/20"
                    onClick={handleImport}
                    disabled={isImporting}
                  >
                    <CheckCircle2 className="h-5 w-5" /> {isImporting ? "Processing Batch..." : `Commit ${parsedQuestions.length} Items to Bank`}
                  </Button>
               </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
