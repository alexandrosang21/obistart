"use client"

import * as React from "react"
import { Headphones, Volume2, VolumeX, Play, Pause, Info, Radio, CloudRain, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SOUNDS = [
  { 
    id: "rain", 
    name: "Rainy Mood", 
    src: "/sounds/rain.ogg",
    type: "ambient",
    description: "Continuous soothing rain sound for deep focus and relaxation." 
  },
  { 
    id: "coffee", 
    name: "Coffee Shop", 
    src: "/sounds/coffee.ogg",
    type: "ambient",
    description: "Ambient background noise of a busy coffee shop." 
  },
  { 
    id: "lofi", 
    name: "Lofi Girl", 
    src: "https://boxradio-edge-10.streamafrica.net/lofi",
    type: "radio",
    description: "Soothing lofi music, gentle, relaxing rhythms perfectly suitable for work sessions that need high concentration."
  },
  { 
    id: "chillsky", 
    name: "Chillsky Radio", 
    src: "https://chill.radioca.st/stream",
    type: "radio",
    description: "Lofi Hip Hop & Chilled beats 24/7. Youtube free, advert free beats always available."
  },
  { 
    id: "vaporwave", 
    name: "Nightwave Plaza", 
    src: "https://radio.plaza.one/mp3",
    type: "radio",
    description: "A free 24/7 online vaporwave radio station. The broadcast also includes some future funk and experimental genres."
  },
  { 
    id: "code", 
    name: "Code Radio", 
    src: "https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/low.mp3",
    type: "radio",
    description: "24/7 music designed for coding by FreeCodeCamp."
  },
]

export function SoundPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [volume, setVolume] = React.useState([0.5])
  const [selectedSound, setSelectedSound] = React.useState(SOUNDS[0].id)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0]
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSoundChange = (value: string) => {
    setSelectedSound(value)
    const wasPlaying = isPlaying
    
    // Changing src automatically stops playback in most browsers, need to resume if was playing
    // We'll let the effect or ref handler manage it, but simple wait is needed
    setTimeout(() => {
        if (wasPlaying && audioRef.current) {
            audioRef.current.play()
        }
    }, 100)
  }

  const activeSound = SOUNDS.find(s => s.id === selectedSound)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
            variant={isPlaying ? "default" : "secondary"} 
            size="icon" 
            className={`rounded-full shadow-lg w-12 h-12 transition-all duration-300 ${isPlaying ? "animate-pulse ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"}`}
        >
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="center">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Ambient Focus</h4>
            <p className="text-sm text-muted-foreground">
              Play background sounds to stay focused.
            </p>
          </div>
          
          <div className="grid gap-4">
             <div className="flex items-center gap-2">
                <Select value={selectedSound} onValueChange={handleSoundChange}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                        {SOUNDS.map(sound => (
                            <SelectItem key={sound.id} value={sound.id}>
                                <div className="flex items-center gap-2">
                                    {sound.type === "radio" && <Radio className="w-3 h-3 text-primary/70" />}
                                    {sound.id === "rain" && <CloudRain className="w-3 h-3 text-blue-400" />}
                                    {sound.id === "coffee" && <Coffee className="w-3 h-3 text-amber-600" />}
                                    <span>{sound.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                        <Info className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      {activeSound?.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button size="icon" variant="outline" onClick={togglePlay}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
             </div>

             <div className="flex items-center gap-4">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <Slider 
                    value={volume} 
                    max={1} 
                    step={0.01} 
                    onValueChange={setVolume} 
                    className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </div>
      </PopoverContent>
      
      <audio 
        ref={audioRef}
        src={activeSound?.src}
        loop
        className="hidden"
      />
    </Popover>
  )
}
