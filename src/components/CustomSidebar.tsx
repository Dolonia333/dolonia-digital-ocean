import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Settings,
  Layers,
  Shield,
  DollarSign,
  Users,
  MessageSquare,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import doloniaLogo from "@/assets/dolonia-logo.png";

const navigation = [
  { title: "Home", url: "/", icon: Home },
  { title: "Services", url: "/services", icon: Settings },
  { title: "Solutions", url: "/solutions", icon: Layers },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Pricing", url: "/pricing", icon: DollarSign },
  { title: "About", url: "/about", icon: Users },
  { title: "Blog", url: "/blog", icon: BookOpen },
  { title: "Contact", url: "/contact", icon: MessageSquare },
];

interface CustomSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function CustomSidebar({
  isCollapsed,
  onToggle,
  className,
}: CustomSidebarProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger if horizontal movement is greater than vertical (clear horizontal swipe)
    // and meets minimum distance
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay - only show when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
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
          // Mobile: overlay, smaller width, touch-friendly
          isCollapsed ? "w-14 md:w-16 hidden md:flex" : "w-48 md:w-64"
        } bg-ocean-deep/95 backdrop-blur-md border-l border-ocean-surface h-screen flex flex-col transition-all duration-300 shadow-2xl fixed md:relative right-0 top-0 z-40 md:z-auto ${
          className || ""
        }`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Logo Section */}
        <div className="p-3 md:p-6 border-b border-ocean-surface">
          <div className="flex items-center justify-center">
            <div className="relative group">
              <img
                src={doloniaLogo}
                alt="Dolonia Logo"
                className={`${
                  isCollapsed
                    ? "h-6 w-auto max-w-6 md:h-8 md:w-auto md:max-w-8"
                    : "h-10 w-auto max-w-10 md:h-16 md:w-auto md:max-w-16"
                } transition-all duration-300 object-contain hover:animate-pulse`}
              />
              {/* Glitch effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <img
                  src={doloniaLogo}
                  alt=""
                  className={`${
                    isCollapsed ? "h-8 w-auto max-w-8" : "h-16 w-auto max-w-16"
                  } object-contain absolute inset-0 text-red-500 mix-blend-multiply animate-pulse`}
                  style={{
                    filter: "hue-rotate(180deg) contrast(200%)",
                    transform: "translate(-2px, 0px) scale(1.02)",
                  }}
                />
                <img
                  src={doloniaLogo}
                  alt=""
                  className={`${
                    isCollapsed ? "h-8 w-auto max-w-8" : "h-16 w-auto max-w-16"
                  } object-contain absolute inset-0 text-cyan-500 mix-blend-multiply animate-pulse delay-75`}
                  style={{
                    filter: "hue-rotate(90deg) contrast(200%)",
                    transform: "translate(2px, 0px) scale(0.98)",
                  }}
                />
              </div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h2 className="text-cyan-bright font-bold text-lg">Dolonia</h2>
                <p className="text-cyan-soft text-xs">Data Tech</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-2 md:px-3 py-3 md:py-4">
          {!isCollapsed && (
            <p className="text-cyan-soft/70 text-xs uppercase tracking-wider mb-3 md:mb-4 px-2 md:px-3">
              Navigation
            </p>
          )}

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) => `
                flex items-center px-2 md:px-3 py-3 md:py-2 rounded-lg transition-all duration-300 group
                ${
                  isActive
                    ? "bg-ocean-surface/50 text-cyan-bright border-r-2 border-cyan-bright shadow-lg transform scale-105"
                    : "hover:bg-ocean-surface/30 text-cyan-soft hover:text-cyan-bright hover:shadow-md hover:scale-105"
                }
              `}
              >
                <item.icon
                  className={`${
                    isCollapsed
                      ? "w-4 h-4 md:w-5 md:h-5"
                      : "w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3"
                  } flex-shrink-0 group-hover:rotate-3 transition-transform duration-300`}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm md:text-base group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Toggle Button */}
        <div className="p-2 md:p-3 border-t border-ocean-surface">
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="w-full text-cyan-soft hover:text-cyan-bright hover:bg-ocean-surface/30 hover:scale-105 transition-all duration-300 group h-10 md:h-auto"
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
  );
}
