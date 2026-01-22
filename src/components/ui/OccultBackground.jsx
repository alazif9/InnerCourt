import React from 'react';
import { motion } from 'framer-motion';

export default function OccultBackground() {
  const alchemicalSymbols = ['☉', '☿', '☽', '♄', '♃', '♂', '♀', '⊕', '☊', '☋'];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Pure black with noise */}
      <div className="absolute inset-0 bg-black" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Layer 2: Technical grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,204,204,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,204,204,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Layer 3: Constellation dots */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
        />
      ))}
      
      {/* Layer 4: Scattered alchemical symbols */}
      {alchemicalSymbols.map((symbol, i) => (
        <div
          key={`symbol-${i}`}
          className="absolute text-[#d4af37]/[0.03] text-2xl font-occult select-none"
          style={{
            left: `${10 + (i * 9)}%`,
            top: `${15 + (i % 3) * 30}%`,
            transform: `rotate(${i * 15}deg)`,
          }}
        >
          {symbol}
        </div>
      ))}
      
      {/* Subtle purple glow corners */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-900/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-[#8b4789]/5 to-transparent blur-3xl" />
    </div>
  );
}