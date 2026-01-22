import React from 'react';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Header({ user }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between py-3 px-5 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              animate={{ 
                boxShadow: [
                  '0 0 15px rgba(251, 191, 36, 0.3)',
                  '0 0 25px rgba(251, 191, 36, 0.5)',
                  '0 0 15px rgba(251, 191, 36, 0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-lg">☀️</span>
            </motion.div>
            <span className="font-['Cinzel',serif] text-lg font-semibold text-white tracking-wider">
              SOL
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            
            <Link 
              to={createPageUrl('Profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/30 to-amber-500/30 border border-white/20 flex items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-white/70" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}