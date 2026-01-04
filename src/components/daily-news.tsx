"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
}

export function DailyNews() {
  const [news, setNews] = React.useState<NewsItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using Hacker News official Firebase API
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        )
        const storyIds = await response.json()

        // Get first 4 stories
        const top4Ids = storyIds.slice(0, 4)
        const storyPromises = top4Ids.map(async (id: string) => {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          )
          return storyResponse.json()
        })

        const stories = await Promise.all(storyPromises)

        const newsItems: NewsItem[] = stories
          .filter((story) => story?.url)
          .map((story) => ({
            id: story.id,
            title: story.title,
            url: story.url,
            source: "HN"
          }))

        setNews(newsItems)
      } catch (error) {
        console.error("Failed to fetch news:", error)
        // Fallback to empty array on error
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh every 30 minutes
    const interval = setInterval(fetchNews, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-xs text-muted-foreground/40">
        <span className="animate-pulse">Loading news...</span>
      </div>
    )
  }

  if (news.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground/60 pointer-events-auto max-w-md">
      <span className="font-medium opacity-50">Top stories</span>
      <div className="flex flex-col gap-1.5">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 hover:text-foreground transition-colors max-w-[350px]"
            title={item.title}
          >
            <span className="truncate">{item.title}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  )
}
