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
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2 px-3 rounded-md bg-black/60 backdrop-blur-md border border-[#d4af37]/30">
          {navItems.map((item) => {
            const active = isActive(item.page);
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
              >
                {active && (
                  <div className="absolute inset-0 rounded border border-[#d4af37]/40 bg-[#d4af37]/5" />
                )}
                <item.icon 
                  className={cn(
                    "w-4 h-4 transition-colors relative z-10",
                    active ? "text-[#d4af37]" : "text-white/40"
                  )} 
                />
                <span 
                  className={cn(
                    "text-[10px] font-data tracking-wider uppercase relative z-10",
                    active ? "text-[#d4af37]" : "text-white/40"
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