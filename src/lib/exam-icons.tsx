import { Shield, GraduationCap, Scale, Zap, Stethoscope, Landmark, BookOpen } from "lucide-react"

export const PsssbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="M8 11h8" /><path d="M12 7v8" />
  </svg>
)

export const PpscIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
    <path d="M12 3v19M5 8h14M15 13H9M12 8c0-3 3-5 3-5M12 8c0-3-3-5-3-5" />
  </svg>
)

export const PoliceIcon = () => <Shield className="h-8 w-8" />

export const TeachingIcon = () => <BookOpen className="h-8 w-8" />

export const JusticeIcon = () => <Scale className="h-8 w-8" />

export const PowerIcon = () => <Zap className="h-8 w-8" />

export const MedIcon = () => <Stethoscope className="h-8 w-8" />

export const BankIcon = () => <Landmark className="h-8 w-8" />