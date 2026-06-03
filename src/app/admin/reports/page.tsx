
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, ExternalLink, Trash2, ShieldAlert, Clock, User, Layers } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileOverview Phase 105: Institutional Content Audit Node.
 * Manages aspirant reports on question accuracy and logic.
 */

export default function AdminReports() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const reportsQuery = useMemo(() => (db ? query(collection(db, "reports"), orderBy("timestamp", "desc")) : null), [db])
  const { data: reports, loading } = useCollection<any>(reportsQuery)

  const handleResolve = async (id: string) => {
    if (!db) return
    await updateDoc(doc(db, "reports", id), { status: 'RESOLVED' })
    toast({ title: "Audit Resolved", description: "The content report has been marked as audited and corrected." })
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Permanently delete this audit record?")) return
    await deleteDoc(doc(db, "reports", id))
    toast({ title: "Record Purged", description: "Report record removed from queue." })
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Quality Assurance Registry</span>
          </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Audit Queue</h1>
          <p className="text-muted-foreground mt-2 text-lg">Review and correct aspirant reports regarding institutional MCQ accuracy.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center gap-6 shadow-2xl">
              <div className="space-y-0.5">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pending Audits</span>
                 <p className="text-4xl font-headline font-black text-rose-500 leading-none">{reports?.filter((r: any) => r.status === 'PENDING').length || 0}</p>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <Layers className="h-8 w-8 text-slate-700" />
           </div>
        </div>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[3.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5 h-20">
                <TableHead className="px-12 text-[10px] font-black uppercase tracking-[0.3em]">Aspirant & Issue</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Comment</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Context</TableHead>
                <TableHead className="text-right px-12 text-[10px] font-black uppercase tracking-[0.3em]">Audit Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-12 py-10"><Skeleton className="h-20 w-full rounded-[2rem] bg-white/5" /></TableCell></TableRow>
                ))
              ) : reports && reports.length > 0 ? (
                reports.map((r: any) => (
                  <TableRow key={r.id} className={`hover:bg-white/5 group border-white/5 transition-all duration-500 ${r.status === 'RESOLVED' ? 'opacity-40 grayscale-[0.8]' : ''}`}>
                    <TableCell className="px-12 py-12">
                       <div className="space-y-4">
                          <Badge className={`border-none text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl shadow-lg ${
                            r.type === 'WRONG_ANS' ? 'bg-rose-500/20 text-rose-500' :
                            r.type === 'TYPO' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {r.type?.replace('_', ' ') || 'Audit Flag'}
                          </Badge>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                             <User className="h-4 w-4" /> Aspirant NODE: {r.userId?.slice(-6)}
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="max-w-md py-12">
                       <div className="bg-white/[0.04] p-8 rounded-[2rem] border border-white/5 shadow-inner">
                          <p className="text-lg font-medium text-slate-200 leading-relaxed italic antialiased">"{r.comment}"</p>
                       </div>
                    </TableCell>
                    <TableCell className="py-12">
                       <div className="space-y-6">
                          <Button variant="ghost" asChild className="h-14 px-8 rounded-2xl gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all border-2 border-primary/20 shadow-2xl">
                             <Link href={`/admin/questions/add?id=${r.questionId}`}>
                                <ExternalLink className="h-5 w-5" /> Audit Global Repository
                             </Link>
                          </Button>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
                             <Clock className="h-4 w-4" /> {new Date(r.timestamp?.seconds * 1000).toLocaleString()}
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-12 py-12">
                       <div className="flex justify-end gap-4 opacity-30 group-hover:opacity-100 transition-all duration-700">
                          {r.status === 'PENDING' && (
                            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl text-emerald-500 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 shadow-xl" onClick={() => handleResolve(r.id)}>
                               <CheckCircle2 className="h-7 w-7" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 shadow-xl" onClick={() => handleDelete(r.id)}>
                             <Trash2 className="h-7 w-7" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={4} className="h-[450px] text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500 opacity-20">
                         <ShieldAlert className="h-32 w-32 mb-10" />
                         <p className="font-black font-headline text-3xl uppercase tracking-[0.2em]">Institutional Integrity High</p>
                         <p className="text-lg font-bold uppercase tracking-[0.3em] mt-4">Zero pending flags in the global audit registry.</p>
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
