import Link from "next/link"

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'dark' }: LogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative h-10 w-10 flex items-center justify-center">
        {/* Punjab Map Outline SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`h-10 w-10 ${isDark ? 'text-secondary' : 'text-white'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M50 5 L70 15 L85 40 L80 70 L50 95 L20 70 L15 40 L30 15 Z" strokeLinecap="round" strokeLinejoin="round" />
          {/* Checkmark inside */}
          <path
            d="M38 52 L46 60 L62 40"
            className="text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-headline text-2xl font-black tracking-tighter uppercase leading-none">
          <span className={isDark ? 'text-secondary' : 'text-white'}>CRACK</span>
          <span className="text-primary">LIX</span>
        </span>
        <div className="flex items-center gap-1">
          <div className="h-[2px] w-3 bg-primary" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground font-black leading-none whitespace-nowrap">
            Punjab Exam Preparation
          </span>
          <div className="h-[2px] w-3 bg-primary" />
        </div>
      </div>
    </Link>
  )
}