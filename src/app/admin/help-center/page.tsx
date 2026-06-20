"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save, HelpCircle, Search, Loader2, X, Layers, BookOpen } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { HelpArticle } from "@/types"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Knowledge Base Hub Management v6.0 (Index Fix).
 * FIXED: Client-side sorting implemented to prevent index requirements.
 */

export default function HelpCenterManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const helpQuery = useMemo(() => (db ? collection(db, "help_articles") : null), [db])
  const { data: rawArticles, loading } = useCollection<HelpArticle>(helpQuery as any)

  const articles = useMemo(() => {
    if (!rawArticles) return [];
    return [...rawArticles].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [rawArticles]);

  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSave = async () => {
    if (!db || !editingArticle) return
    if (!editingArticle.title || !editingArticle.content) {
       toast({ variant: "destructive", title: "Audit Blocked", description: "Title and Content are mandatory." })
       return
    }

    setIsSaving(true)
    const id = editingArticle.id || `help-${Date.now()}`
    try {
      await setDoc(doc(db, "help_articles", id), {
        ...editingArticle,
        id,
        updatedAt: serverTimestamp(),
        createdAt: editingArticle.createdAt || serverTimestamp(),
        displayOrder: parseInt(editingArticle.displayOrder) || 1
      }, { merge: true })
      toast({ title: "Help Hub Synced" })
      setEditingArticle(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm("Permanently purge this help article?")) return
    await deleteDoc(doc(db, "help_articles", id))
    toast({ title: "Article Removed" })
  }

  const filteredArticles = useMemo(() => {
    if (!articles) return []
    return articles.filter(a => 
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [articles, searchTerm])

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Knowledge Base Hub</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Help Center</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage support articles, tutorials and global FAQs.</p>
        </div>
        <button onClick={() => setEditingArticle({ title: "", category: "FAQ", content: "", published: true, displayOrder: (articles?.length || 0) + 1 })} className="bg-[#0F172A] hover:bg-black text-white h-16 px-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3 border-none">
          <Plus className="h-5 w-5" /> Add Knowledge Node
        </button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-16 h-16 rounded-[1.5rem] bg-white border-none shadow-inner" placeholder="Search knowledge base..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Article Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Sort Order</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4} className="p-10"><Skeleton className="h-14 w-full rounded-2xl" /></TableCell></TableRow>)
              ) : filteredArticles.map((a) => (
                <TableRow key={a.id} className="hover:bg-slate-50 group border-slate-50 transition-all">
                  <TableCell className="px-10 py-8 text-left">
                     <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-inner">
                           <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="font-black text-[#0F172A] text-lg uppercase leading-none">{a.title}</p>
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] px-3 py-1 uppercase">{a.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">{a.displayOrder}</TableCell>
                  <TableCell className="text-right px-10">
                     <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" onClick={() => setEditingArticle(a)}><Edit className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="hover:text-rose-600" onClick={() => handleDelete(a.id)}><Trash2 className="h-5 w-5" /></Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingArticle} onOpenChange={o => !o && setEditingArticle(null)}>
         <DialogContent className="sm:max-w-2xl rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-4">
               <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-4">
                  <Layers className="h-8 w-8 text-primary" /> Knowledge Node Architect
               </DialogTitle>
               <DialogDescription>Modify help article or FAQ content.</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Category</Label>
                     <select value={editingArticle?.category || "FAQ"} onChange={e => setEditingArticle({...editingArticle, category: e.target.value})} className="w-full h-12 bg-slate-50 rounded-xl px-4 font-bold text-sm">
                        <option value="FAQ">General FAQ</option>
                        <option value="PAYMENTS">Payments Hub</option>
                        <option value="PASS">Elite Pass</option>
                        <option value="PWA">App Setup</option>
                        <option value="TECHNICAL">CBT/Technical</option>
                        <option value="ACCOUNT">Account Hub</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase text-slate-500">Display Order</Label>
                     <Input type="number" value={editingArticle?.displayOrder || ""} onChange={e => setEditingArticle({...editingArticle, displayOrder: e.target.value})} />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Article Headline</Label>
                  <Input value={editingArticle?.title || ""} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} placeholder="e.g. How to activate Quarterly Pass?" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500">Response / content</Label>
                  <Textarea value={editingArticle?.content || ""} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} className="min-h-[200px]" placeholder="Type help content here..." />
               </div>
            </div>
            <DialogFooter className="p-10 pt-0">
               <Button onClick={handleSave} disabled={isSaving} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl transition-all">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Node"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
