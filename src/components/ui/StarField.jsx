import React from 'react';

export default function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pure black with noise texture */}
      <div className="absolute inset-0 bg-black" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle deep purple accent in corners */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-900/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-indigo-900/10 to-transparent blur-3xl" />
    </div>
  );
}