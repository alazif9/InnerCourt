import React from 'react';
import StarField from './components/ui/StarField';
import Header from './components/navigation/Header';
import BottomNav from './components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Layout({ children, currentPageName }) {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const hideNavPages = ['Onboarding', 'ArchetypeChat'];
  const showNav = !hideNavPages.includes(currentPageName);

  return (
    <div className="min-h-screen relative">
      {/* Custom CSS for fonts and gradients */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Share+Tech+Mono&display=swap');
        
        body {
          font-family: 'Share Tech Mono', monospace;
          background-color: #000000;
          color: #00ff00;
        }
        
        /* Terminal text glow */
        .terminal-glow {
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.7), 0 0 10px rgba(0, 255, 0, 0.3);
        }
        
        /* Dungeon text */
        .dungeon-text {
          font-family: 'VT323', monospace;
          color: #d97706;
          text-shadow: 0 0 8px rgba(217, 119, 6, 0.5);
        }
        
        /* CRT flicker */
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.97; }
        }
        
        body {
          animation: flicker 0.15s infinite;
        }
        
        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>

      {/* Animated star background */}
      <StarField />

      {/* Header */}
      {showNav && <Header user={user} />}

      {/* Main content */}
      <main className={`relative z-10 ${showNav ? 'pt-24 pb-28' : ''}`}>
        <div className="max-w-md mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      {showNav && <BottomNav />}
    </div>
  );
}