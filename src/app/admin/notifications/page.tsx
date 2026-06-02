"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Send } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

export default function AdminNotifications() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const noticeQuery = useMemo(() => (db ? query(collection(db, "notifications"), orderBy("createdAt", "desc")) : null), [db])
  const { data: notices, loading } = useCollection<any>(noticeQuery)

  const [editingNotice, setEditingNotice] = useState<any>(null)

  const handleSave = () => {
    if (!db || !editingNotice) return
    const noticeId = editingNotice.id || `n-${Date.now()}`
    const noticeRef = doc(db, "notifications", noticeId)
    
    const payload = {
      ...editingNotice,
      id: noticeId,
      createdAt: new Date().toISOString(),
      time: editingNotice.time || "Just now"
    }

    setDoc(noticeRef, payload, { merge: true })
      .then(() => {
        toast({ title: "Broadcast Sent", description: "Notification live for all aspirants." })
        setEditingNotice(null)
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: noticeRef.path,
          operation: 'write',
          requestResourceData: payload,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const handleDelete = (id: string) => {
    if (!confirm("Remove this alert?")) return
    const noticeRef = doc(db, "notifications", id)
    deleteDoc(noticeRef)
      .then(() => {
        toast({ title: "Deleted", description: "Alert removed." })
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: noticeRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Exam Alerts</h1>
          <p className="text-muted-foreground mt-1">Broadcast critical updates about exams, results, and admit cards.</p>
        </div>
        <Button onClick={() => setEditingNotice({ title: "", message: "", type: "alert", time: "Just now" })} className="bg-orange-500 hover:bg-orange-600 gap-2 h-12 px-8 rounded-xl font-bold shadow-xl shadow-orange-500/20">
          <Plus className="h-5 w-5" /> Broadcast Alert
        </Button>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5">
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest">Time</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Message Headline</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Type</TableHead>
                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-8"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                ))
              ) : notices?.map((n: any) => (
                <TableRow key={n.id} className="hover:bg-white/5 group border-white/5 transition-colors">
                  <TableCell className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500">{n.time}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-100">{n.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{n.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                     <Badge className={`${n.type === 'result' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'} border-none text-[9px] font-black uppercase`}>
                       {n.type}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5" onClick={() => setEditingNotice(n)}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => handleDelete(n.id)}>
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

      <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] bg-[#0F172A] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">Broadcast System</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500">Headline</Label>
              <Input value={editingNotice?.title || ""} onChange={e => setEditingNotice({...editingNotice, title: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. PSSSB Clerk Admit Cards Out" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500">Alert Message</Label>
              <Input value={editingNotice?.message || ""} onChange={e => setEditingNotice({...editingNotice, message: e.target.value})} className="bg-white/5 border-white/10" placeholder="Detailed info or direct link..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Display Time</Label>
                <Input value={editingNotice?.time || ""} onChange={e => setEditingNotice({...editingNotice, time: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. 2h ago" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Alert Type</Label>
                <select value={editingNotice?.type || "alert"} onChange={e => setEditingNotice({...editingNotice, type: e.target.value})} className="w-full h-10 rounded-md bg-[#1E293B] border-white/10 text-white text-sm px-3">
                  <option value="alert">General Alert</option>
                  <option value="result">Exam Result</option>
                  <option value="vacancy">New Vacancy</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingNotice(null)} className="text-slate-400">Cancel</Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 px-8 font-bold rounded-xl shadow-xl shadow-orange-500/20">
              <Send className="h-4 w-4 mr-2" /> Deploy Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}