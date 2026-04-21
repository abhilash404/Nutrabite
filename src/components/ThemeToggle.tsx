"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-0" />
      </button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <button 
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-config shadow-sm overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-full h-full">
         <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${theme === "dark" ? '-rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100 text-amber-500'}`} />
         <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${theme === "dark" ? 'rotate-0 opacity-100 scale-100 text-sky-400' : 'rotate-90 opacity-0 scale-0'}`} />
      </div>
    </button>
  )
}
