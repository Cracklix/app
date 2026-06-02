"use client"

import Link from "next/link"
import { ShieldCheck, BookOpen, GraduationCap, ClipboardList, Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
             <svg
              viewBox="0 0 100 100"
              className="h-8 w-8 text-white"
              fill="currentColor"
            >
              <path d="M50 5 L70 15 L85 40 L80 70 L50 95 L20 70 L15 40 L30 15 Z" />
              <path
                d="M35 50 L45 60 L65 40"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-headline text-2xl font-black tracking-tighter uppercase leading-none">
              CRACK<span className="text-primary">LIX</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">
              Punjab Exam Prep
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <Link href="/" className="hover:text-primary transition-colors text-primary">Home</Link>
          <Link href="/exams" className="hover:text-primary transition-colors">Exams</Link>
          <Link href="/mocks" className="hover:text-primary transition-colors">Mocks</Link>
          <Link href="/pyqs" className="hover:text-primary transition-colors">PYQs</Link>
          <Link href="/current-affairs" className="hover:text-primary transition-colors">Current Affairs</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
          </Button>
          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />
          <Button variant="outline" className="hidden sm:flex font-bold border-primary/20 hover:bg-primary/5">
            Log In
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-6">
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  )
}
