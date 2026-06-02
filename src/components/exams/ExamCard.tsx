import { Exam } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ArrowRight } from "lucide-react"

interface ExamCardProps {
  exam: Exam
}

export default function ExamCard({ exam }: ExamCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === exam.thumbnail)

  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-all border-foreground/5 bg-card/50 hover:bg-card">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={placeholder?.imageUrl || "https://picsum.photos/seed/default/400/250"}
          alt={exam.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint={placeholder?.imageHint || "education"}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-secondary text-white font-black uppercase tracking-wider text-[10px] border-none px-3 py-1">
            {exam.category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl font-black group-hover:text-primary transition-colors">{exam.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {exam.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-foreground/5">
        <div className="flex flex-col">
          <span className="text-xl font-black text-secondary">{exam.totalMocks}</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Mock Tests</span>
        </div>
        <Button asChild variant="outline" className="font-bold border-primary/20 hover:bg-primary hover:text-white transition-all group/btn">
          <Link href={`/exams/${exam.id}`} className="flex items-center">
            View Details <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
