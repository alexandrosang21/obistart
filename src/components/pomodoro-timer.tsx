"use client"

import * as React from "react"
import { Play, Pause, RotateCcw, Settings, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60)
  const [isActive, setIsActive] = React.useState(false)
  const [duration, setDuration] = React.useState(25) // minutes
  const [progress, setProgress] = React.useState(100)
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Sound player
  const playAlarm = React.useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e)
    }
  }, [])

  // Initialize from LocalStorage
  React.useEffect(() => {
    const savedDuration = localStorage.getItem("obistart-pomodoro-duration")
    if (savedDuration) setDuration(parseInt(savedDuration))

    const targetTime = localStorage.getItem("obistart-pomodoro-target")
    if (targetTime) {
      const target = parseInt(targetTime)
      const now = Date.now()
      const diff = Math.ceil((target - now) / 1000)

      if (diff > 0) {
        setTimeLeft(diff)
        setIsActive(true)
      } else {
        setTimeLeft(0)
        setIsActive(false)
        localStorage.removeItem("obistart-pomodoro-target")
        // Optionally play sound here if we want to notify on load that it finished,
        // but might be annoying.
      }
    } else {
      const savedLeft = localStorage.getItem("obistart-pomodoro-left")
      if (savedLeft) setTimeLeft(parseInt(savedLeft))
    }
  }, [])

  // Timer Tick Logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        const targetTime = localStorage.getItem("obistart-pomodoro-target")
        if (targetTime) {
          const diff = Math.ceil((parseInt(targetTime) - Date.now()) / 1000)
          
          if (diff <= 0) {
             setTimeLeft(0)
             setIsActive(false)
             setProgress(0)
             localStorage.removeItem("obistart-pomodoro-target")
             localStorage.removeItem("obistart-pomodoro-left")
             playAlarm()
             if (interval) clearInterval(interval)
          } else {
             setTimeLeft(diff)
             setProgress((diff / (duration * 60)) * 100)
          }
        } else {
           // Fallback if localStorage missing but active (shouldn't happen with new logic)
           setIsActive(false)
        }
      }, 500) // Check twice a second for smoother UI
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, duration, playAlarm])

  const startTimer = () => {
    const target = Date.now() + timeLeft * 1000
    localStorage.setItem("obistart-pomodoro-target", target.toString())
    setIsActive(true)
  }

  const pauseTimer = () => {
    localStorage.removeItem("obistart-pomodoro-target")
    localStorage.setItem("obistart-pomodoro-left", timeLeft.toString())
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    const newTime = duration * 60
    setTimeLeft(newTime)
    setProgress(100)
    localStorage.removeItem("obistart-pomodoro-target")
    localStorage.setItem("obistart-pomodoro-left", newTime.toString())
  }

  const toggleTimer = () => {
    if (isActive) pauseTimer()
    else startTimer()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setDuration(newDuration)
    localStorage.setItem("obistart-pomodoro-duration", newDuration.toString())
    
    // Reset timer with new duration
    const newTime = newDuration * 60
    setTimeLeft(newTime)
    setProgress(100)
    setIsActive(false)
    localStorage.removeItem("obistart-pomodoro-target")
    localStorage.setItem("obistart-pomodoro-left", newTime.toString())
  }

  const activeColor = timeLeft < 60 ? "text-red-500" : "text-primary"

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
            variant="outline" 
            size={isActive ? "default" : "icon"} 
            className={`
                rounded-full transition-all duration-300 shadow-lg border-white/10 bg-background/50 backdrop-blur-md
                ${isActive ? "px-4 w-auto gap-2" : "h-12 w-12"}
            `}
        >
            {isActive ? (
                <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                </>
            ) : (
                <Timer className="h-6 w-6" />
            )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0 border-none shadow-2xl bg-transparent">
        <Card className="w-full backdrop-blur-xl bg-card/90 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium tracking-tight">Focus Timer</CardTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                         <div className="grid gap-4 py-2">
                            <div className="flex items-center justify-between">
                                <Label>Duration (minutes)</Label>
                                <span className="text-sm text-muted-foreground">{duration}m</span>
                            </div>
                            <Slider
                                defaultValue={[duration]}
                                max={60}
                                step={1}
                                min={5}
                                onValueChange={handleDurationChange}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pb-6">
                <div className="relative flex items-center justify-center w-full py-4">
                    <div className={`text-6xl font-bold tracking-tighter tabular-nums drop-shadow-sm font-mono transition-colors ${activeColor}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                
                <Progress value={progress} className="h-1.5 w-full" />

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={toggleTimer}
                    >
                        {isActive ? (
                        <Pause className="h-6 w-6" />
                        ) : (
                        <Play className="h-6 w-6 ml-1" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground hover:text-foreground"
                        onClick={resetTimer}
                    >
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
