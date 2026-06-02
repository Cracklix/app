"use client"

import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/brand/Logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const links = [
    { label: "Exams", href: "/exams" },
    { label: "Mock Tests", href: "/mocks" },
    { label: "Results", href: "/results" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Logo variant="dark" />

        <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-gray-600">
          {links.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-secondary transition-colors">
            Login
          </Link>
          <Button asChild size="sm" className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90 text-white font-black px-6 rounded-lg shadow-lg shadow-blue-200">
            <Link href="/mocks">Start Free Mock</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
