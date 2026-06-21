"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, FileText, Download, Save, Search, Layers, Loader2, Landmark } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional PYQ Archive CMS v16.0.
 * UPDATED: Optimized for flat collection architecture and Board/Exam linking.
 */

export default function AdminPYQManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const pyqQuery = useMemo(() => (db ? query(collection(db, "pyqs"), orderBy("year", "desc")) : null), [db])
  const { data: pyqs, loading } = useCollection<any>(pyqQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))

  const [editingPYQ, setEditingPYQ] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!db || !editingPYQ || isSaving) return

    if (!editingPYQ.title || !editingPYQ.pdfUrl || !editingPYQ.examId) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Title, Exam hub, and PDF URL are mandatory." })
      return
    }

    setIsSaving(true)
    const pyqId = editingPYQ.id || `pyq-${Date.now()}`
    const pyqRef = doc(db, "pyqs", pyqId)
    
    const payload = {
      ...editingPYQ,
      id: pyqId,
      updatedAt: serverTimestamp(),
      createdAt: editingPYQ.createdAt || serverTimestamp(),
      year: parseInt(editingPYQ.year) || new Date().getFullYear(),
      status: 'VERIFIED'
    }

    try {
      await setDoc(pyqRef, payload, { merge: true })
      toast({ title: "Archive Updated", description: "Paper node successfully committed to registry." })
      setEditingPYQ(null)
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredPYQs = useMemo(() => {
    if (!pyqs) return []
    return pyqs.filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.examId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [pyqs, searchTerm])

  return (
    <div className="space-y-10 pb-24 text-left pt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Landmark className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Audit Archives</span>
           </div>
          <h1 className="text-4xl md:text-5xl font-black font-headline text-[#0F172A] uppercase tracking-tight leading-none">PYQ Registry</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage authentic previous year papers and official answer keys.</p>
        </div>
        <Button onClick={() => setEditingPYQ({ title: "", boardId: "", examId: "", year: new Date().getFullYear(), pdfUrl: "", isFree: true })} className="bg-[#0F172A] hover:bg-black text-white h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 gap-3 border-none">
          <Plus className="h-5 w-5 text-primary" /> Archive New Paper
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardHeader className="p-8 md:p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-16 h-14 rounded-2xl bg-white border-none shadow-inner text-base font-medium text-[#0F172A]" 
                placeholder="Search archives..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-16">
                <TableHead className="px-10 text-[10px] font-black uppercase text-slate-500">Paper Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500">Vertical Association</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">Year</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-10 py-6"><Skeleton className="h-12 w-full rounded-xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredPYQs.map((p: any) => (
                <TableRow key={p.id} className="hover:bg-slate-50 border-slate-50 transition-all group">
                  <TableCell className="px-10 py-6">
                    <div className="flex items-center gap-5">
                       <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform"><FileText className="h-5 w-5" /></div>
                       <div>
                          <p className="font-black text-[#0F172A] text-lg uppercase tracking-tight leading-none">{p.title}</p>
                          <code className="text-[9px] font-mono text-slate-400 mt-1.5 block uppercase tracking-widest">ID: {p.id.slice(-8)}</code>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <p className="text-sm font-black text-[#0F172A] uppercase leading-none">{exams?.find((e:any) => e.id === p.examId)?.name || p.examId}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{p.boardId || 'OFFICIAL'} HUB</p>
                  </TableCell>
                  <TableCell className="text-center font-headline font-black text-xl text-slate-300 group-hover:text-primary transition-colors">
                     {p.year}
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                       <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl" onClick={() => setEditingPYQ(p)}><Edit className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-rose-50 hover:text-rose-600" onClick={async () => { if(confirm("Purge Paper?")) await deleteDoc(doc(db!, "pyqs", p.id)) }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingPYQ} onOpenChange={(o) => !o && !isSaving && setEditingPYQ(null)}>
        <DialogContent className="sm:max-w-xl rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left flex flex-col">
          <div className="h-2 w-full bg-[#0F172A] shrink-0" />
          <DialogHeader className="p-8 pb-0">
             <DialogTitle className="text-2xl font-black font-headline uppercase text-[#0F172A]">Archive Architect</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Archive Title</Label>
                <Input value={editingPYQ?.title || ""} onChange={e => setEditingPYQ({...editingPYQ, title: e.target.value})} className="h-12 rounded-xl border-slate-200 bg-slate-50 font-bold" placeholder="e.g. Patwari 2025 Solved Paper" />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Target Board</Label>
                   <select value={editingPYQ?.boardId || ""} onChange={e => setEditingPYQ({...editingPYQ, boardId: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none shadow-inner">
                      <option value="">Select Board</option>
                      {boards?.map((b: any) => <option key={b.id} value={b.id}>{b.abbreviation}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Target Exam hub</Label>
                   <select value={editingPYQ?.examId || ""} onChange={e => setEditingPYQ({...editingPYQ, examId: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none shadow-inner">
                      <option value="">Select Hub</option>
                      {exams?.filter((e:any) => !editingPYQ?.boardId || e.boardId === editingNote?.boardId).map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Paper Year</Label>
                   <Input type="number" value={editingPYQ?.year || 2025} onChange={e => setEditingPYQ({...editingPYQ, year: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none text-center font-black" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Public Access</Label>
                   <div className="flex items-center justify-between h-12 px-4 bg-slate-50 rounded-xl">
                      <span className="text-[9px] font-black text-slate-400 uppercase">FREE?</span>
                      <Switch checked={editingPYQ?.isFree} onCheckedChange={v => setEditingPYQ({...editingPYQ, isFree: v})} />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Cloud PDF URL</Label>
                <Input value={editingPYQ?.pdfUrl || ""} onChange={e => setEditingPYQ({...editingPYQ, pdfUrl: e.target.value.trim()})} className="h-12 rounded-xl border-slate-200 bg-slate-50 font-mono text-xs text-primary" placeholder="https://..." />
             </div>
          </div>

          <DialogFooter className="p-8 pt-4 bg-slate-50 flex gap-4 border-t border-slate-100">
             <Button variant="ghost" onClick={() => setEditingPYQ(null)} className="h-14 px-8 font-black uppercase text-[10px] text-slate-400">Discard</Button>
             <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[#0F172A] hover:bg-black text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl gap-3 border-none">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Commit Archive Node
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
