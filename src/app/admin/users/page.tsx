"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreVertical, Mail, UserPlus, Filter, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

export default function AspirantsManagement() {
  const db = useFirestore()
  
  const usersQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  }, [db])

  const { data: aspirants, loading } = useCollection(usersQuery)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Aspirants</h1>
          <p className="text-muted-foreground">Manage and support {aspirants?.length || 0} registered students.</p>
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
                <TableHead>Contact</TableHead>
                <TableHead>Target Board</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : aspirants && aspirants.length > 0 ? (
                aspirants.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-foreground/10">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                          <AvatarFallback className="font-bold text-xs">{user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Phone className="h-3 w-3 text-secondary" />
                        {user.phone || 'Not Provided'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] bg-secondary/10 text-secondary border-none uppercase font-black tracking-widest">
                        {user.targetExam || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'Pro' ? 'bg-emerald-500/10 text-emerald-500 border-none' : 'bg-muted text-muted-foreground border-none'}>
                        {user.status || 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Mail className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No aspirants registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
