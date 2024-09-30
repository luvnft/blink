'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Gift, Coins, ShoppingBag, Palette, Layers, Settings, Users, Heart, Repeat, ChevronRight, ChevronLeft, Moon, Sun, LogOut } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from 'next-themes'

const navItems = [
  { 
    name: 'Overview', 
    icon: BarChart2, 
    href: '/blinkboard' 
  },
  { 
    name: 'Assets', 
    icon: Palette, 
    href: '/blinkboard/assets',
    subItems: [
      { name: 'NFT', icon: Palette, href: '/blinkboard/assets/nft' },
      { name: 'Tokens', icon: Coins, href: '/blinkboard/assets/tokens' },
    ]
  },
  { name: 'Payments', icon: Coins, href: '/blinkboard/payments' },
  { name: 'Donations', icon: Heart, href: '/blinkboard/donations' },
  { name: 'Commerce', icon: ShoppingBag, href: '/blinkboard/commerce' },
  { name: 'Gift', icon: Gift, href: '/blinkboard/gift' },
  { name: 'Swap', icon: Repeat, href: '/blinkboard/swap' },
  { name: 'Staking', icon: Layers, href: '/blinkboard/staking' },
  { name: 'DAO', icon: Users, href: '/blinkboard/dao' },
  { name: 'Settings', icon: Settings, href: '/blinkboard/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleCollapse()
    }
  }, [toggleCollapse])

  const renderNavItem = useCallback((item: typeof navItems[0], isSubItem = false) => {
    const Icon = item.icon
    const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href))

    return (
      <Tooltip key={item.name}>
        <TooltipTrigger asChild>
          <Link 
            href={item.href}
            className={`flex items-center p-2 ${isSubItem ? 'pl-8' : ''} rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <span className={`${isActive ? 'text-primary' : 'text-[#D0BFB4]'}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-[#D0BFB4]'}`} />
            </span>
            {!isCollapsed && <span className={`ml-3 ${isActive ? 'text-primary font-medium' : 'text-gray-700 dark:text-gray-300'}`}>{item.name}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    )
  }, [isCollapsed, pathname])

  const renderNavItems = useMemo(() => navItems.map(item => (
    <div key={item.name}>
      {item.subItems ? (
        <Collapsible>
          <CollapsibleTrigger className="w-full">
            {renderNavItem(item)}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {item.subItems.map(subItem => renderNavItem(subItem, true))}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        renderNavItem(item)
      )}
    </div>
  )), [renderNavItem])

  return (
    <TooltipProvider>
      <div 
        className={`bg-white dark:bg-gray-800 h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        role="navigation"
      >
        <div className="p-4 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
          <img
            src="https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"
            alt="BARK BLINK logo"
            className="w-10 h-10 rounded-full"
          />
          {!isCollapsed && <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">Blinkboard</h1>}
        </div>
        <ScrollArea className="flex-grow py-4">
          <nav className="space-y-1 px-3">
            {renderNavItems}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className={`${isCollapsed ? 'mx-auto' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-[#D0BFB4]" /> : <Moon className="h-5 w-5 text-[#D0BFB4]" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              onKeyDown={handleKeyDown}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`${isCollapsed ? 'mx-auto' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5 text-[#D0BFB4]" /> : <ChevronLeft className="h-5 w-5 text-[#D0BFB4]" />}
            </Button>
          </div>
          {!isCollapsed && (
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="https://ucarecdn.com/6fb2af1b-978f-4a8f-bd5c-b68db4458c9d/Barker.png" alt="User avatar" />
                <AvatarFallback>BP</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Barker</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">support@barkprotocol.net</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-5 w-5 text-[#D0BFB4]" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}