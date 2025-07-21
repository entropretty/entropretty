"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // If theme is system and we haven't set a preference before, keep it as system initially
    // But if user interacts with the toggle, we'll only use light/dark from then on
    const hasUserPreference = localStorage.getItem("theme")
    if (!hasUserPreference && theme === "system") {
      // Keep system as initial state, but once user clicks, we'll switch to explicit themes
      return
    }

    // If we have a stored preference but it's system, default to light
    if (hasUserPreference === "system") {
      setTheme("light")
    }
  }, [theme, setTheme])

  if (!mounted) return null

  const cycleTheme = () => {
    // Only toggle between light and dark
    if (theme === "light" || theme === "system") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />
    }
    // For light or system (initial), show sun icon
    return <Sun className="h-4 w-4" />
  }

  const getThemeLabel = () => {
    if (theme === "dark") {
      return "Dark"
    }
    // For light or system (initial), show light label
    return "Light"
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="bg-background/80 border-border/40 hover:bg-accent/80 fixed right-4 top-4 z-50 backdrop-blur-sm transition-all duration-200"
      title={`Current theme: ${getThemeLabel()}. Click to toggle theme.`}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
