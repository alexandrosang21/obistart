"use client"

import * as React from "react"
import { Calendar, Sparkles } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock data for International Days
const SPECIAL_DAYS: Record<string, string> = {
  "1-1": "New Year's Day",
  "2-14": "Valentine's Day",
  "3-8": "International Women's Day",
  "4-22": "Earth Day",
  "5-1": "International Workers' Day",
  "10-1": "International Coffee Day",
  "12-25": "Christmas Day",
  // Add more as needed or fetch from API
}

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
]

export function DailyWidget() {
  const [date, setDate] = React.useState<Date | null>(null)
  const [specialDay, setSpecialDay] = React.useState<string | null>(null)
  const [quote, setQuote] = React.useState("")
  const [author, setAuthor] = React.useState<string | null>(null)

  React.useEffect(() => {
    const now = new Date()
    setDate(now)

    // Check for special day
    const dayKey = `${now.getMonth() + 1}-${now.getDate()}`
    setSpecialDay(SPECIAL_DAYS[dayKey] || null)

    // Pick a quote based on the day (rotates daily)
    const quoteIndex = (now.getFullYear() * 366 + now.getMonth() * 31 + now.getDate()) % QUOTES.length
    const selected = QUOTES[quoteIndex]
    setQuote(selected.text)
    setAuthor(selected.author)
  }, [])

  if (!date) return null // Hydration fix

  // Format date and strip accents for clean uppercase display (fixes Greek 'tonos' on caps)
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="text-sm font-medium tracking-widest text-muted-foreground uppercase flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {formattedDate}
      </div>

      {specialDay && (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                     <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 cursor-pointer hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        It&apos;s {specialDay}!
                     </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Celebrate today!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}

      {!specialDay && quote && (
         <div className="text-muted-foreground/60 text-sm italic text-center max-w-md">
           &quot;{quote}&quot;
           {author && (
             <span className="not-italic opacity-50 block text-xs mt-1">— {author}</span>
           )}
         </div>
      )}
    </div>
  )
}
