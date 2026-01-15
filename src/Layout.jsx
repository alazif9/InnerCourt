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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0A0A0F;
        }
        
        .font-mystical {
          font-family: 'Cinzel', serif;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .text-gradient-gold {
          background: linear-gradient(135deg, #D4AF37 0%, #F5D67A 50%, #D4AF37 100%);
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