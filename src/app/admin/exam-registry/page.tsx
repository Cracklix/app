
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  GitMerge, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  Database,
  RefreshCw,
  X,
  Landmark,
  ShieldCheck,
  Trophy
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, doc, deleteDoc, writeBatch, updateDoc, setDoc, serverTimestamp, getDocs, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Exam Master Registry.
 * High-fidelity normalization tool for organizing recruitment hubs.
 */

export default function ExamRegistryPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isMerging, setIsMerging] = useState(false)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [mergeSource, setMergeSource] = useState<string>("")
  const [mergeTarget, setMergeTarget] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [editingExam, setEditingExam] = useState<any>(null)

  const { data: exams, loading } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: questions } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))

  const stats = useMemo(() => {
    if (!exams || !questions) return {}
    const map: Record<string, number> = {}
    questions.forEach((q: any) => {
      if (q.examId) map[q.examId] = (map[q.examId] || 0) + 1
    })
    return map
  }, [exams, questions])

  const filteredExams = useMemo(() => {
    if (!exams) return []
    return exams.filter(e => 
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.boardId?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [exams, searchTerm])

  const handleSaveExam = async () => {
    if (!db || !editingExam.name || !editingExam.boardId) {
      toast({ variant: "destructive", title: "Missing Config", description: "Name and Board are mandatory." })
      return
    }
    setIsSaving(true)
    const id = editingExam.id || editingExam.name.toLowerCase().replace(/\s+/g, '-')
    const examRef = doc(db, "exams", id)
    
    const payload = {
      ...editingExam,
      id,
      updatedAt: serverTimestamp()
    }

    try {
      await setDoc(examRef, payload, { merge: true })
      toast({ title: "Hub Synced", description: `${payload.name} node successfully registered.` })
      setEditingExam(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeepMerge = async () => {
    if (!db || !mergeSource || !mergeTarget || mergeSource === mergeTarget) {
      toast({ variant: "destructive", title: "Invalid Selection", description: "Nodes must be distinct." })
      return
    }

    const sourceExam = exams?.find(e => e.id === mergeSource)
    const targetExam = exams?.find(e => e.id === mergeTarget)
    
    if (!confirm(`CRITICAL AUDIT: Move all content from "${sourceExam.name}" into "${targetExam.name}"? This will update all linked MCQs and Mocks.`)) return

    setIsMerging(true)
    try {
      // 1. Audit Linked Questions
      const qSnap = await getDocs(query(collection(db, "questions"), where("examId", "==", mergeSource)))
      const batch = writeBatch(db)
      qSnap.docs.forEach(d => {
         batch.update(doc(db, "questions", d.id), { examId: mergeTarget, updatedAt: serverTimestamp() })
      })

      // 2. Audit Linked Mocks
      const mSnap = await getDocs(query(collection(db, "mocks"), where("examId", "==", mergeSource)))
      mSnap.docs.forEach(d => {
         batch.update(doc(db, "mocks", d.id), { examId: mergeTarget, updatedAt: serverTimestamp() })
      })

      // 3. Purge Source Hub
      batch.delete(doc(db, "exams", mergeSource))

      await batch.commit()
      toast({ title: "Hub Consolidation Success", description: `Reassigned ${qSnap.size} MCQs to ${targetExam.name}.` })
      setMergeDialogOpen(false)
      setMergeSource("")
      setMergeTarget("")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Merge Rejected", description: e.message })
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <div className="space-y-12 pb-24 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Landmark className="h-6 w-6 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Exam Master Registry</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Master Hubs</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Coordinate recruitment hubs for all Punjab board verticals.</p>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => setMergeDialogOpen(true)} variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 border-slate-200 bg-white">
              <GitMerge className="h-5 w-5 text-emerald-500" /> Normalization Engine
           </Button>
           <Button onClick={() => setEditingExam({ name: "", boardId: "", description: "", category: "STATE" })} className="bg-primary hover:bg-orange-600 h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-2xl">
              <Plus className="h-5 w-5" /> Register New Hub
           </Button>
        </div>
      </div>

      <div className="mx-4 relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
         <Input 
           className="h-16 pl-16 rounded-[1.5rem] bg-white border-none shadow-2xl text-lg font-medium" 
           placeholder="Search exam hubs or boards..." 
           value={searchTerm}
           onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Hub Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recruitment Context</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Audit Stats</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-10 py-8"><Skeleton className="h-12 w-full rounded-2xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredExams.map((e) => (
                <TableRow key={e.id} className="hover:bg-slate-50 border-slate-50 transition-colors group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs shadow-inner">
                          {e.name[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="font-black text-[#0F172A] text-xl uppercase tracking-tight leading-none">{e.name}</p>
                          <code className="text-[9px] font-mono text-slate-400 mt-2 block uppercase tracking-widest">REGISTRY: {e.id}</code>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="bg-white border-slate-100 text-primary text-[8px] font-black uppercase px-2 py-0.5 w-fit">
                           {e.boardId}
                        </Badge>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{e.category || 'General'}</p>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="inline-flex flex-col items-center">
                        <span className="text-2xl font-headline font-black text-[#0F172A]">{stats[e.id] || 0}</span>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Atomic MCQs</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-white shadow-sm" onClick={() => setEditingExam(e)}>
                          <Edit className="h-5 w-5" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={async () => {
                          if (confirm("CRITICAL: Purge this hub node from registry? Linked items will become orphans.")) {
                             await deleteDoc(doc(db!, "exams", e.id))
                             toast({ title: "Registry Node Purged" })
                          }
                       }}>
                          <Trash2 className="h-5 w-5" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Registry Hub Entry Dialog */}
      <Dialog open={!!editingExam} onOpenChange={open => !open && setEditingExam(null)}>
         <DialogContent className="sm:max-w-xl rounded-[2.5rem] bg-white border-none shadow-4xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-0">
               <DialogTitle className="text-2xl font-black font-headline uppercase">Hub Node Registry</DialogTitle>
            </DialogHeader>
            <div className="p-10 space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Canonical Name</label>
                  <Input value={editingExam?.name || ""} onChange={e => setEditingExam({...editingExam, name: e.target.value})} className="h-14 rounded-xl border-slate-100 font-black text-lg text-[#0F172A]" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Recruiting Board</label>
                     <select 
                        value={editingExam?.boardId || ""} 
                        onChange={e => setEditingExam({...editingExam, boardId: e.target.value})} 
                        className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none"
                     >
                        <option value="">Select Board</option>
                        {boards?.map(b => <option key={b.id} value={b.id}>{b.abbreviation}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Vertical Type</label>
                     <select 
                        value={editingExam?.category || "STATE"} 
                        onChange={e => setEditingExam({...editingExam, category: e.target.value})} 
                        className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none"
                     >
                        <option value="STATE">State Level</option>
                        <option value="TEACHING">Teaching Hub</option>
                        <option value="CENTRAL">Central Hub</option>
                     </select>
                  </div>
               </div>
            </div>
            <DialogFooter className="p-10 pt-0 flex gap-4">
               <Button variant="ghost" onClick={() => setEditingExam(null)} className="rounded-xl h-14 font-black uppercase text-[10px]">Cancel Draft</Button>
               <Button onClick={handleSaveExam} disabled={isSaving} className="bg-[#0F172A] hover:bg-black h-14 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest flex-1 shadow-xl">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit Hub to Registry"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Normalization Engine (Merge) */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
         <DialogContent className="sm:max-w-2xl rounded-[3rem] bg-[#0F172A] text-white border-white/10 shadow-4xl p-0 overflow-hidden text-left">
            <div className="p-12 space-y-10">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                     <GitMerge className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                     <h2 className="text-3xl font-headline font-black uppercase">Hub Normalization</h2>
                     <p className="text-slate-400 text-sm font-medium">Consolidate fragmented recruitment nodes into a canonical hub.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  <div className="md:col-span-5 space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Fragment Hub (Merge)</label>
                     <select 
                        value={mergeSource} 
                        onChange={e => setMergeSource(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 outline-none font-bold"
                     >
                        <option value="" className="bg-[#0F172A]">Select Fragment</option>
                        {exams?.map(e => <option key={e.id} value={e.id} className="bg-[#0F172A]">{e.name}</option>)}
                     </select>
                  </div>
                  <div className="md:col-span-1 flex justify-center opacity-30">
                     <ChevronRight className="h-6 w-6" />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                     <label className="text-[10px] font-black uppercase text-primary ml-1">Canonical Hub (Keep)</label>
                     <select 
                        value={mergeTarget} 
                        onChange={e => setMergeTarget(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-primary/30 rounded-2xl px-4 outline-none font-black text-primary shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                     >
                        <option value="" className="bg-[#0F172A]">Select Canonical</option>
                        {exams?.map(e => <option key={e.id} value={e.id} className="bg-[#0F172A]">{e.name}</option>)}
                     </select>
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-rose-500 shrink-0" />
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase">
                     <strong>CRITICAL:</strong> All linked MCQs, mocks, and results from the fragment will be reassigned to the canonical hub. The fragment node will be purged. This action is terminal.
                  </p>
               </div>

               <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setMergeDialogOpen(false)} className="rounded-2xl h-16 px-8 font-black uppercase text-[10px] text-slate-400 hover:text-white">Cancel Audit</Button>
                  <Button onClick={handleDeepMerge} disabled={isMerging || !mergeSource || !mergeTarget} className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl gap-3">
                     {isMerging ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitMerge className="h-5 w-5" />} Execute Consolidation
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  )
}
