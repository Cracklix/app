"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Save, Search, Sparkles, FileText, Zap, TrendingUp, FileStack, Loader2, X, Link as LinkIcon, Newspaper } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Free Hub CMS v6.0 (PWA Overhaul).
 * FIXED: Removed all uppercase headers and implemented high-density Title Case.
 */

export default function AdminFreeContent() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const contentQuery = useMemo(() => (db ? query(collection(db, "free_content"), orderBy("updatedAt", "desc")) : null), [db])
  const { data: content, loading } = useCollection<any>(contentQuery)

  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (editingItem && !editingItem.id && editingItem.title) {
       const slug = editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
       if (editingItem.slug !== slug) {
          setEditingItem({ ...editingItem, slug });
       }
    }
  }, [editingItem]);

  const handleSave = async () => {
    if (!db || !editingItem) return
    if (!editingItem.title || !editingItem.type) {
       toast({ variant: "destructive", title: "Audit Blocked", description: "Title and Type are mandatory." })
       return
    }

    const id = editingItem.id || `free-${Date.now()}`
    const docRef = doc(db, "free_content", id)
    
    const payload = {
      ...editingItem,
      id,
      updatedAt: serverTimestamp(),
      createdAt: editingItem.createdAt || serverTimestamp()
    }

    try {
      await setDoc(docRef, payload, { merge: true })
      toast({ title: "Registry Synced", description: "Content successfully updated in Free Hub." })
      setEditingItem(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save Failed", description: e.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently purge this item from Free Hub?")) return
    await deleteDoc(doc(db!, "free_content", id))
    toast({ title: "Removed", description: "Item purged from cloud registry." })
  }

  const filteredContent = useMemo(() => {
    if (!content) return []
    return content.filter(c => 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [content, searchTerm])

  return (
    <div className="space-y-6 md:space-y-12 pb-24 text-left animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div className="space-y-1">
           <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Free Content Master Registry</span>
           </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#0F172A] tracking-tight">Free Hub CMS</h1>
          <p className="text-slate-500 text-[11px] md:text-lg font-medium">Coordinate mocks, notes, and analysis for the public feed.</p>
        </div>
        <Button onClick={() => setEditingNote({ title: "", description: "", slug: "", type: "note", link: "", fileUrl: "" })} className="w-full md:w-auto h-11 md:h-14 px-10 bg-primary hover:bg-blue-700 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl border-none active:scale-95 gap-3">
          <Plus className="h-5 w-5" /> Initialize Free Content
        </Button>
      </div>

      <div className="mx-1 relative group max-w-2xl">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
         <Input 
           className="h-14 md:h-16 pl-14 rounded-full bg-white border-slate-50 shadow-inner text-base md:text-lg font-bold" 
           placeholder="Search free repository..." 
           value={searchTerm}
           onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <Card className="border-none shadow-xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-white mx-1 border border-slate-50">
        <CardContent className="p-0 text-left overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-14 md:h-20">
                <TableHead className="px-6 md:px-12 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Identity</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Hub Type</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">URL / Slug</TableHead>
                <TableHead className="text-right px-6 md:px-12 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50"><TableCell colSpan={4} className="px-6 py-6 md:px-12 md:py-10"><Skeleton className="h-10 w-full rounded-xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredContent.map((item) => (
                <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50 transition-colors group">
                  <TableCell className="px-6 md:px-12 py-5 md:py-10">
                    <div className="flex items-center gap-4 md:gap-6">
                       <div className={cn(
                         "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105",
                         item.type === 'mock' ? 'bg-orange-50 text-primary' : 
                         item.type === 'ca' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                       )}>
                          {item.type === 'mock' ? <Zap className="h-5 w-5" /> : 
                           item.type === 'ca' ? <Newspaper className="h-5 w-5" /> : 
                           item.type === 'pyq' ? <FileStack className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                       </div>
                       <div className="min-w-0">
                          <p className="font-bold text-[#0F172A] text-sm md:text-lg leading-tight truncate">{item.title}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate max-w-[200px]">{item.description}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[8px] md:text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-sm">
                       {item.type} HUB
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <code className="text-[10px] md:text-xs font-mono text-primary font-bold bg-blue-50 px-2 py-0.5 rounded">/{item.slug || 'no-slug'}</code>
                  </TableCell>
                  <TableCell className="text-right px-6 md:px-12">
                    <div className="flex justify-end gap-2 md:gap-3 opacity-20 group-hover:opacity-100 transition-all">
                       <button onClick={() => setEditingItem(item)} className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary active:scale-90 transition-all">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-50 active:scale-90 transition-all">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-xl w-[95vw] max-h-[90vh] rounded-3xl md:rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left flex flex-col">
          <div className="h-2 w-full bg-[#0F172A] shrink-0" />
          <DialogHeader className="p-6 md:p-10 pb-2 md:pb-4 shrink-0">
            <DialogTitle className="text-xl md:text-3xl font-black uppercase">Free Asset Architect</DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Configure public study material metadata.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-10 pb-6 md:pb-10 space-y-6 md:space-y-8">
            <div className="space-y-1.5 text-left">
              <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Asset Headline</Label>
              <Input value={editingItem?.title || ""} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="h-12 md:h-14 rounded-xl border-slate-200 bg-slate-50 font-bold" />
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Asset Slug (SEO URL)</Label>
              <Input value={editingItem?.slug || ""} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} className="h-12 md:h-14 rounded-xl border-slate-200 bg-slate-50 font-mono text-xs text-primary" placeholder="e.g. punjab-gk-mock-1" />
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Marketing Abstract</Label>
              <Textarea value={editingItem?.description || ""} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50 font-medium resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
               <div className="space-y-1.5 text-left">
                <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">Thematic Type</Label>
                <select value={editingItem?.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full h-12 md:h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none shadow-inner">
                  <option value="mock">Free Mock</option>
                  <option value="note">Study Note</option>
                  <option value="ca">Current Affairs</option>
                  <option value="pyq">Official PYQ</option>
                  <option value="pdf">Blueprint PDF</option>
                </select>
              </div>
              <div className="space-y-1.5 text-left">
                <Label className="text-[9px] font-black uppercase text-slate-500 ml-1">State Registry</Label>
                <Input value="Punjab" disabled className="h-12 md:h-14 rounded-xl border-none bg-slate-50 font-bold" />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="text-[9px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2">
                 <LinkIcon className="h-3 w-3" /> Asset Link Node
              </Label>
              <Input 
                value={editingItem?.link || ""} 
                onChange={e => setEditingItem({...editingItem, link: e.target.value})} 
                className="h-12 md:h-14 rounded-xl border-slate-200 bg-slate-50 font-bold text-primary" 
                placeholder="e.g. /mocks/mock-id-here" 
              />
            </div>
          </div>

          <DialogFooter className="p-6 md:p-10 pt-4 bg-slate-50 border-t border-slate-100 flex flex-row gap-4 shrink-0">
            <Button variant="ghost" onClick={() => setEditingItem(null)} className="h-11 md:h-12 px-6 font-black uppercase text-[10px] text-slate-400">Discard Draft</Button>
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-blue-700 text-white h-11 md:h-12 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl border-none active:scale-95">
              Commit to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
