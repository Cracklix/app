
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save, Trophy, Search, Loader2, X, Image as ImageIcon, GraduationCap } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { SuccessStory } from "@/types"
import { cn } from "@/lib/utils"

export default function SuccessStoryManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const storiesQuery = useMemo(() => (db ? query(collection(db, "success_stories"), orderBy("createdAt", "desc")) : null), [db])
  const { data: stories, loading } = useCollection<SuccessStory>(storiesQuery as any)

  const [editingStory, setEditingStory] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSave = async () => {
    if (!db || !editingStory) return
    if (!editingStory.name || !editingStory.quote) {
       toast({ variant: "destructive", title: "Audit Blocked", description: "Name and Quote are mandatory." })
       return
    }

    setIsSaving(true)
    const id = editingStory.id || `story-${Date.now()}`
    try {
      await setDoc(doc(db, "success_stories", id), {
        ...editingStory,
        id,
        updatedAt: serverTimestamp(),
        createdAt: editingStory.createdAt || serverTimestamp()
      }, { merge: true })
      toast({ title: "Hall of Rankers Synced", description: `${editingStory.name}'s story is live.` })
      setEditingStory(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Permanently remove this success node?")) return
    await deleteDoc(doc(db, "success_stories", id))
    toast({ title: "Story Purged" })
  }

  const filteredStories = useMemo(() => {
    if (!stories) return []
    return stories.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.exam?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [stories, searchTerm])

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Hall of Rankers CMS</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Success Hub</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage student testimonials and official toppers list.</p>
        </div>
        <Button onClick={() => setEditingStory({ name: "", exam: "", rank: "Qualified", year: "2025", quote: "", imageUrl: "https://picsum.photos/seed/topper/400/500", published: true })} className="bg-[#0F172A] hover:bg-black h-16 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl gap-3">
          <Plus className="h-5 w-5" /> Deploy New Story
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-16 h-16 rounded-[1.5rem] bg-white border-none shadow-inner" placeholder="Search toppers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Topper Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Exam & Merit</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={3} className="p-10"><Skeleton className="h-14 w-full rounded-2xl" /></TableCell></TableRow>)
              ) : filteredStories.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50 group border-slate-50 transition-all">
                  <TableCell className="px-10 py-8 text-left">
                     <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-50 shadow-inner group-hover:scale-105 transition-transform border border-slate-100">
                           <img src={s.imageUrl} className="h-full w-full object-cover" />
                        </div>
                        <div>
                           <p className="font-black text-[#0F172A] text-xl uppercase leading-none">{s.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Batch {s.year}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="space-y-1.5">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-3 py-1 uppercase">{s.rank}</Badge>
                        <p className="font-bold text-slate-600 text-sm uppercase flex items-center gap-2">
                           <GraduationCap className="h-3.5 w-3.5 text-primary" /> {s.exam}
                        </p>
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                     <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" onClick={() => setEditingStory(s)}><Edit className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="hover:text-rose-600" onClick={() => handleDelete(s.id)}><Trash2 className="h-5 w-5" /></Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingStory} onOpenChange={o => !o && setEditingStory(null)}>
         <DialogContent className="sm:max-w-xl rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-4">
               <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-4">
                  <Trophy className="h-8 w-8 text-primary" /> Success story Architect
               </DialogTitle>
               <DialogDescription>Modify official student success testimonials.</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Topper Name</Label>
                     <Input value={editingStory?.name || ""} onChange={e => setEditingStory({...editingStory, name: e.target.value})} placeholder="e.g. Amrit Grewal" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Merit / Rank</Label>
                     <Input value={editingStory?.rank || ""} onChange={e => setEditingStory({...editingStory, rank: e.target.value})} placeholder="e.g. Rank 12" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Exam Qualified</Label>
                  <Input value={editingStory?.exam || ""} onChange={e => setEditingStory({...editingStory, exam: e.target.value})} placeholder="e.g. Punjab Police Sub-Inspector" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Batch Year</Label>
                     <Input value={editingStory?.year || "2025"} onChange={e => setEditingStory({...editingStory, year: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Avatar Node (URL)</Label>
                     <Input value={editingStory?.imageUrl || ""} onChange={e => setEditingStory({...editingStory, imageUrl: e.target.value})} className="font-mono text-xs" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Success Abstract (Quote)</Label>
                  <Textarea value={editingStory?.quote || ""} onChange={e => setEditingStory({...editingStory, quote: e.target.value})} className="min-h-[120px]" placeholder="Type toppers feedback..." />
               </div>
            </div>
            <DialogFooter className="p-10 pt-0">
               <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit Topper node"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
