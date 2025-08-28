'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup type="single" value={theme} className="h-8 sm:h-9">
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark"
        onClick={() => setTheme('dark')}
        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
      >
        <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        aria-label="Toggle light"
        onClick={() => setTheme('light')}
        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
      >
        <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system"
        onClick={() => setTheme('system')}
        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
      >
        <SunMoon className="h-3 w-3 sm:h-4 sm:w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
