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
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-ocean-deep/95 backdrop-blur-md border-r border-ocean-surface h-screen flex flex-col transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-ocean-surface">
        <div className="flex items-center justify-center">
          <img 
            src={doloniaLogo} 
            alt="Dolonia Logo" 
            className={`${isCollapsed ? 'w-8 h-8' : 'w-16 h-16'} transition-all duration-300`}
          />
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
                flex items-center px-3 py-2 rounded-lg transition-all duration-300
                ${isActive 
                  ? 'bg-ocean-surface/50 text-cyan-bright border-l-2 border-cyan-bright' 
                  : 'hover:bg-ocean-surface/30 text-cyan-soft hover:text-cyan-bright'
                }
              `}
            >
              <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              {!isCollapsed && <span className="font-medium">{item.title}</span>}
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
          className="w-full text-cyan-soft hover:text-cyan-bright hover:bg-ocean-surface/30"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
}