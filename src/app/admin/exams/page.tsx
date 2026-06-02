
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Upload, Image as ImageIcon, X } from "lucide-react"
import { EXAMS } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

export default function ExamManagement() {
  const [exams, setExams] = useState(EXAMS)
  const [editingExam, setEditingExam] = useState<any>(null)
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewIcon(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (editingExam) {
      setExams(prev => prev.map(e => 
        e.id === editingExam.id ? { ...editingExam, iconUrl: previewIcon || editingExam.iconUrl } : e
      ))
      setEditingExam(null)
      setPreviewIcon(null)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Exam Management</h1>
          <p className="text-muted-foreground">Manage recruitment boards, syllabus, and official icons.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Board
        </Button>
      </div>

      <Card className="border-foreground/5 bg-card/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search by board or exam name..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Board Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Mocks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                      {exam.thumbnail || previewIcon ? (
                         <div className="relative h-full w-full">
                           <Image 
                            src={previewIcon || `https://picsum.photos/seed/${exam.id}/100/100`} 
                            alt={exam.name} 
                            fill 
                            className="object-contain p-1"
                           />
                         </div>
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-sm text-primary">{exam.board}</p>
                      <p className="text-xs text-muted-foreground">{exam.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
                      {exam.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-headline font-bold text-xs">{exam.totalMocks}</TableCell>
                  <TableCell className="text-right">
                    <Dialog open={editingExam?.id === exam.id} onOpenChange={(open) => !open && setEditingExam(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => setEditingExam(exam)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Board Identity</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label>Official Icon</Label>
                            <div className="flex items-center gap-6">
                              <div className="h-24 w-24 rounded-xl border-2 border-dashed flex items-center justify-center relative bg-muted/20 overflow-hidden">
                                {previewIcon || editingExam?.iconUrl ? (
                                  <>
                                    <Image src={previewIcon || editingExam?.iconUrl} alt="Preview" fill className="object-contain p-2" />
                                    <button 
                                      onClick={() => setPreviewIcon(null)}
                                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </>
                                ) : (
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div className="space-y-2">
                                <Button variant="outline" size="sm" className="relative cursor-pointer">
                                  <Upload className="h-4 w-4 mr-2" /> Upload Image
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={handleIconUpload}
                                  />
                                </Button>
                                <p className="text-[10px] text-muted-foreground">PNG or SVG, max 500KB</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Board Abbreviation</Label>
                              <Input 
                                value={editingExam?.board || ""} 
                                onChange={(e) => setEditingExam({...editingExam, board: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input 
                                value={editingExam?.name || ""} 
                                onChange={(e) => setEditingExam({...editingExam, name: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="ghost" onClick={() => setEditingExam(null)}>Cancel</Button>
                          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
