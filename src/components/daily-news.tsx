"use client"

import * as React from "react"
import { ExternalLink, ChevronDown } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
}

const INITIAL_COUNT = 4

export function DailyNews() {
  const [news, setNews] = React.useState<NewsItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch from Hacker News
        const hnResponse = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        )
        const storyIds = await hnResponse.json()

        const hnPromises = storyIds.slice(0, 6).map(async (id: string) => {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          )
          const story = await storyResponse.json()
          return story?.url ? {
            id: `hn-${story.id}`,
            title: story.title,
            url: story.url,
            source: "HN"
          } : null
        })

        // Fetch from dev.to using rss2json
        const devtoResponse = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https://dev.to/feed"
        )
        const devtoData = await devtoResponse.json()

        const devtoItems = devtoData.items?.slice(0, 6).map((item: any) => ({
          id: `devto-${item.guid}`,
          title: item.title,
          url: item.link,
          source: "DEV"
        })) || []

        const hnItems = (await Promise.all(hnPromises)).filter(Boolean)

        // Interleave: 1 HN, 1 DEV, 1 HN, 1 DEV...
        const allItems: NewsItem[] = []
        for (let i = 0; i < Math.max(hnItems.length, devtoItems.length); i++) {
          if (hnItems[i]) allItems.push(hnItems[i])
          if (devtoItems[i]) allItems.push(devtoItems[i])
        }

        setNews(allItems.slice(0, 10))
      } catch (error) {
        console.error("Failed to fetch news:", error)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    const interval = setInterval(fetchNews, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const visibleNews = expanded ? news : news.slice(0, INITIAL_COUNT)
  const hasMore = news.length > INITIAL_COUNT

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
        {visibleNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 hover:text-foreground transition-colors max-w-[350px]"
            title={item.title}
          >
            <span className="truncate">{item.title}</span>
            <span className="shrink-0 text-[10px] opacity-30">•{item.source}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 hover:text-foreground transition-colors mt-1 opacity-50 hover:opacity-100"
          >
            <span>{expanded ? "Show less" : "Show more"}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </div>
  )
}
