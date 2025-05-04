'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  const handMode = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }
  return (
    <Button
      id="btn-mode"
      className=" bg-transparent hover:bg-transparent
         hover:opacity-80 cursor-pointer"
      onClick={handMode}

    >
      {theme === "dark" ? (
        <span className="flex flex-row items-center gap-3">
          <Sun className="text-foreground " />
        </span>
      ) : (
        <span id="sunIcon" className="flex flex-row items-center gap-3">
          <Moon className="text-foreground  " />
        </span>
      )}
    </Button>
  )
}

export default ThemeSwitch