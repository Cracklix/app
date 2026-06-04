
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, FileText, Database, Layers, CheckCircle2, Clock, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, where } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

/**
 * @fileOverview Enterprise Question Bank with Workflow Filtering.
 * Optimized to show only standalone questions (not hidden mock questions).
 * Fixed: Removed orderBy to prevent index errors, handling sorting client-side.
 */

export default function QuestionBank() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [boardFilter, setBoardFilter] = useState("all")
  const [showAllAssets, setShowAllAssets] = useState(false)

  // Simple query to avoid index requirements
  const qQuery = useMemo(() => {
    if (!db) return null
    if (showAllAssets) {
       return query(collection(db, "questions"))
    }
    return query(
      collection(db, "questions"), 
      where("isStandalone", "!=", false)
    )
  }, [db, showAllAssets])

  const { data: allQuestions, loading } = useCollection<any>(qQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return []
    
    // Client-side sorting & filtering
    return allQuestions
      .filter(q => {
        const matchesSearch = (q.questionEn || "").toLowerCase().includes(searchTerm.toLowerCase()) || (q.id || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || q.status === statusFilter
        const matchesBoard = boardFilter === "all" || q.boardId === boardFilter
        return matchesSearch && matchesStatus && matchesBoard
      })
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0
        const dateB = b.createdAt?.seconds || 0
        return dateB - dateA
      })
  }, [allQuestions, searchTerm, statusFilter, boardFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this node from the global bank?")) return
    await deleteDoc(doc(db!, "questions", id))
    toast({ title: "Node Purged", description: "Asset removed from global bank." })
  }

  return (
    <div className="space-y-10 pb-20 text-[#0F172A]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scale Architecture Hub</span>
          </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Enterprise Bank</h1>
          <p className="text-muted-foreground mt-2 text-lg">Managing {allQuestions?.length || 0} Assets. {showAllAssets ? 'Direct Mock items are visible.' : 'Mock-specific items are hidden.'}</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner mr-4">
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black uppercase text-slate-500">Deep Audit</p>
                 <p className="text-[9px] font-bold text-slate-400">Show Mock Questions</p>
              </div>
              <Switch checked={showAllAssets} onCheckedChange={setShowAllAssets} />
           </div>
          <Button asChild className="bg-primary hover:bg-primary/90 gap-3 font-black shadow-2xl h-14 px-10 rounded-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/questions/add"><Plus className="h-5 w-5" /> New Asset</Link>
          </Button>
        </div>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5 bg-muted/20">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative w-full lg:w-[45%]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-14 h-16 rounded-[1.5rem] bg-background border-none shadow-inner" placeholder="Search standalone bank..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-background border-none w-40 shadow-sm"><SelectValue placeholder="Workflow Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="DRAFT">Draft Nodes</SelectItem>
                  <SelectItem value="REVIEW">Pending Audit</SelectItem>
                  <SelectItem value="PUBLISHED">Live Assets</SelectItem>
                </SelectContent>
              </Select>
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-background border-none w-40 shadow-sm"><SelectValue placeholder="Authority" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 text-left">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-white/5 h-16">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset Logic</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Audit Workflow</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Context</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={4} className="px-10 py-8"><Skeleton className="h-14 w-full rounded-2xl bg-white/5" /></TableCell></TableRow>
                ))
              ) : filteredQuestions.length > 0 ? filteredQuestions.map((q: any) => (
                <TableRow key={q.id} className="hover:bg-slate-50 border-white/5 transition-colors group">
                  <TableCell className="px-10 py-8 max-w-lg">
                    <p className="font-bold text-[#0F172A] line-clamp-1">{q.questionEn}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <code className="text-[9px] font-mono text-slate-500">ID: {q.id.slice(-8)}</code>
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{q.boardId} • {q.subjectId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border-none px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      q.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
                      q.status === 'REVIEW' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {q.status || 'DRAFT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-primary shadow-sm">
                           {q.correctAnswer}
                        </div>
                        {q.isStandalone === false ? (
                           <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary bg-primary/5">Mock Node</Badge>
                        ) : (
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Asset</span>
                        )}
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100" asChild>
                        <Link href={`/admin/questions/add?id=${q.id}`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 shadow-sm border border-transparent hover:border-rose-100" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={4} className="h-40 text-center opacity-30 italic text-slate-400 font-bold uppercase text-xs">No standalone questions in bank. Use bulk import to populate.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
