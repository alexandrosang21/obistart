"use client"

import * as React from "react"
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, MapPin, Search, Loader2, X } from "lucide-react"
import { useState } from "react"

interface WeatherData {
  current: {
    temperature_2m: number
    weather_code: number
  }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
  }
}

interface Location {
  lat: number
  lon: number
  name: string
  country?: string
}

const WEATHER_CODES: Record<number, { icon: React.ReactNode; label: string }> = {
  0: { icon: <Sun className="w-4 h-4" />, label: "Clear" },
  1: { icon: <Sun className="w-4 h-4" />, label: "Mainly clear" },
  2: { icon: <Cloud className="w-4 h-4" />, label: "Partly cloudy" },
  3: { icon: <Cloud className="w-4 h-4" />, label: "Overcast" },
  45: { icon: <Cloud className="w-4 h-4" />, label: "Foggy" },
  48: { icon: <Cloud className="w-4 h-4" />, label: "Depositing rime fog" },
  51: { icon: <CloudDrizzle className="w-4 h-4" />, label: "Light drizzle" },
  53: { icon: <CloudDrizzle className="w-4 h-4" />, label: "Moderate drizzle" },
  55: { icon: <CloudDrizzle className="w-4 h-4" />, label: "Dense drizzle" },
  61: { icon: <CloudRain className="w-4 h-4" />, label: "Slight rain" },
  63: { icon: <CloudRain className="w-4 h-4" />, label: "Moderate rain" },
  65: { icon: <CloudRain className="w-4 h-4" />, label: "Heavy rain" },
  71: { icon: <CloudSnow className="w-4 h-4" />, label: "Slight snow" },
  73: { icon: <CloudSnow className="w-4 h-4" />, label: "Moderate snow" },
  75: { icon: <CloudSnow className="w-4 h-4" />, label: "Heavy snow" },
  80: { icon: <CloudRain className="w-4 h-4" />, label: "Rain showers" },
  81: { icon: <CloudRain className="w-4 h-4" />, label: "Moderate rain showers" },
  82: { icon: <CloudRain className="w-4 h-4" />, label: "Violent rain showers" },
  95: { icon: <CloudLightning className="w-4 h-4" />, label: "Thunderstorm" },
  96: { icon: <CloudLightning className="w-4 h-4" />, label: "Thunderstorm with hail" },
  99: { icon: <CloudLightning className="w-4 h-4" />, label: "Thunderstorm with heavy hail" },
}

function getWeatherInfo(code: number) {
  return WEATHER_CODES[code] || { icon: <Cloud className="w-4 h-4" />, label: "Unknown" }
}

export function WeatherWidget() {
  const [weather, setWeather] = React.useState<WeatherData | null>(null)
  const [location, setLocation] = React.useState<Location | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [searching, setSearching] = useState(false)

  const loadWeather = React.useCallback(async (lat: number, lon: number, name?: string, country?: string) => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
      )
      const data = await response.json()
      setWeather(data)
      setLocation({ lat, lon, name: name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`, country })
    } catch (error) {
      console.error("Failed to fetch weather:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // Check for saved location
    const savedLocation = localStorage.getItem("obistart-weather-location")
    if (savedLocation) {
      const loc = JSON.parse(savedLocation)
      loadWeather(loc.lat, loc.lon, loc.name, loc.country)
    } else {
      // Default to London if no saved location
      loadWeather(51.5074, -0.1278, "London", "UK")
    }
  }, [loadWeather])

  const searchCity = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      )
      const data = await response.json()
      const results = data.results?.map((r: any) => ({
        lat: r.latitude,
        lon: r.longitude,
        name: r.name,
        country: r.country_code
      })) || []
      setSearchResults(results)
    } catch (error) {
      console.error("Failed to search city:", error)
    } finally {
      setSearching(false)
    }
  }

  const selectLocation = (loc: Location) => {
    localStorage.setItem("obistart-weather-location", JSON.stringify(loc))
    loadWeather(loc.lat, loc.lon, loc.name, loc.country)
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground/40">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Weather loading...</span>
      </div>
    )
  }

  if (!weather || !location) return null

  const currentInfo = getWeatherInfo(weather.current.weather_code)

  return (
    <div className="relative">
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors group"
           onClick={() => setSearchOpen(!searchOpen)}>
        {currentInfo.icon}
        <span>{Math.round(weather.current.temperature_2m)}°</span>
        <span className="opacity-50">{location.name}</span>
        <MapPin className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {searchOpen && (
        <div className="fixed top-14 left-6 w-64 bg-background border rounded-lg shadow-lg p-3 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchCity(e.target.value)
                }}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-muted rounded-md border-0 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {searching && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          <div className="max-h-40 overflow-y-auto">
            {searchResults.map((result, i) => (
              <button
                key={i}
                onClick={() => selectLocation(result)}
                className="w-full text-left px-2 py-1.5 text-xs hover:bg-muted rounded-md transition-colors truncate"
              >
                {result.name}, {result.country}
              </button>
            ))}
          </div>

          {/* Mini forecast */}
          {!searchQuery && !searching && searchResults.length === 0 && weather.daily && weather.daily.time && (
            <div className="pt-2 border-t mt-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                {weather.daily.time.slice(1, 4).map((date, i) => {
                  const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' })
                  const code = weather.daily?.weather_code?.[i + 1]
                  const temp = weather.daily?.temperature_2m_max?.[i + 1]
                  if (code === undefined || temp === undefined) return null
                  const info = getWeatherInfo(code)
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] opacity-50">{dayName}</span>
                      {info.icon}
                      <span className="text-[10px]">
                        {Math.round(temp)}°
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
