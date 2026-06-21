"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Zap, 
  Loader2, 
  X, 
  Calendar,
  Rocket,
  ChevronRight,
  Layers,
  Clock,
  Target,
  AlertTriangle,
  Globe,
  Languages
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, serverTimestamp, writeBatch } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { CurrentAffairHubItem, LanguageDisplayMode, CurrentAffairType } from "@/types"
import { cn } from "@/lib/utils"
import { parseBulkQuestions } from "@/lib/parser"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

/**
 * @fileOverview Institutional Current Affairs Management Hub v21.0 (Unified Design System).
 */

export default function AdminCurrentAffairs() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const caQuery = useMemo(() => (db ? collection(db, "current_affairs_hub") : null), [db])
  const { data: rawCaItems, loading } = useCollection<CurrentAffairHubItem>(caQuery as any)

  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [bulkText, setBulkText] = useState("")

  const [editingQIndex, setEditingQIndex] = useState<number | null>(null)
  const [editQForm, setEditQForm] = useState<any>(null)

  const caItems = useMemo(() => {
     if (!rawCaItems) return [];
     return [...rawCaItems].sort((a: any, b: any) => {
        const tA = a.updatedAt?.seconds || 0;
        const tB = b.updatedAt?.seconds || 0;
        return tB - tA;
     });
  }, [rawCaItems]);

  const handleProcessBulk = () => {
    if (!bulkText.trim()) return;
    const metadata = { 
      boardId: 'current-affairs', 
      subjectId: 'gk-ca', 
      status: 'PUBLISHED',
      secondaryLanguage: editingItem.language === 'English & Hindi' ? 'hindi' : 'punjabi'
    };
    const result = parseBulkQuestions(bulkText, metadata);
    
    if (result.questions.length > 0) {
      setEditingItem({
        ...editingItem,
        questions: [...(editingItem.questions || []), ...result.questions]
      });
      setBulkText("");
      toast({ title: "Extraction Success" });
    } else {
      toast({ variant: "destructive", title: "Parse Failed" });
    }
  };

  const handleSave = async () => {
    if (!db || !editingItem) return
    setIsSaving(true)
    const caId = editingItem.id || `ca-hub-${Date.now()}`
    const caRef = doc(db, "current_affairs_hub", caId)
    
    try {
      await setDoc(caRef, { ...editingItem, id: caId, updatedAt: serverTimestamp() }, { merge: true })
      toast({ title: "Registry Synced" })
      setEditingItem(null)
    } finally {
      setIsSaving(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (!caItems) return []
    return caItems.filter((item: any) => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [caItems, searchTerm])

  return (
    <div className="space-y-6 pb-24 text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2 md:px-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl md:text-5xl font-black font-headline text-blue-600 uppercase tracking-tight leading-tight">CA Manager</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Coordinate coverage hub.</p>
        </div>
        <Button onClick={() => setEditingItem({ title: "", type: "DAILY", month: "January", year: "2025", status: "PUBLISHED", questions: [], language: "English & Punjabi", duration: 15, positiveMarks: 1, negativeMarks: 0.25 })} size="lg" className="gap-3 shadow-2xl">
          <Plus className="h-5 w-5" /> Initialize CA Hub
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden mx-2 md:mx-4">
        <CardHeader className="p-4 md:p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full lg:w-[45%]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-14 h-11 md:h-12 rounded-full bg-white border-none shadow-inner text-sm md:text-lg font-medium" 
                placeholder="Search archives..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase text-slate-500">Node Identity</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={2} className="p-8"><Skeleton className="h-14 w-full rounded-2xl" /></TableCell></TableRow>
                ))
              ) : filteredItems.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-slate-50 group border-slate-50 transition-all">
                  <TableCell className="px-10 py-8 text-left">
                    <div className="flex items-center gap-6">
                       <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                          <Calendar className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-black text-[#0F172A] text-xl uppercase truncate">{item.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{item.month} {item.year}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100">
                       <Button variant="ghost" size="icon" className="bg-slate-50 hover:bg-white rounded-full" onClick={() => setEditingItem(item)}><Edit className="h-5 w-5" /></Button>
                       <Button variant="ghost" size="icon" className="bg-slate-50 hover:bg-rose-50 text-rose-500 rounded-full" onClick={async () => { if(confirm("Purge?")) await deleteDoc(doc(db!, "current_affairs_hub", item.id)) }}><Trash2 className="h-5 w-5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && !isSaving && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[98vw] w-[98vw] h-[95vh] rounded-[2.5rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left flex flex-col">
          <div className="h-2 w-full bg-blue-600 shrink-0" />
          <DialogHeader className="px-10 py-6 shrink-0 flex flex-row items-center justify-between border-b border-slate-50">
            <div className="min-w-0">
               <DialogTitle className="text-2xl font-black font-headline uppercase text-[#0F172A]">Current Affairs Architect</DialogTitle>
            </div>
            <button onClick={() => setEditingItem(null)} className="p-3 hover:bg-slate-50 rounded-full"><X className="h-6 w-6 text-slate-400" /></button>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-6">
                   <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Quiz Title</Label>
                      <Input value={editingItem?.title || ""} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="h-12 rounded-full font-black bg-slate-50 border-none" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 text-left">
                         <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Type</Label>
                         <select value={editingItem?.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full h-11 bg-slate-50 rounded-full px-4 outline-none font-bold">
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                         </select>
                      </div>
                      <div className="space-y-2 text-left">
                         <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Language</Label>
                         <select value={editingItem?.language} onChange={e => setEditingItem({...editingItem, language: e.target.value})} className="w-full h-11 bg-slate-50 rounded-full px-4 outline-none font-bold">
                            <option value="English & Punjabi">English/Punjabi</option>
                            <option value="English & Hindi">English/Hindi</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <div className="flex items-center gap-4 mb-2">
                         <Zap className="h-6 w-6 text-blue-600 fill-current" />
                         <p className="font-headline font-black text-xl uppercase">Bulk extraction</p>
                      </div>
                      <Textarea value={bulkText} onChange={e => setBulkText(e.target.value)} className="min-h-[300px] rounded-[1.5rem] bg-white border-slate-200 p-6 text-sm" placeholder="Paste questions here..." />
                      <Button onClick={handleProcessBulk} className="w-full gap-3">
                         Initialize Extraction <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
             </div>
          </div>

          <DialogFooter className="px-10 py-8 bg-slate-50 flex items-center gap-4 border-t border-slate-100 shrink-0">
            <Button variant="ghost" onClick={() => setEditingItem(null)} className="h-12 px-10">Discard</Button>
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="flex-1 gap-3">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-5 w-5" />} Commit to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
