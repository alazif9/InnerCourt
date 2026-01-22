import React from 'react';
import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Header({ user }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Profile */}
        <Link 
          to={createPageUrl('Profile')}
          className="w-12 h-12 rounded-full bg-black border-2 border-white flex items-center justify-center overflow-hidden"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </Link>
        
        {/* Notification */}
        <button className="relative w-12 h-12 rounded-full bg-black border-2 border-white flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            1
          </span>
        </button>
      </div>
    </header>
  );
}