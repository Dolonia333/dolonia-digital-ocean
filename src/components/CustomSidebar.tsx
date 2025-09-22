import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Layers, 
  Shield, 
  DollarSign, 
  Users, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import doloniaLogo from '@/assets/dolonia-logo.png';

const navigation = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Services', url: '/services', icon: Settings },
  { title: 'Solutions', url: '/solutions', icon: Layers },
  { title: 'Security', url: '/security', icon: Shield },
  { title: 'Pricing', url: '/pricing', icon: DollarSign },
  { title: 'About', url: '/about', icon: Users },
  { title: 'Contact', url: '/contact', icon: MessageSquare },
];

interface CustomSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CustomSidebar({ isCollapsed, onToggle }: CustomSidebarProps) {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-ocean-deep/95 backdrop-blur-md border-l border-ocean-surface h-screen flex flex-col transition-all duration-300 shadow-2xl`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-ocean-surface">
        <div className="flex items-center justify-center">
          <div className="relative group">
            <img 
              src={doloniaLogo} 
              alt="Dolonia Logo" 
              className={`${isCollapsed ? 'h-8 w-auto max-w-8' : 'h-16 w-auto max-w-16'} transition-all duration-300 object-contain hover:animate-pulse`}
            />
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <img 
                src={doloniaLogo} 
                alt="" 
                className={`${isCollapsed ? 'h-8 w-auto max-w-8' : 'h-16 w-auto max-w-16'} object-contain absolute inset-0 text-red-500 mix-blend-multiply animate-pulse`}
                style={{ 
                  filter: 'hue-rotate(180deg) contrast(200%)',
                  transform: 'translate(-2px, 0px) scale(1.02)'
                }}
              />
              <img 
                src={doloniaLogo} 
                alt="" 
                className={`${isCollapsed ? 'h-8 w-auto max-w-8' : 'h-16 w-auto max-w-16'} object-contain absolute inset-0 text-cyan-500 mix-blend-multiply animate-pulse delay-75`}
                style={{ 
                  filter: 'hue-rotate(90deg) contrast(200%)',
                  transform: 'translate(2px, 0px) scale(0.98)'
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
      <div className="flex-1 px-3 py-4">
        {!isCollapsed && (
          <p className="text-cyan-soft/70 text-xs uppercase tracking-wider mb-4 px-3">
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
                flex items-center px-3 py-2 rounded-lg transition-all duration-300 group
                ${isActive 
                  ? 'bg-ocean-surface/50 text-cyan-bright border-r-2 border-cyan-bright shadow-lg transform scale-105' 
                  : 'hover:bg-ocean-surface/30 text-cyan-soft hover:text-cyan-bright hover:shadow-md hover:scale-105'
                }
              `}
            >
              <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0 group-hover:rotate-3 transition-transform duration-300`} />
              {!isCollapsed && <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Toggle Button */}
      <div className="p-3 border-t border-ocean-surface">
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="w-full text-cyan-soft hover:text-cyan-bright hover:bg-ocean-surface/30 hover:scale-105 transition-all duration-300 group"
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />}
          {!isCollapsed && <span className="ml-2 group-hover:translate-x-1 transition-transform">Collapse</span>}
        </Button>
      </div>
    </div>
  );
}