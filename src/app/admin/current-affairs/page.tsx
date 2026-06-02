"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Save, Calendar, Search } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

export default function AdminCurrentAffairs() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const caQuery = useMemo(() => (db ? query(collection(db, "current_affairs"), orderBy("date", "desc")) : null), [db])
  const { data: currentAffairs, loading } = useCollection<any>(caQuery)

  const [editingCA, setEditingCA] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSave = () => {
    if (!db || !editingCA) return
    const caId = editingCA.id || `ca-${Date.now()}`
    const caRef = doc(db, "current_affairs", caId)
    
    const payload = {
      ...editingCA,
      id: caId,
      updatedAt: new Date().toISOString()
    }

    setDoc(caRef, payload, { merge: true })
      .then(() => {
        toast({ title: "Success", description: "Article published successfully." })
        setEditingCA(null)
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: caRef.path,
          operation: 'write',
          requestResourceData: payload,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this news article?")) return
    const caRef = doc(db, "current_affairs", id)
    deleteDoc(caRef)
      .then(() => {
        toast({ title: "Deleted", description: "Article removed." })
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: caRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  const filteredCA = useMemo(() => {
    if (!currentAffairs) return []
    return currentAffairs.filter(ca => 
      ca.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ca.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [currentAffairs, searchTerm])

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Current Affairs Hub</h1>
          <p className="text-muted-foreground mt-1">Manage institutional news and daily analysis for aspirants.</p>
        </div>
        <Button onClick={() => setEditingCA({ title: "", category: "Punjab", date: new Date().toLocaleDateString('en-GB'), summary: "", content: "" })} className="bg-primary hover:bg-primary/90 gap-2 h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" /> New Article
        </Button>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 bg-muted/20 border-b border-white/5">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-12 h-12 rounded-2xl bg-background border-none shadow-inner" 
                placeholder="Search news..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5">
                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest">Date & Category</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Article Title</TableHead>
                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={3} className="px-8"><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                ))
              ) : filteredCA.map((ca) => (
                <TableRow key={ca.id} className="hover:bg-white/5 group border-white/5 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><Calendar className="h-3 w-3" /> {ca.date}</p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-black px-2 py-0.5 uppercase">{ca.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-slate-100 text-base">{ca.title}</p>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5" onClick={() => setEditingCA(ca)}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => handleDelete(ca.id)}>
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

      <Dialog open={!!editingCA} onOpenChange={(open) => !open && setEditingCA(null)}>
        <DialogContent className="sm:max-w-2xl rounded-[2.5rem] bg-[#0F172A] text-white border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">{editingCA?.id ? "Edit News" : "New Analysis Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6 custom-scrollbar max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Date</Label>
                <Input value={editingCA?.date || ""} onChange={e => setEditingCA({...editingCA, date: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. 24 Oct 2026" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500">Category</Label>
                <Input value={editingCA?.category || ""} onChange={e => setEditingCA({...editingCA, category: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. Punjab, Sports, Economy" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500">Headline Title</Label>
              <Input value={editingCA?.title || ""} onChange={e => setEditingCA({...editingCA, title: e.target.value})} className="bg-white/5 border-white/10 text-lg font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500">Article Summary</Label>
              <Textarea value={editingCA?.summary || ""} onChange={e => setEditingCA({...editingCA, summary: e.target.value})} className="bg-white/5 border-white/10 min-h-[100px]" placeholder="Brief intro for the listing card..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500">Full Analysis (Markdown)</Label>
              <Textarea value={editingCA?.content || ""} onChange={e => setEditingCA({...editingCA, content: e.target.value})} className="bg-white/5 border-white/10 min-h-[200px]" placeholder="Detailed analysis body..." />
            </div>
          </div>
          <DialogFooter className="border-t border-white/5 pt-6">
            <Button variant="ghost" onClick={() => setEditingCA(null)} className="text-slate-400 hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 px-10 font-bold rounded-xl shadow-xl shadow-primary/20">
              <Save className="h-4 w-4 mr-2" /> {editingCA?.id ? "Update Feed" : "Publish Live"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}