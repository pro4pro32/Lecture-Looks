"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "soft-pink", label: "Soft Pink", icon: Sparkles },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-1 rounded-full border border-rose-200/20 bg-zinc-950/70 p-1">
      {THEMES.map((item) => {
        const active = theme === item.id
        const Icon = item.icon

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            aria-pressed={active}
            aria-label={`Motyw ${item.label}`}
            className={
              active
                ? "bg-rose-500/30 text-rose-100"
                : "text-zinc-300 hover:text-zinc-100"
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
