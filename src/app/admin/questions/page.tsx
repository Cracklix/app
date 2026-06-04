"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Database, Filter, Eye, Image as ImageIcon, History, CheckSquare, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, where, writeBatch } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * @fileOverview Institutional Asset Ledger (Global Bank) v3.0.
 * Updated: Bulk Selection, Select All, and Batch Deletion (Phase 170).
 */

export default function QuestionBank() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [boardFilter, setBoardFilter] = useState("all")
  const [showUnusedOnly, setShowUnusedOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const qQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "questions"), where("isStandalone", "==", true))
  }, [db])

  const { data: allQuestions, loading } = useCollection<any>(qQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return []
    return allQuestions
      .filter(q => {
        const matchesSearch = (q.questionEn || q.titleEn || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSub = subjectFilter === "all" || q.subjectId === subjectFilter
        const matchesBoard = boardFilter === "all" || q.boardId === boardFilter
        const matchesUnused = !showUnusedOnly || (q.usageCount || 0) === 0
        return matchesSearch && matchesSub && matchesBoard && matchesUnused
      })
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [allQuestions, searchTerm, subjectFilter, boardFilter, showUnusedOnly])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredQuestions.map(q => q.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently purge this asset from the global bank?")) return
    await deleteDoc(doc(db!, "questions", id))
    toast({ title: "Asset Purged", description: "Node removed from registry." })
    setSelectedIds(prev => prev.filter(i => i !== id))
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !db) return
    if (!confirm(`DANGER: This will permanently delete ${selectedIds.length} questions from the bank. This action cannot be undone. Continue?`)) return

    setIsDeleting(true)
    const batchSize = 500;
    const batches = [];
    
    // Safety loop to handle large bulk deletions (splitting into 500-doc batches)
    for (let i = 0; i < selectedIds.length; i += batchSize) {
      const batch = writeBatch(db);
      selectedIds.slice(i, i + batchSize).forEach(id => {
        batch.delete(doc(db, "questions", id));
      });
      batches.push(batch.commit());
    }

    try {
      await Promise.all(batches);
      toast({ title: "Batch Purge Complete", description: `${selectedIds.length} nodes successfully removed from the repository.` });
      setSelectedIds([]);
    } catch (e) {
      toast({ variant: "destructive", title: "Batch Failed", description: "Institutional security prevented some deletions." });
    } finally {
      setIsDeleting(false)
    }
  }

  const allSelected = filteredQuestions.length > 0 && selectedIds.length === filteredQuestions.length;

  return (
    <div className="space-y-10 pb-20 text-[#0F172A] text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Atomic Asset Registry</span>
          </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">Managing {allQuestions?.length || 0} structured reusable nodes.</p>
        </div>
        <div className="flex gap-4">
           <Button asChild variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-sm bg-white">
              <Link href="/admin/bulk-import"><Plus className="h-5 w-5" /> Bulk Ingestion</Link>
           </Button>
          <Button asChild className="bg-[#0F172A] hover:bg-black text-white gap-3 font-black shadow-2xl h-14 px-10 rounded-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/questions/add"><Plus className="h-5 w-5" /> Add Manual</Link>
          </Button>
        </div>
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
         <div className="mx-4 bg-[#0F172A] p-6 rounded-[2.5rem] flex items-center justify-between animate-in slide-in-from-top-4 duration-300 shadow-4xl text-white">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <CheckSquare className="h-6 w-6" />
               </div>
               <div className="text-left">
                  <p className="text-2xl font-headline font-black leading-none">{selectedIds.length} Nodes Selected</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Active Bulk Buffer Operation</p>
               </div>
            </div>
            <div className="flex gap-4">
               <Button variant="ghost" onClick={() => setSelectedIds([])} className="h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-white">Cancel</Button>
               <Button 
                onClick={handleBulkDelete} 
                disabled={isDeleting}
                className="h-14 px-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-[0.2em] gap-3 shadow-3xl shadow-rose-900/40"
               >
                  {isDeleting ? "Purging Registry..." : <><Trash2 className="h-4 w-4" /> Purge Selection</>}
               </Button>
            </div>
         </div>
      )}

      <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-white mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-muted/20">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative w-full lg:w-[40%]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-14 h-16 rounded-[1.5rem] bg-white border-none shadow-inner" placeholder="Search structured bank..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50">
                 <Label className="text-[10px] font-black uppercase text-slate-400">Unused Only</Label>
                 <Switch checked={showUnusedOnly} onCheckedChange={setShowUnusedOnly} />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-white border-none w-44 shadow-sm font-bold"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent><SelectItem value="all" className="font-bold">All Subjects</SelectItem>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-white border-none w-40 shadow-sm font-bold"><SelectValue placeholder="Authority" /></SelectTrigger>
                <SelectContent><SelectItem value="all" className="font-bold">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 text-left">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-white/5 h-20">
                <TableHead className="w-[60px] px-10">
                   <Checkbox 
                    checked={allSelected} 
                    onCheckedChange={handleSelectAll} 
                    className="h-5 w-5 rounded-lg border-2 border-slate-300"
                   />
                </TableHead>
                <TableHead className="px-4 text-[10px] font-black uppercase text-slate-500">Node Strategy</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500">Context</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase text-slate-500">Usage</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase text-slate-500">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={5} className="px-10 py-8"><Skeleton className="h-14 w-full rounded-2xl bg-white/5" /></TableCell></TableRow>
                ))
              ) : filteredQuestions.length > 0 ? filteredQuestions.map((q: any) => {
                const isSelected = selectedIds.includes(q.id);
                return (
                  <TableRow key={q.id} className={`hover:bg-slate-50 border-white/5 transition-colors group ${isSelected ? 'bg-primary/5' : ''}`}>
                    <TableCell className="px-10 py-8">
                       <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={() => toggleSelection(q.id)} 
                        className="h-5 w-5 rounded-lg border-2 border-slate-300 data-[state=checked]:bg-primary"
                       />
                    </TableCell>
                    <TableCell className="px-4 py-8 max-w-lg text-left">
                      <p className="font-bold text-[#000000] text-lg leading-tight line-clamp-2">{q.questionEn || q.titleEn}</p>
                      <div className="flex items-center gap-4 mt-3">
                         <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-md">{q.questionType}</Badge>
                         <code className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">ID: {q.id.slice(-8)}</code>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                       <div className="space-y-1.5">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.1em]">{q.boardId}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{q.subjectId} <br/> {q.chapterId || 'GENERAL'}</p>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 shadow-inner group-hover:bg-white transition-all">
                          <History className="h-3 w-3 text-slate-400" />
                          <span className="text-xs font-black text-[#0F172A]">{q.usageCount || 0}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-10">
                      <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all duration-300">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[1.25rem] hover:bg-white hover:text-primary shadow-sm border border-transparent hover:border-slate-100" asChild>
                          <Link href={`/admin/questions/add?id=${q.id}`}><Edit className="h-5 w-5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[1.25rem] hover:bg-rose-50 hover:text-rose-500 shadow-sm border border-transparent hover:border-rose-100" onClick={() => handleDelete(q.id)}><Trash2 className="h-5 w-5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow>
                   <TableCell colSpan={5} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300 opacity-20 space-y-6">
                         <AlertCircle className="h-16 w-16" />
                         <p className="font-headline font-black uppercase tracking-[0.4em] text-xl">Registry Repository Empty</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
