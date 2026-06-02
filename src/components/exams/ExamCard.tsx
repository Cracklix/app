import { Exam } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { PsssbIcon, PpscIcon, PoliceIcon, TeachingIcon, JusticeIcon, PowerIcon, MedIcon, BankIcon } from "@/lib/exam-icons"

interface ExamCardProps {
  exam: Exam
  label?: string
}

export default function ExamCard({ exam, label }: ExamCardProps) {
  const displayTitle = label || exam.title;
  const category = label || exam.category;

  // Map categories to specific styles and icons from the design
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case "PSSSB": return { bg: "bg-[#F0F7FF]", color: "text-[#3B82F6]", icon: <PsssbIcon /> };
      case "PPSC": return { bg: "bg-[#F0FDF4]", color: "text-[#22C55E]", icon: <PpscIcon /> };
      case "Punjab Police": return { bg: "bg-[#FFF1F2]", color: "text-[#F43F5E]", icon: <PoliceIcon /> };
      case "Teaching Exams": return { bg: "bg-[#F5F3FF]", color: "text-[#8B5CF6]", icon: <TeachingIcon /> };
      case "High Court": return { bg: "bg-[#F8FAFC]", color: "text-[#64748B]", icon: <JusticeIcon /> };
      case "PSPCL & PSTCL": return { bg: "bg-[#FFFBEB]", color: "text-[#F59E0B]", icon: <PowerIcon /> };
      case "BFUHS": return { bg: "bg-[#ECFEFF]", color: "text-[#06B6D4]", icon: <MedIcon /> };
      case "Banking & Cooperative": return { bg: "bg-[#FFF7ED]", color: "text-[#EA580C]", icon: <BankIcon /> };
      default: return { bg: "bg-muted/30", color: "text-muted-foreground", icon: null };
    }
  }

  const styles = getCategoryStyles(category);

  return (
    <Link href={`/exams?board=${encodeURIComponent(category)}`}>
      <Card className={`group border-none ${styles.bg} hover:shadow-xl transition-all duration-300 rounded-2xl p-6 text-center h-full flex flex-col justify-center border-b-4 border-transparent hover:border-primary/20`}>
        <CardContent className="p-0 flex flex-col items-center">
          <div className={`h-16 w-16 mb-4 flex items-center justify-center ${styles.color} group-hover:scale-110 transition-transform`}>
            {styles.icon}
          </div>
          <h3 className="font-headline text-xl font-black mb-1 text-secondary group-hover:text-primary transition-colors">{displayTitle}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {exam.totalMocks}+ Exams
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {(exam.activeQuestions / 10).toFixed(0)}+ Mocks
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
