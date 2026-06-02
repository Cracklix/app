import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreVertical, Mail, UserPlus, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const ASPIRANTS = [
  { id: "A102", name: "Amandeep Singh", email: "aman@example.com", exams: ["PSSSB", "Police"], score: "82%", status: "Pro" },
  { id: "A103", name: "Gurpreet Kaur", email: "gpkaur@example.com", exams: ["PPSC"], score: "74%", status: "Free" },
  { id: "A104", name: "Rajesh Kumar", email: "rajesh@example.com", exams: ["PSPCL", "Teaching"], score: "68%", status: "Pro" },
  { id: "A105", name: "Sukhwinder Singh", email: "sukha@example.com", exams: ["PSSSB"], score: "91%", status: "Pro" },
  { id: "A106", name: "Preeti Sharma", email: "preeti@example.com", exams: ["High Court"], score: "55%", status: "Free" },
]

export default function AspirantsManagement() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Aspirants</h1>
          <p className="text-muted-foreground">Manage and support 15,248 registered students.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" /> Add Aspirant
        </Button>
      </div>

      <Card className="border-foreground/5 bg-card/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search by name, email or ID..." />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button variant="ghost" size="sm">Export CSV</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aspirant</TableHead>
                <TableHead>Target Exams</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ASPIRANTS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.exams.map((ex) => (
                        <Badge key={ex} variant="secondary" className="text-[10px] bg-secondary/5 text-secondary border-secondary/20">
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-headline font-black text-primary">{user.score}</TableCell>
                  <TableCell>
                    <Badge className={user.status === 'Pro' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-none'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
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
