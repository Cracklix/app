
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Edit, Trash2, FileText, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function QuestionBank() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  const { data: questions, loading } = useCollection<any>(useMemo(() => (db ? query(collection(db, "questions"), orderBy("createdAt", "desc")) : null), [db]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const filteredQuestions = useMemo(() => {
    if (!questions) return []
    return questions.filter(q => {
      const matchesSearch = q.questionEn?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           q.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBoard = boardFilter === "all" || q.boardId === boardFilter
      const matchesSubject = subjectFilter === "all" || q.subjectId === subjectFilter
      const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
      return matchesSearch && matchesBoard && matchesSubject && matchesDifficulty
    })
  }, [questions, searchTerm, boardFilter, subjectFilter, difficultyFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this question?")) return
    try {
      await deleteDoc(doc(db, "questions", id))
      toast({ title: "Deleted", description: "Question removed from global bank." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." })
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Global MCQ Bank</h1>
          <p className="text-muted-foreground mt-1">Institutional Audit Mode: Arsh Grewal Management.</p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="gap-2 border-foreground/10 h-12 px-6 rounded-xl font-bold">
            <Link href="/admin/questions/bulk"><FileText className="h-4 w-4" /> Bulk Import</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 gap-2 font-black shadow-xl h-12 px-8 rounded-xl uppercase tracking-widest text-xs">
            <Link href="/admin/questions/add"><Plus className="h-4 w-4" /> Create MCQ</Link>
          </Button>
        </div>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-muted/20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-[40%]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-12 h-14 rounded-2xl bg-background border-none shadow-inner" placeholder="Search by text or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-background border-none w-32"><SelectValue placeholder="Board" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-background border-none w-32"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-background border-none w-32"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
              </Select>
              <Button variant="ghost" className="h-11 rounded-xl" onClick={() => { setSearchTerm(""); setBoardFilter("all"); setSubjectFilter("all"); setDifficultyFilter("all"); }}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5">
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest">Question Statement (EN)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Classification</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Correct</TableHead>
                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={4} className="px-8"><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                ))
              ) : filteredQuestions.map((q: any) => (
                <TableRow key={q.id} className="hover:bg-white/5 group border-white/5 transition-colors">
                  <TableCell className="px-8 py-6 max-w-md">
                    <p className="font-bold text-slate-100 text-sm line-clamp-2 leading-relaxed">{q.questionEn}</p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">ID: {q.id.slice(-6)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <Badge variant="outline" className="text-[8px] font-black uppercase w-fit">{q.boardId}</Badge>
                       <Badge className={`text-[8px] font-black uppercase w-fit border-none ${q.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-500' : q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{q.difficulty}</Badge>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-primary/20 text-primary font-black border-none px-3">{q.correctAnswer}</Badge></TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" asChild><Link href={`/admin/questions/add?id=${q.id}`}><Edit className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:text-rose-500" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
