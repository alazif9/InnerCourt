import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function Header({ user }) {
  // Fetch insights count for notification badge
  const { data: insights = [] } = useQuery({
    queryKey: ['insights', user?.email],
    queryFn: () => base44.entities.Insight.filter({ created_by: user?.email }, '-created_date', 10),
    enabled: !!user?.email,
  });

  const unreadCount = insights.filter(i => i.priority === 'HIGH').length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between py-2 px-3 bg-black border-b border-[#ffffff]/40">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#ffffff]/60 flex items-center justify-center">
              <span className="text-xs text-[#ffffff]">☉</span>
            </div>
            <span className="font-occult text-sm font-medium text-[#ffffff] tracking-wider">
              Inner Court
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link 
              to={createPageUrl('Insights')}
              className="relative p-1 hover:bg-white/5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-white/50" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse" />
              )}
            </Link>
            
            <Link 
              to={createPageUrl('Profile')}
              className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover grayscale" />
              ) : (
                <User className="w-3 h-3 text-white/50" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}