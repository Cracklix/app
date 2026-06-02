
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
import { FileText, Zap, CheckCircle2, AlertCircle, Database } from "lucide-react"

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
    toast({ title: "Parsing Complete", description: `Detected ${results.length} valid questions.` })
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
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary">Rapid Bulk Parser</h1>
          <p className="text-muted-foreground">Arsh Grewal Engine: Paste documents to auto-generate MCQ bank.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="font-headline text-xl">Paste Document Content</CardTitle>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Standard Format Active</Badge>
              </div>
              <CardDescription>
                Format: Q1. [Text] A. [Opt] B. [Opt] C. [Opt] D. [Opt] Answer: [A/B/C/D] Explanation: [Text]
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Select onValueChange={val => setMetadata({...metadata, subjectId: val})}>
                  <SelectTrigger className="rounded-xl h-12 bg-background/50 border-none shadow-inner">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select onValueChange={val => setMetadata({...metadata, difficulty: val})} defaultValue="Medium">
                  <SelectTrigger className="rounded-xl h-12 bg-background/50 border-none shadow-inner">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy Pattern</SelectItem>
                    <SelectItem value="Medium">Standard Pattern</SelectItem>
                    <SelectItem value="Hard">Advanced Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea 
                placeholder="Paste your MS Word / PDF content here..."
                className="min-h-[400px] rounded-2xl bg-background/30 border-none shadow-inner p-6 text-base font-mono custom-scrollbar"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
              
              <Button 
                onClick={handleParse} 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest gap-2 rounded-2xl shadow-xl shadow-primary/20"
              >
                <Zap className="h-5 w-5" /> Run Auto-Parser
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2rem] h-full flex flex-col">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Database className="h-5 w-5 text-secondary" /> Parser Output
              </CardTitle>
              <CardDescription>Verify structured data before committing to Firestore.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 overflow-y-auto custom-scrollbar space-y-4">
              {parsedQuestions.length === 0 ? (
                <div className="h-80 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground opacity-30">
                  <FileText className="h-12 w-12 mb-4" />
                  <p className="font-bold">No Parsed Data</p>
                </div>
              ) : (
                parsedQuestions.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-background/40 border border-foreground/5 space-y-2">
                    <div className="flex items-center gap-2">
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Valid Q{idx+1}</Badge>
                       <span className="text-[10px] font-black uppercase text-slate-500">Answer: {String.fromCharCode(65 + q.correctAnswer)}</span>
                    </div>
                    <p className="text-xs font-bold line-clamp-2">{q.text}</p>
                  </div>
                ))
              )}
            </CardContent>
            {parsedQuestions.length > 0 && (
               <div className="p-8 border-t border-white/5 bg-muted/20">
                  <Button 
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest gap-2 rounded-2xl shadow-xl shadow-emerald-900/20"
                    onClick={handleImport}
                    disabled={isImporting}
                  >
                    <CheckCircle2 className="h-5 w-5" /> {isImporting ? "Processing..." : `Commit ${parsedQuestions.length} to Bank`}
                  </Button>
               </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
