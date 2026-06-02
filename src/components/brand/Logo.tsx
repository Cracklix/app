import Link from "next/link"

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'dark' }: LogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <Link href="/" className={`flex items-center gap-3 group transition-transform hover:scale-[1.02] ${className}`}>
      <div className="relative h-12 w-12 flex items-center justify-center">
        {/* Punjab Map Outline SVG - High Premium Detail */}
        <svg
          viewBox="0 0 100 100"
          className={`h-12 w-12 ${isDark ? 'text-[#0F172A]' : 'text-white'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path 
            d="M52 5 L68 12 L82 35 L88 55 L78 85 L50 96 L25 88 L12 65 L8 40 L22 15 Z" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-sm"
          />
          {/* Neon Orange Checkmark inside */}
          <path
            d="M38 52 L48 62 L65 38"
            className="text-[#F97316]"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Glow effect for dark variant */}
        {!isDark && <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10" />}
      </div>
      <div className="flex flex-col">
        <span className="font-headline text-3xl font-black tracking-tighter uppercase leading-none">
          <span className={isDark ? 'text-[#0F172A]' : 'text-white'}>CRACK</span>
          <span className="text-[#F97316]">LIX</span>
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="h-[2px] w-4 bg-[#F97316]" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-black leading-none whitespace-nowrap">
            Punjab Exam Expert
          </span>
        </div>
      </div>
    </Link>
  )
}
