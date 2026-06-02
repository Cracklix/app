"use client"

import Link from "next/link"
import { Search, User, Bell, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/brand/Logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const boards = [
    "PSSSB", "PPSC", "Punjab Police", "Teaching Exams", "High Court", "PSPCL & PSTCL", "BFUHS", "Banking & Cooperative"
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0F172A] border-b border-white/5 py-1 backdrop-blur-xl shadow-2xl">
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        <Logo variant="light" />

        <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-[0.15em] text-white/60">
          <Link href="/" className="hover:text-primary transition-colors text-primary border-b-2 border-primary py-6">Home</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-primary transition-colors flex items-center gap-1.5 outline-none group py-6">
              Exams <ChevronDown className="h-3 w-3 group-data-[state=open]:rotate-180 transition-transform" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0F172A] border-white/10 text-white min-w-[240px] mt-2 p-2 rounded-xl shadow-2xl">
              {boards.map(board => (
                <DropdownMenuItem key={board} asChild>
                  <Link href={`/exams?board=${encodeURIComponent(board)}`} className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary rounded-lg py-3 px-4 font-bold text-[10px] uppercase tracking-widest border-b border-white/5 last:border-0 transition-colors">
                    {board}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/mocks" className="hover:text-primary transition-colors py-6">Mocks</Link>
          <Link href="/pyqs" className="hover:text-primary transition-colors py-6">PYQs</Link>
          <Link href="/current-affairs" className="hover:text-primary transition-colors py-6">Current Affairs</Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/40 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/notifications" className="text-white/40 hover:text-white transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full ring-4 ring-[#0F172A]" />
          </Link>
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-lg uppercase text-[10px] tracking-[0.2em] h-11 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Link href="/admin">Login</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}