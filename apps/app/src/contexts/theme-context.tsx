import { FEATURES } from "@/lib/features"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const THEME_STORAGE_KEY = "entropretty-theme"

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get system theme preference
  const getSystemTheme = (): Theme => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    return "light"
  }

  // Get stored theme from localStorage
  const getStoredTheme = (): Theme | null => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === "light" || stored === "dark") {
        return stored as Theme
      }
    }
    return null
  }

  // Validate theme based on competition mode
  const validateTheme = (candidateTheme: Theme): Theme => {
    // If competition mode is off, force light theme
    if (!FEATURES.isCompetition && candidateTheme === "dark") {
      return "light"
    }
    return candidateTheme
  }

  // Get initial theme with proper priority
  const getInitialTheme = (): Theme => {
    const storedTheme = getStoredTheme()

    if (storedTheme) {
      // Use stored theme but validate it against competition mode
      return validateTheme(storedTheme)
    }

    // No stored theme - use defaults
    if (FEATURES.isCompetition) {
      return getSystemTheme()
    }
    return "light"
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme())

  // Custom setTheme that handles validation and persistence
  const handleSetTheme = (newTheme: Theme) => {
    const validatedTheme = validateTheme(newTheme)
    setTheme(validatedTheme)

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, validatedTheme)
    }
  }

  useEffect(() => {
    // Handle competition mode changes
    const currentStoredTheme = getStoredTheme()
    let newTheme: Theme

    if (currentStoredTheme) {
      // Validate stored theme against current competition mode
      newTheme = validateTheme(currentStoredTheme)
    } else {
      // No stored preference - use defaults
      newTheme = FEATURES.isCompetition ? getSystemTheme() : "light"
    }

    setTheme(newTheme)

    // Update localStorage if theme was changed due to validation
    if (currentStoredTheme && currentStoredTheme !== newTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }

    // Listen for system theme changes only when competition is on and no stored preference
    if (FEATURES.isCompetition && !currentStoredTheme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if no stored preference exists
        if (!getStoredTheme()) {
          setTheme(e.matches ? "dark" : "light")
        }
      }

      mediaQuery.addEventListener("change", handleSystemThemeChange)

      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange)
      }
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: handleSetTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
