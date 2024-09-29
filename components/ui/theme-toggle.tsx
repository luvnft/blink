"use client"

import React from 'react'
import { useTheme } from '@/components/ui/theme-provider'
import { Button } from "@/components/ui/button"
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}