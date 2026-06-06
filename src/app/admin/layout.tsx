
'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, Database, ClipboardList, LogOut, ShieldCheck, Zap, Newspaper, Megaphone, Globe, MousePointer2, Layers, CheckCircle2, Gem, BookOpen, FileStack, Upload, ListTree, Landmark } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/brand/Logo"
import { useUser, useAuth } from "@/firebase"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { signOut } from "firebase/auth"

/**
 * @fileOverview Administrative Sidebar & Navigation Layout.
 * Mobile: Optimized SidebarTrigger and responsive inset padding.
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isFounder = user?.email === 'arshdeepgrewal1122@gmail.com';
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN' || isFounder;

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, profile, loading, router, isAdmin])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (loading) return <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center"><ShieldCheck className="h-10 w-10 text-primary animate-pulse" /></div>
  
  if (!user || !isAdmin) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white font-body">
        <Sidebar className="border-r border-white/5 bg-[#0F172A]">
          <SidebarHeader className="p-6">
            <Logo variant="light" className="scale-90 origin-left" />
          </SidebarHeader>
          <SidebarContent className="custom-scrollbar overflow-x-hidden">
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-left">Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<LayoutDashboard />} label="Dashboard" href="/admin" active={pathname === "/admin"} />
                  <AdminNavItem icon={<Globe className="text-blue-400" />} label="Authority Hub" href="/admin/exams" active={pathname === "/admin/exams"} />
                  <AdminNavItem icon={<Landmark className="text-amber-400" />} label="Exam Registry" href="/admin/exam-registry" active={pathname === "/admin/exam-registry"} />
                  <AdminNavItem icon={<ListTree className="text-emerald-400" />} label="Subject Registry" href="/admin/subjects" active={pathname === "/admin/subjects"} />
                  <AdminNavItem icon={<Database />} label="Atomic Bank" href="/admin/questions" active={pathname === "/admin/questions"} />
                  <AdminNavItem icon={<Upload className="text-primary" />} label="Bulk Ingestion" href="/admin/bulk-import" active={pathname === "/admin/bulk-import"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-left">CMS Hub</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<Zap className="text-primary" />} label="Free Study Hub" href="/admin/free-content" active={pathname === "/admin/free-content"} />
                  <AdminNavItem icon={<Newspaper className="text-emerald-400" />} label="Analysis Feed" href="/admin/current-affairs" active={pathname === "/admin/current-affairs"} />
                  <AdminNavItem icon={<BookOpen className="text-orange-400" />} label="Study Notes" href="/admin/notes" active={pathname === "/admin/notes"} />
                  <AdminNavItem icon={<FileStack className="text-blue-400" />} label="Audit Archives" href="/admin/pyqs" active={pathname === "/admin/pyqs"} />
                  <AdminNavItem icon={<Megaphone className="text-rose-400" />} label="Exam Gazette" href="/admin/notifications" active={pathname === "/admin/notifications"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-left">Modular Architect</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<Layers className="text-primary" />} label="Test Assembly" href="/admin/mocks" active={pathname === "/admin/mocks"} />
                  <AdminNavItem icon={<ClipboardList />} label="Mock Blueprints" href="/admin/mocks/builder" active={pathname === "/admin/mocks/builder"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-left">Monetization</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<Gem className="text-amber-400" />} label="Pass Registry" href="/admin/passes" active={pathname === "/admin/passes"} />
                  <AdminNavItem icon={<MousePointer2 className="text-orange-400" />} label="Ad Manager" href="/admin/ads" active={pathname === "/admin/ads"} />
                  <AdminNavItem icon={<CheckCircle2 className="text-emerald-400" />} label="Verify Payments" href="/admin/payments/verify" active={pathname === "/admin/payments/verify"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto pb-8">
              <SidebarMenu>
                <SidebarMenuItem>
                   <SidebarMenuButton onClick={handleLogout} className="px-6 text-destructive/70 hover:bg-destructive/10 hover:text-destructive h-11">
                    <LogOut className="size-4 mr-3 shrink-0" /> <span className="font-bold">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex flex-col bg-white">
          <header className="h-14 md:h-16 border-b border-slate-200 flex items-center px-4 md:px-6 justify-between bg-white sticky top-0 z-40 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-[#0F172A]" />
              <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 truncate">
                 <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] truncate">Cracklix Management System</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 bg-white overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AdminNavItem({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={active}
        className={`px-6 transition-all font-medium h-11 group ${active ? 'bg-white/5 text-primary' : 'hover:bg-white/5 hover:text-primary text-white/60'}`}
      >
        <Link href={href} className="flex items-center gap-3 w-full text-left">
          <div className="shrink-0 flex items-center justify-center size-4">
            {icon}
          </div>
          <span className="font-bold tracking-tight truncate text-left text-[13px]">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
