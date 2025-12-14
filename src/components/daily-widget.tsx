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

  React.useEffect(() => {
    const now = new Date()
    setDate(now)
    
    // Check for special day
    const dayKey = `${now.getMonth() + 1}-${now.getDate()}`
    setSpecialDay(SPECIAL_DAYS[dayKey] || null)

    // Random quote based on day (deterministic per day)
    const quoteIndex = (now.getDate() + now.getMonth()) % QUOTES.length
    setQuote(QUOTES[quoteIndex])
  }, [])

  if (!date) return null // Hydration fix

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

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

      {!specialDay && (
         <div className="text-muted-foreground/60 text-sm italic">
           &quot;{quote}&quot;
         </div>
      )}
    </div>
  )
}
