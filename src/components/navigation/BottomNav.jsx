import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TreePine, BookOpen, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const navItems = [
  { icon: TreePine, label: 'Tree', page: 'Home', sigil: '△' },
  { icon: BookOpen, label: 'Journal', page: 'Journal', sigil: '◐' },
  { icon: BarChart3, label: 'Analytics', page: 'Analytics', sigil: '▭' },
  { icon: Eye, label: 'Insights', page: 'Insights', sigil: '◉' },
];

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (page) => {
    const pageUrl = createPageUrl(page);
    return location.pathname === pageUrl || 
           (page === 'Home' && location.pathname === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2 px-2 rounded bg-black/80 backdrop-blur-md border border-[#d4af37]/20">
          {navItems.map((item) => {
            const active = isActive(item.page);
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center gap-0.5 px-4 py-1"
              >
                {active && (
                  <div 
                    className="absolute inset-0 rounded border bg-[#d4af37]/5" 
                    style={{ 
                      borderColor: 'rgba(212,175,55,0.4)',
                      boxShadow: '0 0 10px rgba(212,175,55,0.2)'
                    }}
                  />
                )}
                <span 
                  className={cn(
                    "text-base font-occult relative z-10 transition-colors",
                    active ? "text-[#d4af37]" : "text-white/30"
                  )}
                >
                  {item.sigil}
                </span>
                <span 
                  className={cn(
                    "text-[8px] font-data tracking-[0.15em] uppercase relative z-10",
                    active ? "text-[#d4af37]" : "text-white/30"
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