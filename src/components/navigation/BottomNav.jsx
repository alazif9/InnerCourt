import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TreePine, BookOpen, BarChart3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const navItems = [
  { icon: TreePine, label: 'TREE', page: 'Home', symbol: '△' },
  { icon: BookOpen, label: 'JOURNAL', page: 'Journal', symbol: '◐' },
  { icon: BarChart3, label: 'ANALYTICS', page: 'Analytics', symbol: '▭' },
  { icon: Eye, label: 'NETWORK', page: 'Friends', symbol: '◎' },
];

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (page) => {
    const pageUrl = createPageUrl(page);
    return location.pathname === pageUrl || 
           (page === 'Home' && location.pathname === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-1 bg-black border-t border-[#ffffff]/30">
          {navItems.map((item) => {
            const active = isActive(item.page);
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-4 py-2 transition-all",
                  active && "border border-[#ffffff]/50 rounded bg-[#ffffff]/5"
                )}
                style={active ? { boxShadow: '0 0 10px rgba(212,175,55,0.2)' } : {}}
              >
                <span 
                  className={cn(
                    "text-base transition-colors",
                    active ? "text-[#ffffff]" : "text-white/40"
                  )}
                >
                  {item.symbol}
                </span>
                <span 
                  className={cn(
                    "text-[9px] font-data tracking-wider relative z-10",
                    active ? "text-[#ffffff]" : "text-white/40"
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