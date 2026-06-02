import Link from "next/link"

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light';
  
  return (
    <Link href="/" className={`flex items-center gap-3 group transition-all hover:scale-[1.02] ${className}`}>
      <div className="relative h-11 w-11 flex items-center justify-center">
        {/* Special Punjab Map SVG Logo with Integrated Checkmark */}
        <svg
          viewBox="0 0 100 100"
          className={`h-full w-full ${isLight ? 'text-white' : 'text-[#0F172A]'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          {/* Detailed Punjab Map Outline */}
          <path 
            d="M52 5 L68 12 L82 35 L88 55 L78 85 L50 96 L25 88 L12 65 L8 40 L22 15 Z" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Integrated Victory Checkmark in Brand Orange */}
          <path
            d="M35 55 L48 65 L72 35"
            className="text-[#F97316]"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline text-3xl font-black tracking-tighter uppercase">
          <span className={isLight ? 'text-white' : 'text-[#0F172A]'}>CRACK</span>
          <span className="text-[#F97316]">LIX</span>
        </span>
        <span className={`text-[8px] uppercase tracking-[0.3em] font-black mt-1 ${isLight ? 'text-white/60' : 'text-muted-foreground'}`}>
          Punjab Exam Preparation
        </span>
      </div>
    </Link>
  )
}