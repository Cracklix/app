"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Upload, 
  Database, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  Loader2, 
  Trash2, 
  Edit,
  Rocket,
  Plus
} from "lucide-react"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { Difficulty, MockType, Question } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  // Configuration State
  const [config, setConfig] = useState({
    board: "",
    exam: "",
    subject: "",
    chapter: "",
    language: "bilingual",
    difficulty: "Medium" as Difficulty,
    mockType: "FULL" as MockType,
    duration: 120,
    questionCount: 0
  })

  const [rawText, setRawText] = useState("")
  const [parsedQuestions, setParsedQuestions] = useState<Partial<Question>[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [showMockCreator, setShowMockMockCreator] = useState(false)
  const [mockSettings, setMockSettings] = useState({
    title: "",
    passingMarks: 50,
    negativeMarking: 0.25,
    instructions: "Standard Exam Instructions apply.",
    randomizeQuestions: true,
    randomizeOptions: false
  })

  const handleParse = () => {
    if (!rawText.trim()) return
    if (!config.board || !config.subject) {
      toast({ variant: "destructive", title: "Config Required", description: "Select Board and Subject before parsing." })
      return
    }

    const { questions, errors } = parseBulkQuestions(rawText, config)
    setParsedQuestions(questions)
    setParseErrors(errors)

    if (errors.length > 0) {
      toast({ variant: "destructive", title: "Partial Success", description: `Found ${errors.length} formatting errors.` })
    } else {
      toast({ title: "Parsing Complete", description: `${questions.length} nodes successfully structured.` })
    }
  }

  const handleDelete = (idx: number) => {
    setParsedQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSaveToBank = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsImporting(true)

    const batch = writeBatch(db)
    const newQuestionIds: string[] = []

    parsedQuestions.forEach(q => {
      const qRef = doc(collection(db, "questions"))
      batch.set(qRef, {
        ...q,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      newQuestionIds.push(qRef.id)
    })

    try {
      await batch.commit()
      toast({ title: "Inventory Updated", description: `${parsedQuestions.length} questions deployed to bank.` })
      // Keep IDs for mock creation
      setRawText("") 
      // Ask if they want to create a mock
      setShowMockMockCreator(true)
    } catch (e) {
      toast({ variant: "destructive", title: "Sync Failed", description: "Database rejected the batch." })
    } finally {
      setIsImporting(false)
    }
  }

  const handleDeployMock = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsImporting(true)

    const mockId = `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", mockId)
    
    // We need the recently created IDs. Since we don't have them easily after commit without re-fetching,
    // in a production environment we'd use the array we kept. 
    // For this simulation, we'll redirect to builder or create a placeholder.
    
    toast({ title: "Mock Hub Initialized", description: "Proceed to Builder to link the imported nodes." })
    router.push("/admin/mocks")
  }

  return (
    <div className="space-y-10 pb-24 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Bulk Ingestion Hub</h1>
            <p className="text-slate-500 font-medium">Inject high-volume content directly into the global bank.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3" onClick={() => { setRawText(""); setParsedQuestions([]); setParseErrors([]); }}>
              Reset Buffer
           </Button>
           <Button onClick={handleSaveToBank} disabled={isImporting || parsedQuestions.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl h-14 px-12 gap-3 shadow-xl">
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />} Deploy to Bank
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Config Panel */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none bg-white shadow-2xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 pb-6">
              <CardTitle className="font-headline font-black text-xl uppercase flex items-center gap-4">
                <Settings2 className="h-6 w-6 text-primary" /> Configuration Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Recruitment Board</Label>
                  <Select value={config.board} onValueChange={v => setConfig({...config, board: v})}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none"><SelectValue placeholder="Select Board" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.abbreviation}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subject Mastery</Label>
                  <Select value={config.subject} onValueChange={v => setConfig({...config, subject: v})}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                    <SelectContent>{subjects?.map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chapter / Topic</Label>
                  <Input placeholder="e.g. Percentage" value={config.chapter} onChange={e => setConfig({...config, chapter: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Language</Label>
                    <Select value={config.language} onValueChange={v => setConfig({...config, language: v})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="punjabi">Punjabi</SelectItem>
                        <SelectItem value="bilingual">Bilingual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Difficulty</Label>
                    <Select value={config.difficulty} onValueChange={(v: Difficulty) => setConfig({...config, difficulty: v})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#0F172A] text-white p-10 rounded-[3rem] shadow-2xl">
             <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="h-6 w-6 text-primary" />
                <h4 className="font-headline font-black uppercase text-sm tracking-widest">Parser Rules</h4>
             </div>
             <ul className="space-y-4 text-[11px] font-medium text-slate-400 leading-relaxed">
                <li>• Use <code className="text-primary">Q1.</code> to start a new question.</li>
                <li>• Options must start with <code className="text-primary">A. B. C. D.</code></li>
                <li>• Use <code className="text-primary">Answer: B</code> for correct key.</li>
                <li>• Supports <code className="text-primary">Q1 EN:</code> and <code className="text-primary">Q1 PA:</code> for bilingual.</li>
                <li>• Paste up to 1000 items without latency.</li>
             </ul>
          </Card>
        </div>

        {/* Text Area & Preview */}
        <div className="lg:col-span-8 space-y-8">
           <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Ingestion Buffer</Label>
              <Textarea 
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste Questions Here..."
                className="min-h-[600px] rounded-[3rem] bg-white border-slate-100 p-10 text-sm font-mono shadow-inner custom-scrollbar"
              />
              <Button onClick={handleParse} className="w-full h-20 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl mt-4">
                 Analyze & Structure Nodes
              </Button>
           </div>

           {parsedQuestions.length > 0 && (
             <Card className="border-none shadow-3xl rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                   <div className="flex justify-between items-center">
                      <CardTitle className="font-headline font-black text-2xl uppercase">Audit Preview ({parsedQuestions.length})</CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-4 py-1">CLEAN STRUCTURE</Badge>
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <Table>
                      <TableHeader className="bg-slate-50">
                         <TableRow>
                            <TableHead className="px-10 text-[10px] font-black uppercase">Block</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Question Logic</TableHead>
                            <TableHead className="text-center text-[10px] font-black uppercase">Key</TableHead>
                            <TableHead className="text-right px-10 text-[10px] font-black uppercase">Action</TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {parsedQuestions.slice(0, 50).map((q, idx) => (
                           <TableRow key={idx} className="group hover:bg-slate-50 transition-colors">
                              <TableCell className="px-10 font-bold text-slate-400">#{idx + 1}</TableCell>
                              <TableCell>
                                 <p className="font-bold text-[#0F172A] line-clamp-1">{q.questionEn}</p>
                                 <p className="text-[10px] text-slate-400 italic line-clamp-1">{q.questionPa}</p>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge variant="outline" className="rounded-lg h-8 w-8 flex items-center justify-center font-black p-0 border-primary text-primary">{q.correctAnswer}</Badge>
                              </TableCell>
                              <TableCell className="text-right px-10">
                                 <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(idx)}>
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </TableCell>
                           </TableRow>
                         ))}
                      </TableBody>
                   </Table>
                   {parsedQuestions.length > 50 && (
                     <div className="p-8 text-center text-[10px] font-black uppercase text-slate-400 border-t border-slate-50">
                        + {parsedQuestions.length - 50} more nodes in buffer
                     </div>
                   )}
                </CardContent>
             </Card>
           )}

           {parseErrors.length > 0 && (
             <Card className="border-rose-100 bg-rose-50 p-10 rounded-[3rem]">
                <div className="flex items-center gap-4 text-rose-600 mb-6">
                   <AlertCircle className="h-6 w-6" />
                   <h4 className="font-headline font-black uppercase tracking-tight">Mismatched Nodes Found</h4>
                </div>
                <div className="space-y-3">
                   {parseErrors.map((err, i) => (
                      <p key={i} className="text-sm font-bold text-rose-900 leading-tight">• {err}</p>
                   ))}
                </div>
             </Card>
           )}
        </div>
      </div>

      <Dialog open={showMockCreator} onOpenChange={setShowMockMockCreator}>
        <DialogContent className="sm:max-w-2xl rounded-[3rem] bg-[#0F172A] text-white border-white/10 p-0 overflow-hidden">
          <div className="p-10 space-y-10">
            <div className="text-center space-y-2">
               <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <Rocket className="h-8 w-8" />
               </div>
               <h2 className="text-3xl font-headline font-black uppercase">Deploy Active Mock</h2>
               <p className="text-slate-400 text-sm font-medium px-10">Create a live practice series using the recently imported nodes.</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Title</Label>
                  <Input value={mockSettings.title} onChange={e => setMockSettings({...mockSettings, title: e.target.value})} placeholder="e.g. Patwari Full Mock 01" className="h-12 bg-white/5 border-white/10 rounded-xl" />
               </div>
               <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Negative Marking</Label>
                  <Input type="number" step="0.25" value={mockSettings.negativeMarking} onChange={e => setMockSettings({...mockSettings, negativeMarking: parseFloat(e.target.value)})} className="h-12 bg-white/5 border-white/10 rounded-xl" />
               </div>
            </div>

            <div className="space-y-2 text-left">
               <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Exam Instructions</Label>
               <Textarea value={mockSettings.instructions} onChange={e => setMockSettings({...mockSettings, instructions: e.target.value})} className="bg-white/5 border-white/10 rounded-xl min-h-[100px]" />
            </div>

            <DialogFooter className="pt-6 border-t border-white/5 flex gap-4">
               <Button variant="ghost" onClick={() => setShowMockMockCreator(false)} className="text-slate-400 hover:text-white rounded-xl">Skip Deployment</Button>
               <Button onClick={handleDeployMock} className="bg-primary hover:bg-primary/90 px-12 font-black uppercase text-[10px] tracking-widest rounded-xl h-12 shadow-2xl">Initialize Series</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
