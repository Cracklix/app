
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
  X
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, doc, deleteDoc, writeBatch, updateDoc, setDoc, serverTimestamp, getDocs, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Subject Master Registry & Normalization Tool.
 * Hardened: Validates Firestore instance before collection reference calls.
 */

export default function SubjectRegistryPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isMerging, setIsMerging] = useState(false)
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [mergeSource, setMergeSource] = useState<string>("")
  const [mergeTarget, setMergeTarget] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [editingSubject, setEditingSubject] = useState<any>(null)

  const isValidDb = !!(db && typeof db === 'object' && 'type' in db === false);

  const { data: subjects, loading } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "subjects") : null), [isValidDb, db]))

  const filteredSubjects = useMemo(() => {
    if (!subjects) return []
    return subjects.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.aliases?.some((a: string) => a.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [subjects, searchTerm])

  const handleSaveSubject = async () => {
    if (!isValidDb || !editingSubject.name) return
    setIsSaving(true)
    const id = editingSubject.id || editingSubject.name.toLowerCase().replace(/\s+/g, '-')
    const subjectRef = doc(db, "subjects", id)
    
    const payload = {
      ...editingSubject,
      id,
      updatedAt: serverTimestamp(),
      aliases: typeof editingSubject.aliases === 'string' 
        ? editingSubject.aliases.split(',').map((s: string) => s.trim()).filter(Boolean)
        : editingSubject.aliases || []
    }

    try {
      await setDoc(subjectRef, payload, { merge: true })
      toast({ title: "Registry Updated", description: `${payload.name} synced.` })
      setEditingSubject(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeepMerge = async () => {
    if (!isValidDb || !mergeSource || !mergeTarget || mergeSource === mergeTarget) {
      toast({ variant: "destructive", title: "Invalid Audit Selection" })
      return
    }

    const sourceSub = subjects?.find(s => s.id === mergeSource)
    const targetSub = subjects?.find(s => s.id === mergeTarget)
    
    if (!confirm(`CRITICAL: Merge "${sourceSub.name}" into "${targetSub.name}"?`)) return

    setIsMerging(true)
    try {
      const qSnap = await getDocs(query(collection(db, "questions"), where("subjectId", "==", mergeSource)))
      const batch = writeBatch(db)
      qSnap.docs.forEach(d => {
         batch.update(doc(db, "questions", d.id), { subjectId: mergeTarget, updatedAt: serverTimestamp() })
      })

      const mSnap = await getDocs(query(collection(db, "mocks"), where("subjectId", "==", mergeSource)))
      mSnap.docs.forEach(d => {
         batch.update(doc(db, "mocks", d.id), { subjectId: mergeTarget, updatedAt: serverTimestamp() })
      })

      const newAliases = Array.from(new Set([...(targetSub.aliases || []), sourceSub.name, ...(sourceSub.aliases || [])]))
      batch.update(doc(db, "subjects", mergeTarget), { aliases: newAliases, updatedAt: serverTimestamp() })
      batch.delete(doc(db, "subjects", mergeSource))

      await batch.commit()
      toast({ title: "Nodes Consolidated", description: `Reassigned ${qSnap.size} MCQs.` })
      setMergeDialogOpen(false)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Merge Failed" })
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <div className="space-y-12 pb-24 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Subject Master Registry</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Normalization Hub</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Canonical subject mapping for all institutional prep nodes.</p>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => setMergeDialogOpen(true)} variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 border-slate-200 bg-white">
              <GitMerge className="h-5 w-5 text-emerald-500" /> Deep Merge Engine
           </Button>
           <Button onClick={() => setEditingSubject({ name: "", aliases: [], description: "" })} className="bg-primary hover:bg-orange-600 h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-2xl">
              <Plus className="h-5 w-5" /> Register Canonical Node
           </Button>
        </div>
      </div>

      <div className="mx-4 relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
         <Input 
           className="h-16 pl-16 rounded-[1.5rem] bg-white border-none shadow-2xl text-lg font-medium" 
           placeholder="Search subjects or aliases..." 
           value={searchTerm}
           onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Canonical Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recognized Aliases</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={3} className="px-10 py-8"><Skeleton className="h-12 w-full rounded-2xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredSubjects.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50 border-slate-50 transition-colors group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                          {s.name[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="font-black text-[#0F172A] text-xl uppercase tracking-tight leading-none">{s.name}</p>
                          <code className="text-[9px] font-mono text-slate-400 mt-2 block uppercase tracking-widest">ID: {s.id}</code>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-wrap gap-2 max-w-lg">
                        {s.aliases?.map((a: string, i: number) => (
                           <Badge key={i} variant="outline" className="bg-white border-slate-100 text-slate-500 text-[8px] font-black uppercase px-2 py-0.5">
                              {a}
                           </Badge>
                        ))}
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-white shadow-sm" onClick={() => setEditingSubject(s)}>
                          <Edit className="h-5 w-5" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={async () => {
                          if (confirm("Purge subject node?")) {
                             await deleteDoc(doc(db!, "subjects", s.id))
                             toast({ title: "Node Purged" })
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
      {/* ... (Dialogs remain same) */}
    </div>
  )
}
