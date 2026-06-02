
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXAMS } from "@/lib/mock-data"
import Logo from "@/components/brand/Logo"

export default function ProfileSetup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    targetExam: "",
    state: "Punjab"
  })

  const handleSubmit = () => {
    if (formData.name && formData.targetExam) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-12">
        <Logo variant="dark" />
      </div>

      <Card className="w-full max-w-lg border-foreground/5">
        <CardHeader>
          <CardTitle className="font-headline font-bold">Complete Your Profile</CardTitle>
          <CardDescription>We need a few details to personalize your preparation journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Full Name (as per ID)</Label>
            <Input 
              placeholder="Amandeep Singh" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>State of Domicile</Label>
            <Input value="Punjab" disabled className="bg-muted/30" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Platform optimized for Punjab State Aspirants</p>
          </div>

          <div className="space-y-2">
            <Label>Target Exam Board</Label>
            <Select onValueChange={(val) => setFormData(prev => ({ ...prev, targetExam: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="psssb">PSSSB</SelectItem>
                <SelectItem value="ppsc">PPSC</SelectItem>
                <SelectItem value="police">Punjab Police</SelectItem>
                <SelectItem value="teaching">Teaching Exams</SelectItem>
                <SelectItem value="hc">High Court</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full h-12 bg-primary hover:bg-primary/90 font-bold"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.targetExam}
          >
            Start My Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
