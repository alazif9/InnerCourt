import React from 'react';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Header({ user }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between py-2 px-4 rounded-md bg-black/60 backdrop-blur-md border border-[#d4af37]/30">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-[#d4af37]/50 flex items-center justify-center">
              <span className="text-sm text-[#d4af37]">☉</span>
            </div>
            <span className="font-occult text-base font-medium text-[#d4af37] tracking-wider">
              SOL SYSTEM
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded border border-[#c0c0c0]/30 hover:border-[#c0c0c0]/50 transition-colors">
              <Bell className="w-4 h-4 text-[#c0c0c0]/70" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00cccc] rounded-full" />
            </button>
            
            <Link 
              to={createPageUrl('Profile')}
              className="w-7 h-7 rounded border border-[#c0c0c0]/30 flex items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover grayscale" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#c0c0c0]/70" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}