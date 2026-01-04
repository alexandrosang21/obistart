"use client"

import * as React from "react"
import { DailyWidget } from "@/components/daily-widget"
import { PomodoroWidget } from "@/components/pomodoro-timer"
import { WhatsOnYourMind } from "@/components/whats-on-your-mind"
import { Onboarding } from "@/components/onboarding"
import { SettingsDialog } from "@/components/settings-dialog"
import { SoundPlayer } from "@/components/sound-player"
import { DailyNews } from "@/components/daily-news"
import { WeatherWidget } from "@/components/weather-widget"

export default function Home() {
  const [time, setTime] = React.useState<string>("")
  const [greeting, setGreeting] = React.useState("")
  const [userName, setUserName] = React.useState("User")
  const [showOnboarding, setShowOnboarding] = React.useState(false)

  React.useEffect(() => {
    // Check for user name
    const savedName = localStorage.getItem("obistart-user-name")
    if (savedName) {
      setUserName(savedName)
    } else {
      // Small delay to ensure smooth hydration/mounting before showing dialog
      setTimeout(() => setShowOnboarding(true), 500)
    }

    // Clock logic
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }))
      
      const hour = now.getHours()
      if (hour < 12) setGreeting("Good morning")
      else if (hour < 18) setGreeting("Good afternoon")
      else setGreeting("Good evening")
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleOnboardingComplete = (name: string) => {
    setUserName(name)
    localStorage.setItem("obistart-user-name", name)
    setShowOnboarding(false)
  }

  const handleNameChange = (name: string) => {
    setUserName(name)
    localStorage.setItem("obistart-user-name", name)
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-background text-foreground transition-colors duration-500 selection:bg-primary/20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Top Bar for Widget */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-center items-start z-20">
        <DailyWidget />
      </header>

      {/* Weather Widget - Top Right */}
      <div className="absolute top-6 right-6 z-20 pointer-events-auto">
        <WeatherWidget />
      </div>

      {/* Main Center Content: Time, Greeting, Focus */}
      <main className="z-10 absolute inset-0 flex flex-col items-center justify-center gap-8 p-4">
        
        <div className="flex flex-col items-center text-center gap-2">
            {time && (
                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-foreground select-none animate-in fade-in zoom-in-50 duration-1000">
                {time}
                </h1>
            )}
            <p className="text-xl md:text-2xl font-light text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
                {greeting}, {userName}.
            </p>
        </div>

        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <WhatsOnYourMind />
        </div>

      </main>

      {/* Bottom Section: Timer and Footer */}
      <div className="absolute bottom-0 w-full p-6 z-20 pointer-events-none">
        <div className="flex flex-col items-end gap-3 md:flex-row md:justify-between">
          <DailyNews />

          <footer className="text-xs text-muted-foreground/40 pointer-events-auto flex items-center gap-4 order-3 md:-order-1">
            <SettingsDialog currentName={userName} onNameChange={handleNameChange} />
            <span>Obistart &copy; {new Date().getFullYear()}</span>
          </footer>

          <div className="pointer-events-auto flex gap-4 order-2">
            <SoundPlayer />
            <PomodoroWidget />
          </div>
        </div>
      </div>

      <Onboarding open={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
}
