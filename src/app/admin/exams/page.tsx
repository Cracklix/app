"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Upload, Image as ImageIcon, X, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function ExamManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  const { data: boards, loading } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const [editingBoard, setEditingBoard] = useState<any>(null)
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)

  const handleSave = async () => {
    if (!db || !editingBoard) return
    const boardRef = doc(db, "boards", editingBoard.id || `board-${Date.now()}`)
    const payload = { ...editingBoard, id: boardRef.id, iconUrl: previewIcon || editingBoard.iconUrl || "" }
    
    try {
      await setDoc(boardRef, payload, { merge: true })
      toast({ title: "Success", description: "Board information updated." })
      setEditingBoard(null)
      setPreviewIcon(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not save board." })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recruitment board?")) return
    try {
      await deleteDoc(doc(db, "boards", id))
      toast({ title: "Deleted", description: "Board removed." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." })
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Board Management</h1>
          <p className="text-muted-foreground">Arsh Grewal Access: Manage official recruitment authorities.</p>
        </div>
        <Dialog open={editingBoard && !editingBoard.id} onOpenChange={(open) => !open && setEditingBoard(null)}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setEditingBoard({ abbreviation: "", name: "", description: "" })}>
              <Plus className="mr-2 h-4 w-4" /> Create Board
            </Button>
          </DialogTrigger>
          <BoardDialogContent editingBoard={editingBoard} setEditingBoard={setEditingBoard} handleSave={handleSave} previewIcon={previewIcon} setPreviewIcon={setPreviewIcon} />
        </Dialog>
      </div>

      <Card className="border-foreground/5 bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                ))
              ) : boards?.map((board: any) => (
                <TableRow key={board.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center overflow-hidden relative">
                      {board.iconUrl ? (
                        <Image src={board.iconUrl} alt={board.abbreviation} fill className="object-contain p-1" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">{board.abbreviation}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{board.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => setEditingBoard(board)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/50 hover:text-destructive" onClick={() => handleDelete(board.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!(editingBoard && editingBoard.id)} onOpenChange={(open) => !open && setEditingBoard(null)}>
        <BoardDialogContent editingBoard={editingBoard} setEditingBoard={setEditingBoard} handleSave={handleSave} previewIcon={previewIcon} setPreviewIcon={setPreviewIcon} />
      </Dialog>
    </div>
  )
}

function BoardDialogContent({ editingBoard, setEditingBoard, handleSave, previewIcon, setPreviewIcon }: any) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{editingBoard?.id ? "Edit Board" : "New Recruitment Board"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Abbreviation (e.g. PSSSB)</Label>
          <Input value={editingBoard?.abbreviation || ""} onChange={e => setEditingBoard({...editingBoard, abbreviation: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={editingBoard?.name || ""} onChange={e => setEditingBoard({...editingBoard, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input value={editingBoard?.description || ""} onChange={e => setEditingBoard({...editingBoard, description: e.target.value})} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => setEditingBoard(null)}>Cancel</Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>Save Authority</Button>
      </DialogFooter>
    </DialogContent>
  )
}
