"use client"

import Link from "next/link"
import { Search, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/brand/Logo"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0F172A] border-b border-white/5 py-1">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo variant="light" />

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-white/80">
          <Link href="/" className="hover:text-primary transition-colors text-primary">Home</Link>
          <Link href="/exams" className="hover:text-primary transition-colors">Exams</Link>
          <Link href="/mocks" className="hover:text-primary transition-colors">Mocks</Link>
          <Link href="/pyqs" className="hover:text-primary transition-colors">PYQs</Link>
          <Link href="/current-affairs" className="hover:text-primary transition-colors">Current Affairs</Link>
          <Link href="/notifications" className="hover:text-primary transition-colors">Notifications</Link>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white/60 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          <Button className="bg-primary hover:bg-primary/90 text-white font-black px-6 rounded-lg uppercase text-xs tracking-widest">
            Login
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}