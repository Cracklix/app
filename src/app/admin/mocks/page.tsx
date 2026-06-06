
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Search, Trash2, Edit, ClipboardList, Layers, Copy, Gem, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, setDoc, serverTimestamp } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Ultimate Mock Management Ledger.
 * Hardened: Verified Firestore instance checks.
 * Mobile: Responsive layout with horizontal scroll tables and compact headers.
 */

export default function MockManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Hardened validation
  const isValidDb = db && typeof db === 'object';

  const mocksQuery = useMemo(() => (isValidDb ? query(collection(db, "mocks")) : null), [isValidDb, db])
  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "boards") : null), [isValidDb, db]))
  const { data: passes } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "passes") : null), [isValidDb, db]))

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks]
      .filter(m => {
        const matchesSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesBoard = boardFilter === "all" || m.boardId === boardFilter
        const matchesType = typeFilter === "all" || m.mockType === typeFilter
        return matchesSearch && matchesBoard && matchesType
      })
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawMocks, searchTerm, boardFilter, typeFilter])

  const handleDelete = async (id: string) => {
    if (!isValidDb || !confirm("Audit: Permanently purge this mock blueprint?")) return
    const mockRef = doc(db, "mocks", id)
    deleteDoc(mockRef)
      .then(() => toast({ title: "Series Purged" }))
      .catch(async () => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: mockRef.path, operation: 'delete' })));
  }

  const handleDuplicate = async (mock: any) => {
    if (!isValidDb) return
    const newId = `mock-${Date.now()}`
    const newMock = {
      ...mock,
      id: newId,
      title: `${mock.title} (Clone)`,
      published: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    await setDoc(doc(db, "mocks", newId), newMock)
    toast({ title: "Module Cloned" })
  }

  const togglePublish = async (id: string, current: boolean) => {
    if (!isValidDb) return
    await setDoc(doc(db, "mocks", id), { published: !current, updatedAt: serverTimestamp() }, { merge: true })
    toast({ title: "Registry Updated" })
  }

  return (
    <div className="space-y-8 md:space-y-12 text-left pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 md:px-4 gap-6 md:gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Institutional Mock Registry</span>
           </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black text-primary uppercase tracking-tight">Mock Manager</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Complete CRUD control for 500+ official patterns.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-orange-600 gap-2 font-black shadow-2xl rounded-xl md:rounded-2xl h-12 md:h-16 px-8 md:px-12 uppercase tracking-widest text-[9px] md:text-[10px] w-full md:auto">
          <Link href="/admin/mocks/builder"><Plus className="h-4 w-4 md:h-5 md:w-5" /> Assemble Blueprint</Link>
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-2xl md:rounded-[3rem] overflow-hidden mx-2 md:mx-4">
        <CardHeader className="p-4 md:p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-[35%]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-12 h-11 md:h-14 rounded-xl md:rounded-2xl bg-white border-slate-100 shadow-inner" placeholder="Search by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full lg:w-auto">
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="flex-1 lg:w-44 rounded-xl h-10 md:h-11 bg-white border-none shadow-sm font-bold text-[10px] md:text-xs">
                  <SelectValue placeholder="Board Hub" />
                </SelectTrigger>
                <SelectContent><SelectItem value="all">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1 lg:w-44 rounded-xl h-10 md:h-11 bg-white border-none shadow-sm font-bold text-[10px] md:text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULL">Full Mocks</SelectItem>
                  <SelectItem value="SECTIONAL">Sectionals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-16 md:h-20">
                <TableHead className="px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Mock Identity</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Access</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Status</TableHead>
                <TableHead className="text-right px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-10 py-6"><Skeleton className="h-14 w-full rounded-xl" /></TableCell></TableRow>
                ))
              ) : mocks.length > 0 ? (
                mocks.map((mock: any) => (
                  <TableRow key={mock.id} className="hover:bg-slate-50 border-slate-50 transition-colors group">
                    <TableCell className="px-6 md:px-10 py-6">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          <ClipboardList className="h-6 w-6 md:h-7 md:w-7 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-[#0F172A] text-base md:text-xl uppercase tracking-tight leading-none truncate">{mock.title}</p>
                          <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                             <Badge variant="outline" className="border-slate-200 text-[7px] font-black uppercase px-2">{mock.boardId}</Badge>
                             <span className="text-[8px] text-slate-400 font-bold uppercase">{mock.totalQuestions} Qs</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge className={cn("border-none text-[8px] font-black uppercase px-2.5 py-1 rounded-lg", mock.accessType === 'FREE' ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-600")}>
                          {mock.accessType}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <button onClick={() => togglePublish(mock.id, mock.published)} className="flex items-center gap-2 md:gap-3 group/status">
                          <div className={cn("h-2 w-2 md:h-2.5 md:w-2.5 rounded-full", mock.published ? 'bg-emerald-500' : 'bg-slate-300')} />
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/status:text-primary">{mock.published ? 'LIVE' : 'DRAFT'}</span>
                       </button>
                    </TableCell>
                    <TableCell className="text-right px-6 md:px-10">
                      <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-xl hover:bg-white hover:text-primary shadow-sm" asChild><Link href={`/mocks/${mock.id}`}><Eye className="h-4 w-4 md:h-5 md:w-5" /></Link></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-xl hover:bg-white hover:text-blue-500 shadow-sm" onClick={() => handleDuplicate(mock)}><Copy className="h-4 w-4 md:h-5 md:w-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={() => handleDelete(mock.id)}><Trash2 className="h-4 w-4 md:h-5 md:w-5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="h-40 text-center opacity-20 uppercase font-black text-[10px]">No mocks detected.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
