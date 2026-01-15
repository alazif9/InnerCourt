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
        <div className="flex justify-around items-center py-3 px-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-2xl">
          {navItems.map((item) => {
            const active = isActive(item.page);
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center gap-1 px-4 py-2"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-colors relative z-10",
                    active ? "text-amber-400" : "text-white/50"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium tracking-wide relative z-10",
                    active ? "text-amber-400" : "text-white/50"
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