
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save, Calendar, Search, Loader2, X, Bell } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarEvent } from "@/types"
import { cn } from "@/lib/utils"

export default function CalendarManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const calendarQuery = useMemo(() => (db ? query(collection(db, "exam_calendar"), orderBy("createdAt", "desc")) : null), [db])
  const { data: events, loading } = useCollection<CalendarEvent>(calendarQuery as any)

  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSave = async () => {
    if (!db || !editingEvent) return
    if (!editingEvent.post || !editingEvent.date) {
       toast({ variant: "destructive", title: "Audit Blocked", description: "Post Name and Date are mandatory." })
       return
    }

    setIsSaving(true)
    const id = editingEvent.id || `event-${Date.now()}`
    try {
      await setDoc(doc(db, "exam_calendar", id), {
        ...editingEvent,
        id,
        updatedAt: serverTimestamp(),
        createdAt: editingEvent.createdAt || serverTimestamp()
      }, { merge: true })
      toast({ title: "Registry Synced", description: "Calendar node updated." })
      setEditingEvent(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Permanently purge this calendar node?")) return
    await deleteDoc(doc(db, "exam_calendar", id))
    toast({ title: "Removed from Registry" })
  }

  const filteredEvents = useMemo(() => {
    if (!events) return []
    return events.filter(e => 
      e.post?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.board?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [events, searchTerm])

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Recruitment Registry Hub</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Exam Calendar</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage upcoming recruitment dates and official notifications.</p>
        </div>
        <Button onClick={() => setEditingEvent({ board: "PSSSB", post: "", date: "", status: "Upcoming", type: "Exam", color: "bg-primary", published: true })} className="bg-[#0F172A] hover:bg-black h-16 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl gap-3">
          <Plus className="h-5 w-5" /> Add Calendar Node
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-16 h-16 rounded-[1.5rem] bg-white border-none shadow-inner" placeholder="Search calendar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Recruitment & Board</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scheduled Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4} className="p-10"><Skeleton className="h-14 w-full rounded-2xl" /></TableCell></TableRow>)
              ) : filteredEvents.map((e) => (
                <TableRow key={e.id} className="hover:bg-slate-50 group border-slate-50 transition-all">
                  <TableCell className="px-10 py-8 text-left">
                     <div className="flex items-center gap-6">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", e.color)}>
                           <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                           <p className="font-black text-[#0F172A] text-xl uppercase leading-none">{e.post}</p>
                           <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-400 mt-2">{e.board} HUB</Badge>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell><p className="font-bold text-[#0F172A]">{e.date}</p></TableCell>
                  <TableCell>
                     <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] px-3 py-1 uppercase">{e.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right px-10">
                     <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" onClick={() => setEditingEvent(e)}><Edit className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="hover:text-rose-600" onClick={() => handleDelete(e.id)}><Trash2 className="h-5 w-5" /></Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingEvent} onOpenChange={o => !o && setEditingEvent(null)}>
         <DialogContent className="sm:max-w-xl rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-4">
               <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-primary" /> Calendar Node Architect
               </DialogTitle>
               <DialogDescription>Add or edit official recruitment dates.</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Board</Label>
                     <Input value={editingEvent?.board || ""} onChange={e => setEditingEvent({...editingEvent, board: e.target.value.toUpperCase()})} placeholder="e.g. PSSSB" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Type</Label>
                     <select value={editingEvent?.type || "Exam"} onChange={e => setEditingEvent({...editingEvent, type: e.target.value})} className="w-full h-12 bg-slate-50 rounded-xl px-4 font-bold text-sm">
                        <option value="Exam">Exam</option>
                        <option value="Registration">Registration</option>
                        <option value="Event">Event</option>
                        <option value="Forecast">Forecast</option>
                     </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Post Title</Label>
                  <Input value={editingEvent?.post || ""} onChange={e => setEditingEvent({...editingEvent, post: e.target.value})} placeholder="e.g. Revenue Patwari" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Date String</Label>
                     <Input value={editingEvent?.date || ""} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} placeholder="e.g. 15 Mar 2026" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Status Label</Label>
                     <Input value={editingEvent?.status || ""} onChange={e => setEditingEvent({...editingEvent, status: e.target.value})} placeholder="e.g. Notification Out" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Theme Color (CSS Class)</Label>
                  <Input value={editingEvent?.color || "bg-primary"} onChange={e => setEditingEvent({...editingEvent, color: e.target.value})} className="font-mono text-xs" />
               </div>
            </div>
            <DialogFooter className="p-10 pt-0">
               <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit to Registry"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
