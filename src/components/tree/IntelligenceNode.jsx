import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const nodeConfig = {
  SOL: { symbol: '☉', sephira: 'TIPHARETH', archetype: 'The Self', hex: '0x6A3F' },
  SAGE: { symbol: '☿', sephira: 'BINAH', archetype: 'The Sage', hex: '0x3B21' },
  HERO: { symbol: '♂', sephira: 'CHOKMAH', archetype: 'The Hero', hex: '0x2C15' },
  MOTHER: { symbol: '♀', sephira: 'CHESED', archetype: 'The Mother', hex: '0x4D28' },
  SHADOW: { symbol: '♄', sephira: 'GEBURAH', archetype: 'The Shadow', hex: '0x5E37' },
  ANIMA: { symbol: '♃', sephira: 'NETZACH', archetype: 'The Anima', hex: '0x7F4A' },
  CHILD: { symbol: '☽', sephira: 'YESOD', archetype: 'The Child', hex: '0x8G52' },
  TRICKSTER: { symbol: '☊', sephira: 'HOD', archetype: 'The Trickster', hex: '0x1A09' },
};

export default function IntelligenceNode({ 
  name, 
  size = 'md', 
  onClick 
}) {
  const config = nodeConfig[name] || nodeConfig.SOL;
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-11 h-11',
    lg: 'w-12 h-12',
  };

  const symbolSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      className="relative group flex flex-col items-center"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer glow pulse */}
      <motion.div
        className={cn(sizeClasses[size], "absolute rounded-full")}
        style={{ 
          boxShadow: '0 0 20px rgba(255,255,255,0.15)',
        }}
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Main node circle */}
      <div
        className={cn(
          sizeClasses[size],
          "relative rounded-full bg-black/80 backdrop-blur-sm",
          "border border-white/40 flex items-center justify-center",
          "transition-all duration-300 group-hover:border-white/60"
        )}
        style={{ 
          boxShadow: '0 0 15px rgba(255,255,255,0.12), inset 0 0 8px rgba(255,255,255,0.05)'
        }}
      >
        {/* Central symbol */}
        <span className={cn(symbolSizes[size], "font-occult relative z-10 text-white/90")}>
          {config.symbol}
        </span>
      </div>

      {/* Archetype Label - below sphere */}
      <div className="mt-1.5 text-center">
        <div className="font-data text-[8px] tracking-wider whitespace-nowrap text-white/60">
          {config.archetype}
        </div>
        <div className="font-data text-[6px] tracking-wider whitespace-nowrap text-white/30">
          {config.sephira}
        </div>
      </div>
    </motion.button>
  );
}