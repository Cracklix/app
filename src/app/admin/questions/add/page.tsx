
"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, Languages } from "lucide-react"
import { useFirestore, useDoc, useCollection } from "@/firebase"
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function QuestionEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const db = useFirestore()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const questionId = searchParams.get("id")
  const isEditing = !!questionId

  const { data: existingData } = useDoc(useMemo(() => (db && questionId ? doc(db, "questions", questionId) : null), [db, questionId]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [formData, setFormData] = useState({
    boardId: "", examId: "", subjectId: "", difficulty: "medium",
    questionEn: "", questionPa: "",
    optionAEn: "", optionAPa: "", optionBEn: "", optionBPa: "",
    optionCEn: "", optionCPa: "", optionDEn: "", optionDPa: "",
    correctAnswer: "A", explanationEn: "", explanationPa: ""
  })

  useEffect(() => {
    if (existingData) setFormData({ ...existingData })
  }, [existingData])

  const handleSave = () => {
    if (!db) return
    if (!formData.questionEn || !formData.subjectId || !formData.boardId) {
      toast({ variant: "destructive", title: "Validation Error", description: "All classification metadata and English statement required." })
      return
    }

    setIsSaving(true)
    const finalId = questionId || `q-${Date.now()}`
    const questionRef = doc(db, "questions", finalId)
    const payload = { 
      ...formData, 
      id: finalId, 
      createdAt: isEditing ? (existingData?.createdAt || serverTimestamp()) : serverTimestamp(),
      author: "Arsh Grewal"
    }

    setDoc(questionRef, payload, { merge: true })
      .then(() => {
        toast({ title: isEditing ? "Bank Updated" : "Bank Committed", description: "Question successfully audited and saved." })
        router.push("/admin/questions")
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({ path: questionRef.path, operation: isEditing ? "update" : "create", requestResourceData: payload })
        errorEmitter.emit("permission-error", permissionError)
      })
      .finally(() => setIsSaving(false))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 border border-foreground/5 bg-card/30" onClick={() => router.back()}><ChevronLeft className="h-6 w-6" /></Button>
          <div>
            <h1 className="text-3xl font-black font-headline text-primary uppercase">{isEditing ? "Audit MCQ" : "Manual Composition"}</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Audit Mode: Arsh Grewal Management</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-3 font-black px-10 h-14 shadow-xl rounded-2xl" onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4" /> {isSaving ? "Syncing..." : "Commit to Bank"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Tabs defaultValue="english" className="w-full">
            <div className="flex items-center justify-between mb-4">
               <Label className="text-xs font-black uppercase text-muted-foreground ml-1">Language Logic</Label>
               <TabsList className="bg-slate-100 rounded-xl p-1">
                  <TabsTrigger value="english" className="rounded-lg gap-2 text-xs font-bold"><Languages className="h-3 w-3" /> English</TabsTrigger>
                  <TabsTrigger value="punjabi" className="rounded-lg gap-2 text-xs font-bold"><Languages className="h-3 w-3" /> Punjabi</TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="english" className="space-y-6">
               <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem]">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">Statement (EN)</Label><Textarea value={formData.questionEn} onChange={e => setFormData({...formData, questionEn: e.target.value})} className="min-h-[120px] rounded-2xl bg-background/50 border-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                       {['A','B','C','D'].map(opt => (
                         <div key={opt} className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">Option {opt}</Label><Input value={(formData as any)[`option${opt}En`]} onChange={e => setFormData({...formData, [`option${opt}En`]: e.target.value})} className="rounded-xl bg-background/50 border-none" /></div>
                       ))}
                    </div>
                    <div className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">Explanation (EN)</Label><Textarea value={formData.explanationEn} onChange={e => setFormData({...formData, explanationEn: e.target.value})} className="rounded-2xl bg-background/50 border-none" /></div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="punjabi" className="space-y-6">
               <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem]">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">ਪ੍ਰਸ਼ਨ (PA)</Label><Textarea value={formData.questionPa} onChange={e => setFormData({...formData, questionPa: e.target.value})} className="min-h-[120px] rounded-2xl bg-background/50 border-none font-medium" /></div>
                    <div className="grid grid-cols-2 gap-4">
                       {['A','B','C','D'].map(opt => (
                         <div key={opt} className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">ਵਿਕਲਪ {opt}</Label><Input value={(formData as any)[`option${opt}Pa`]} onChange={e => setFormData({...formData, [`option${opt}Pa`]: e.target.value})} className="rounded-xl bg-background/50 border-none font-medium" /></div>
                       ))}
                    </div>
                    <div className="space-y-2"><Label className="text-xs font-black uppercase text-slate-500">ਵਿਆਖਿਆ (PA)</Label><Textarea value={formData.explanationPa} onChange={e => setFormData({...formData, explanationPa: e.target.value})} className="rounded-2xl bg-background/50 border-none font-medium" /></div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4 space-y-6 pt-10">
          <Card className="border-foreground/5 bg-card/50 shadow-xl rounded-[2rem]">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase">Authority & Exam</Label>
                <Select value={formData.boardId} onValueChange={val => setFormData({...formData, boardId: val})}>
                  <SelectTrigger className="rounded-xl h-11 bg-background border-none shadow-sm"><SelectValue placeholder="Select Board" /></SelectTrigger>
                  <SelectContent>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={formData.examId} onValueChange={val => setFormData({...formData, examId: val})}>
                  <SelectTrigger className="rounded-xl h-11 bg-background border-none shadow-sm"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                  <SelectContent>{exams?.filter(e => e.boardId === formData.boardId).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-4 pt-4">
                <Label className="text-[10px] font-black uppercase">Subject & Level</Label>
                <Select value={formData.subjectId} onValueChange={val => setFormData({...formData, subjectId: val})}>
                  <SelectTrigger className="rounded-xl h-11 bg-background border-none shadow-sm"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                  <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={formData.difficulty} onValueChange={val => setFormData({...formData, difficulty: val as any})}>
                  <SelectTrigger className="rounded-xl h-11 bg-background border-none shadow-sm"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="easy">Easy Level</SelectItem><SelectItem value="medium">Medium Level</SelectItem><SelectItem value="hard">Hard Level</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <Label className="text-[10px] font-black uppercase">Institutional Answer Key</Label>
                <RadioGroup value={formData.correctAnswer} onValueChange={val => setFormData({...formData, correctAnswer: val as any})} className="grid grid-cols-2 gap-3">
                  {['A','B','C','D'].map(opt => (
                    <div key={opt} className={`flex items-center gap-2 p-3 rounded-xl border ${formData.correctAnswer === opt ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                      <RadioGroupItem value={opt} id={`key-${opt}`} /><Label htmlFor={`key-${opt}`} className="font-bold cursor-pointer">Option {opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
