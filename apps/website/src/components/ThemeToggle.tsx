"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Always set theme to system to follow user's OS preferences
    setTheme("system")
  }, [setTheme])

  // Don't render any UI - just handle the system theme setting
  return null
}
