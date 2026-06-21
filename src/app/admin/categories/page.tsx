"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save, Layers, Loader2, MoveUp, MoveDown, Image as ImageIcon } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, doc, setDoc, deleteDoc, serverTimestamp, orderBy, updateDoc, increment } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AuthorityLogo } from "@/lib/exam-icons"

export default function CategoryManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db])
  const { data: categories, loading } = useCollection<any>(catQuery)

  const [editingCat, setEditingCat] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!db || !editingCat) return
    if (!editingCat.id || !editingCat.title) {
       toast({ variant: "destructive", title: "Validation Error", description: "ID and Title are mandatory." })
       return
    }

    setIsSaving(true)
    const isNew = !editingCat.updatedAt;
    try {
      await setDoc(doc(db, "categories", editingCat.id), {
        ...editingCat,
        displayOrder: parseInt(editingCat.displayOrder) || 0,
        updatedAt: serverTimestamp()
      }, { merge: true })

      if (isNew) {
        await updateDoc(doc(db, 'settings', 'stats'), {
           totalCategories: increment(1),
           updatedAt: serverTimestamp()
        }).catch(() => {});
      }

      toast({ title: "Registry Synced", description: `${editingCat.title} updated.` })
      setEditingCat(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReorder = async (cat: any, direction: 'up' | 'down') => {
     if (!db || !categories) return;
     const idx = categories.findIndex(c => c.id === cat.id);
     const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
     if (swapIdx < 0 || swapIdx >= categories.length) return;
     
     const otherCat = categories[swapIdx];
     await Promise.all([
        setDoc(doc(db, "categories", cat.id), { displayOrder: otherCat.displayOrder }, { merge: true }),
        setDoc(doc(db, "categories", otherCat.id), { displayOrder: cat.displayOrder }, { merge: true })
     ]);
     toast({ title: "Order Updated" });
  }

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Category Manager</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage top-level official recruitment folders.</p>
        </div>
        <Button onClick={() => setEditingCat({ id: "", title: "", description: "", iconUrl: "", displayOrder: (categories?.length || 0) + 1 })} className="bg-primary hover:bg-orange-600 h-16 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">
          <Plus className="h-5 w-5" /> Deploy New Category
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest">Branding</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Order</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={3} className="p-10"><Skeleton className="h-16 w-full rounded-2xl"/></TableCell></TableRow>
              ) : categories?.map((cat: any, idx: number) => (
                <TableRow key={cat.id} className="hover:bg-slate-50 border-slate-50 transition-all group">
                  <TableCell className="px-10 py-8">
                     <div className="flex items-center gap-6">
                        <AuthorityLogo category={cat} size="lg" className="bg-slate-50 p-2 rounded-xl shadow-inner" />
                        <div>
                           <p className="font-bold text-[#0F172A] text-xl leading-none">{cat.title}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{cat.id}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex flex-col items-center gap-1">
                        <button onClick={() => handleReorder(cat, 'up')} disabled={idx === 0} className="p-1 hover:text-primary disabled:opacity-10"><MoveUp className="h-3 w-3" /></button>
                        <span className="font-black text-slate-300 text-xl">{cat.displayOrder}</span>
                        <button onClick={() => handleReorder(cat, 'down')} disabled={idx === categories.length - 1} className="p-1 hover:text-primary disabled:opacity-10"><MoveDown className="h-3 w-3" /></button>
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                     <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100" onClick={() => setEditingCat(cat)}><Edit className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-rose-50 hover:text-rose-600" onClick={async () => { if(confirm("Purge node?")) await deleteDoc(doc(db!, "categories", cat.id)) }}><Trash2 className="h-5 w-5" /></Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingCat} onOpenChange={o => !o && setEditingCat(null)}>
         <DialogContent className="sm:max-w-xl rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-0">
               <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-4">
                  <AuthorityLogo category={editingCat} size="md" className="bg-primary/10 p-2 rounded-xl" />
                  Category Architect
               </DialogTitle>
               <DialogDescription>Manage official folder nodes.</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Registry ID</Label>
                     <Input 
                        value={editingCat?.id || ""} 
                        onChange={e => setEditingCat({...editingCat, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                        className="h-12 rounded-xl bg-slate-50 border-none font-mono text-xs" 
                        disabled={!!editingCat?.updatedAt} 
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Display Order</Label>
                     <Input type="number" value={editingCat?.displayOrder || ""} onChange={e => setEditingCat({...editingCat, displayOrder: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-black text-center" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Official Name</Label>
                  <Input value={editingCat?.title || ""} onChange={e => setEditingCat({...editingCat, title: e.target.value})} className="h-14 rounded-xl border-slate-100 font-black text-lg" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Logo URL (Official Emblem)</Label>
                  <Input value={editingCat?.iconUrl || ""} onChange={e => setEditingCat({...editingCat, iconUrl: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-mono text-xs text-primary" placeholder="https://..." />
               </div>
            </div>
            <DialogFooter className="p-10 pt-0 bg-slate-50 border-t border-slate-100">
               <Button variant="ghost" onClick={() => setEditingCat(null)} className="h-14 px-8 font-black uppercase text-[10px] text-slate-400">Cancel</Button>
               <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[#0F172A] hover:bg-black text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl gap-3 border-none">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Commit Node
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
