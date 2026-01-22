import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TreePine, BookOpen, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const navItems = [
  { icon: TreePine, label: 'Tree', page: 'Home' },
  { icon: BookOpen, label: 'Journal', page: 'Journal' },
  { icon: BarChart3, label: 'Analytics', page: 'Analytics' },
  { icon: Eye, label: 'Insights', page: 'Insights' },
];

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (page) => {
    const pageUrl = createPageUrl(page);
    return location.pathname === pageUrl || 
           (page === 'Home' && location.pathname === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-4 px-6 rounded-full bg-black border-2 border-green-500" style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}>
          {navItems.map((item) => {
            const active = isActive(item.page);
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all border-2",
                  active 
                    ? "bg-green-500 border-green-400" 
                    : "bg-transparent border-green-700"
                )}
                style={active ? { boxShadow: '0 0 15px rgba(0, 255, 0, 0.6)' } : {}}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      active ? "text-black" : "text-green-500"
                    )} 
                  />
                </div>
                <span 
                  className={cn(
                    "text-xs font-mono uppercase tracking-wide terminal-glow",
                    active ? "text-green-400" : "text-green-700"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}