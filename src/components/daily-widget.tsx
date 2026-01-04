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

const FALLBACK_QUOTES = [
  "The best way to predict the future is to create it.",
  "Focus on being productive instead of busy.",
  "Do one thing every day that scares you.",
  "Your time is limited, so don't waste it living someone else's life.",
  "Simplicity is the ultimate sophistication."
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

    // Fetch quote from API
    const fetchQuote = async () => {
      try {
        // Try the /random endpoint
        const response = await fetch("https://api.quotable.io/random?tags=motivational,inspirational")
        if (response.ok) {
          const data = await response.json()
          // API returns an array, get first item
          const quoteData = Array.isArray(data) ? data[0] : data
          if (quoteData?.content) {
            setQuote(quoteData.content)
            setAuthor(quoteData.author)
            return
          }
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error)
      }

      // Fallback to local quotes
      const quoteIndex = (now.getDate() + now.getMonth()) % FALLBACK_QUOTES.length
      setQuote(FALLBACK_QUOTES[quoteIndex])
      setAuthor(null)
    }

    fetchQuote()
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
