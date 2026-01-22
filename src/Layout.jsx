import React from 'react';
import OccultBackground from './components/ui/OccultBackground';
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'IBM Plex Mono', monospace;
          background-color: #000000;
          color: #e8e8f0;
        }
        
        .font-occult {
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.05em;
        }
        
        .font-data {
          font-family: 'IBM Plex Mono', monospace;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .text-gradient-gold {
          background: linear-gradient(135deg, #d4af37 0%, #f5d67a 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .text-gradient-silver {
          background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>

      {/* Occult background layers */}
      <OccultBackground />

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