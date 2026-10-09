import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const dashboard = { title: 'Dashboard', url: '/account', icon: LayoutDashboard }

interface CustomSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  className?: string
}

export function CustomSidebar({ isCollapsed, onToggle, className }: CustomSidebarProps) {
  const { user } = useAuth()
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // Reset touch end
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only trigger if horizontal movement is greater than vertical (clear horizontal swipe)
    // and meets minimum distance
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      onToggle()
    }
  }

  const menu = [{ ...dashboard, url: user ? '/account' : '/login' }]

  return (
    <>
      {/* Mobile Overlay - only show when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed bottom-0 left-0 right-0 top-16 z-30 bg-black/40 md:hidden"
          onClick={onToggle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      )}

      {/* Mobile swipe area - edge touch areas when sidebar is closed */}
      {isCollapsed && (
        <>
          {/* Right edge swipe area for right-side sidebar */}
          <div
            className="fixed right-0 top-0 bottom-0 w-12 z-20 md:hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </>
      )}

      {/* Always render sidebar, but hide collapsed mobile version */}
      <div
        ref={sidebarRef}
        className={`${
          isCollapsed
            ? 'hidden w-16 md:sticky md:top-16 md:flex md:h-[calc(100vh-4rem)] md:self-start'
            : 'fixed right-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 md:sticky md:top-16 md:z-auto md:self-start'
        } shrink-0 flex-col border-l border-[var(--line)] bg-[var(--deep)] ${className || ''}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex-1 px-2 py-3 md:px-3 md:py-4">
          {!isCollapsed && (
            <p className="ocean-kicker mb-3 px-2 md:mb-4 md:px-3">Tools</p>
          )}

          <nav className="space-y-1">
            {menu.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                aria-label={item.title}
                title={item.title}
                className={({ isActive }) => `
                flex items-center px-3 py-2 text-sm
                ${isActive ? 'text-[var(--glow)]' : 'text-[var(--sea-muted)] hover:text-[var(--ink)]'}
              `}
              >
                <item.icon
                  className={`${isCollapsed ? 'w-4 h-4' : 'w-4 h-4 mr-3'} flex-shrink-0`}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            ))}

          </nav>
        </div>

        {/* Toggle Button */}
        <div className="border-t border-[var(--line)] p-2 md:p-3">
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="ocean-kicker h-10 w-full justify-start text-[var(--sea-muted)] hover:bg-transparent hover:text-[var(--glow)] md:h-auto"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
            )}
            {!isCollapsed && (
              <span className="ml-2 text-sm md:text-base group-hover:translate-x-1 transition-transform">
                Collapse
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
