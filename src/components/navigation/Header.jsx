import React from 'react';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Header({ user }) {
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
              SOL SYSTEM
            </span>
          </Link>

          {/* Center micro-text */}
          <div className="hidden sm:block font-data text-[8px] text-[#00cccc]/50 tracking-widest">
            INTELLIGENCE INTERFACE ACTIVE
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative p-1 hover:bg-white/5 transition-colors">
              <Bell className="w-3.5 h-3.5 text-white/50" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse" />
            </button>
            
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