
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, UserPlus, Filter, Phone, ShieldCheck, Trash2, Gift, Gem } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, doc, updateDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import StudentAvatar from "@/components/brand/StudentAvatar"
import { grantUserPass } from "@/app/actions/payment"

export default function AspirantsManagement() {
  const db = useFirestore()
  const { user: currentUser, profile: currentProfile } = useUser()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [grantDialogUser, setGrantDialogUser] = useState<any>(null)
  const [grantPlan, setGrantPlan] = useState("gold")

  const usersQuery = useMemo(() => (db ? query(collection(db, 'users')) : null), [db])
  const { data: aspirants, loading } = useCollection<any>(usersQuery)

  const filteredAspirants = useMemo(() => {
    if (!aspirants) return []
    return aspirants
      .filter(a => 
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [aspirants, searchTerm])

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const isFounder = currentUser?.email === 'arshdeepgrewal1122@gmail.com';
    if (currentProfile?.role !== 'SUPER_ADMIN' && !isFounder) {
      toast({ variant: "destructive", title: "Access Denied", description: "Lead authority only." })
      return
    }
    try {
      await updateDoc(doc(db!, "users", userId), { role: newRole })
      toast({ title: "Permissions Updated", description: `User role changed to ${newRole}.` })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Audit Failed", description: e.message })
    }
  }

  const handleGrantPass = async () => {
    if (!grantDialogUser || !currentUser) return
    try {
       await grantUserPass(grantDialogUser.id, grantPlan, 30, currentUser.uid)
       toast({ title: "Pass Granted", description: `User ${grantDialogUser.name} received 30 days of ${grantPlan}.` })
       setGrantDialogUser(null)
    } catch (e: any) {
       toast({ variant: "destructive", title: "Grant Failed", description: e.message })
    }
  }

  return (
    <div className="space-y-12 pb-20 text-[#0F172A] text-left">
      <div className="flex justify-between items-center px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional Database Control</span>
           </div>
          <h1 className="text-4xl font-headline font-black text-primary uppercase tracking-tight">Student Registry</h1>
          <p className="text-slate-600 mt-1 font-medium">Manage institutional access for {aspirants?.length || 0} registered aspirants.</p>
        </div>
      </div>

      <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-white mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-14 h-16 rounded-[1.5rem] bg-white border-slate-100 shadow-inner" 
                placeholder="Search name or email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 text-left">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Aspirant Node</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Permissions</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pass Status</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5} className="px-10 py-6"><Skeleton className="h-16 w-full rounded-2xl" /></TableCell></TableRow>
                ))
              ) : filteredAspirants.map((aspirant: any) => (
                <TableRow key={aspirant.id} className="border-slate-50 hover:bg-slate-50 transition-colors group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <StudentAvatar profile={aspirant} className="h-14 w-14 border-2 border-primary/20 rounded-2xl" />
                      <div>
                        <p className="font-black text-[#0F172A] text-lg uppercase tracking-tight">{aspirant.name}</p>
                        <p className="text-xs font-bold text-slate-500 lowercase">{aspirant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-[#0F172A]">{aspirant.phone || 'N/A'}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{aspirant.state} Node</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-none shadow-lg ${
                      aspirant.role === 'SUPER_ADMIN' ? 'bg-rose-50 text-rose-600' : 
                      aspirant.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {aspirant.role || 'STUDENT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <Badge className={`border-none px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                         aspirant.status !== 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                       }`}>
                         {aspirant.status || 'Free'}
                       </Badge>
                       {aspirant.passExpiryDate && (
                          <span className="text-[8px] font-bold text-slate-400 uppercase text-center">Expires: {new Date(aspirant.passExpiryDate).toLocaleDateString()}</span>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <button className="h-12 w-12 rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100 flex items-center justify-center"><MoreVertical className="h-6 w-6" /></button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-64 bg-[#0F172A] border-white/10 text-white rounded-[2rem] p-3 shadow-4xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-2">Lead Audit</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setGrantDialogUser(aspirant)} className="rounded-xl cursor-pointer font-bold px-4 py-3 focus:bg-primary/20 text-primary">
                               <Gift className="h-4 w-4 mr-3" /> Grant Free Pass
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem onClick={() => handleUpdateRole(aspirant.id, 'ADMIN')} className="rounded-xl cursor-pointer font-bold px-4 py-3 focus:bg-white/5">Promote to Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateRole(aspirant.id, 'SUPER_ADMIN')} className="rounded-xl cursor-pointer font-bold px-4 py-3 text-rose-400 focus:bg-rose-500/10">Promote to Lead</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="text-destructive font-bold rounded-xl cursor-pointer px-4 py-3 focus:bg-destructive/10">
                               <Trash2 className="h-4 w-4 mr-3" /> Terminate Node
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grant Pass Dialog */}
      <Dialog open={!!grantDialogUser} onOpenChange={(open) => !open && setGrantDialogUser(null)}>
         <DialogContent className="bg-[#0F172A] text-white border-white/10 rounded-[3rem] max-w-md p-10 shadow-4xl">
            <DialogHeader className="text-center space-y-4">
               <div className="h-16 w-16 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                  <Gem className="h-8 w-8" />
               </div>
               <DialogTitle className="text-2xl font-headline font-black uppercase">Grant Institutional Pass</DialogTitle>
               <p className="text-slate-400 text-sm font-medium">Elevating {grantDialogUser?.name} access group.</p>
            </DialogHeader>
            <div className="py-10 space-y-6">
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Select Access Node</label>
                  <select 
                    value={grantPlan} 
                    onChange={e => setGrantPlan(e.target.value)} 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 outline-none font-bold text-sm"
                  >
                     <option value="silver" className="bg-[#0F172A]">Silver (Subject Mastery)</option>
                     <option value="gold" className="bg-[#0F172A]">Gold (Full Access)</option>
                     <option value="platinum" className="bg-[#0F172A]">Platinum (Everything)</option>
                  </select>
               </div>
               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">This will grant 30 days of premium access. Expiry is automated.</p>
               </div>
            </div>
            <DialogFooter>
               <Button variant="ghost" onClick={() => setGrantDialogUser(null)} className="text-slate-500 hover:text-white rounded-xl">Cancel</Button>
               <Button onClick={handleGrantPass} className="bg-primary hover:bg-orange-600 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl h-12">Confirm Grant</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
